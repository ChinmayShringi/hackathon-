import { Router } from "express";
import { requireAuth } from "./unified-auth";
import { storage } from "./storage";
import { z } from "zod";
import crypto from "crypto";
import { isAlphaSite } from "./config";

const router = Router();

// Coinbase Commerce configuration
const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET;
const COINBASE_BASE_URL = process.env.COINBASE_BASE_URL || 'https://api.commerce.coinbase.com';

// Validation schemas
const createCheckoutSchema = z.object({
  planId: z.string(),
  planType: z.enum(['credits', 'subscription']),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  description: z.string(),
  credits: z.number().positive()
});

// Credit packages configuration
const CREDIT_PACKAGES = {
  'starter': { credits: 50, price: 9.99 },
  'creator': { credits: 150, price: 24.99 },
  'pro': { credits: 400, price: 59.99 }
};

const SUBSCRIPTION_PLANS = {
  'monthly-basic': { monthlyCredits: 100, bonusCredits: 25, price: 19.99 },
  'monthly-pro': { monthlyCredits: 300, bonusCredits: 100, price: 49.99 },
  'monthly-studio': { monthlyCredits: 750, bonusCredits: 250, price: 99.99 }
};

// Create Coinbase Commerce checkout
async function createCoinbaseCheckout(data: {
  amount: number;
  currency: string;
  description: string;
  metadata: any;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!COINBASE_API_KEY) {
    throw new Error('Coinbase API key not configured');
  }

  const response = await fetch(`${COINBASE_BASE_URL}/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': COINBASE_API_KEY,
      'X-CC-Version': '2018-03-22'
    },
    body: JSON.stringify({
      name: data.description,
      description: data.description,
      local_price: {
        amount: data.amount.toString(),
        currency: data.currency
      },
      pricing_type: 'fixed_price',
      metadata: data.metadata,
      redirect_url: data.successUrl,
      cancel_url: data.cancelUrl,
      supported_digital_currencies: ['BTC', 'ETH', 'USDC', 'USDT', 'DAI']
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Coinbase API error: ${error}`);
  }

  return await response.json();
}

// Verify Coinbase webhook signature
function verifyCoinbaseWebhook(body: string, signature: string): boolean {
  if (!COINBASE_WEBHOOK_SECRET) {
    console.warn('Coinbase webhook secret not configured, skipping signature verification');
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', COINBASE_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Create checkout session
router.post('/create-checkout', requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const validated = createCheckoutSchema.parse(req.body);

    // Verify plan exists and price matches
    const planConfig = validated.planType === 'credits'
      ? CREDIT_PACKAGES[validated.planId as keyof typeof CREDIT_PACKAGES]
      : SUBSCRIPTION_PLANS[validated.planId as keyof typeof SUBSCRIPTION_PLANS];

    if (!planConfig) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    if (Math.abs(planConfig.price - validated.amount) > 0.01) {
      return res.status(400).json({ error: 'Price mismatch' });
    }

    // Create Coinbase Commerce checkout
    const checkoutData = await createCoinbaseCheckout({
      amount: validated.amount,
      currency: validated.currency,
      description: validated.description,
      metadata: {
        userId,
        planId: validated.planId,
        planType: validated.planType,
        credits: validated.credits
      },
      successUrl: `${req.protocol}://${req.hostname}${isAlphaSite() ? '/alpha/payment/success' : '/payment/success'}?charge={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${req.protocol}://${req.hostname}${isAlphaSite() ? '/alpha/credits' : '/pricing'}`
    });

    res.json({
      checkoutUrl: checkoutData.data.hosted_url,
      sessionId: checkoutData.data.code,
      chargeId: checkoutData.data.id
    });

  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook handler for Coinbase payment events
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-cc-webhook-signature'] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyCoinbaseWebhook(body, signature)) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    if (event.type === 'charge:confirmed') {
      const charge = event.data;
      const { userId, planId, planType, credits } = charge.metadata;

      // Process the successful payment
      await processSuccessfulPayment(userId, planId, planType, credits, charge);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Payment success page
router.get('/success', async (req, res) => {
  const chargeId = req.query.charge as string;

  if (!chargeId) {
    return res.redirect('/pricing?error=missing_charge');
  }

  try {
    // Verify payment status with Coinbase
    if (!COINBASE_API_KEY) {
      throw new Error('Coinbase API key not configured');
    }

    const response = await fetch(`${COINBASE_BASE_URL}/charges/${chargeId}`, {
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve charge details');
    }

    const charge = await response.json();

    if (charge.data.timeline.some((event: any) => event.status === 'COMPLETED')) {
      res.redirect(isAlphaSite() ? '/alpha?payment=success' : '/dashboard?payment=success');
    } else {
      res.redirect(isAlphaSite() ? '/alpha/credits?error=payment_pending' : '/pricing?error=payment_pending');
    }
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(isAlphaSite() ? '/alpha/credits?error=charge_invalid' : '/pricing?error=charge_invalid');
  }
});

// Process successful payment
async function processSuccessfulPayment(
  userId: string,
  planId: string,
  planType: 'credits' | 'subscription',
  credits: number,
  charge: any
) {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (planType === 'credits') {
      // Add credits to user account
      const newCredits = (user.credits || 0) + credits;
      await storage.updateUserCredits(userId, newCredits);

      // Record credit transaction
      await storage.createCreditTransaction({
        userId,
        amount: credits,
        type: 'purchase',
        description: `Credit purchase: ${planId}`,
        paymentId: charge.id,
        metadata: { planId, chargeId: charge.id, paymentMethod: 'coinbase' }
      });

    } else {
      // Handle subscription logic
      const planConfig = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
      const totalCredits = planConfig.monthlyCredits + planConfig.bonusCredits;

      const newCredits = (user.credits || 0) + totalCredits;
      await storage.updateUserCredits(userId, newCredits);

      // Record subscription transaction
      await storage.createCreditTransaction({
        userId,
        amount: totalCredits,
        type: 'subscription',
        description: `Monthly subscription: ${planId}`,
        paymentId: charge.id,
        metadata: {
          planId,
          chargeId: charge.id,
          monthlyCredits: planConfig.monthlyCredits,
          bonusCredits: planConfig.bonusCredits,
          paymentMethod: 'coinbase'
        }
      });
    }

    console.log(`Payment processed successfully for user ${userId}: ${credits} credits via Coinbase`);

  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

export default router;