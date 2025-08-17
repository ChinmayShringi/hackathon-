import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  CreditCard, 
  Smartphone, 
  Bitcoin, 
  Shield, 
  Zap, 
  Crown,
  Star,
  Gift
} from "lucide-react";
// Note: Paytweed integration will be handled server-side
// import * as Paytweed from "@paytweed/core-js";

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 9.99,
    originalPrice: 12.50,
    savings: "20% off",
    popular: false,
    description: "Perfect for trying out recipes",
    features: [
      "50 generation credits",
      "Access to all recipe categories",
      "Standard generation speed",
      "Community support"
    ]
  },
  {
    id: "creator",
    name: "Creator Bundle",
    credits: 150,
    price: 24.99,
    originalPrice: 37.50,
    savings: "33% off",
    popular: true,
    description: "Best value for active creators",
    features: [
      "150 generation credits",
      "Priority generation queue",
      "Access to premium recipes",
      "Email support",
      "Advanced customization options"
    ]
  },
  {
    id: "pro",
    name: "Pro Package",
    credits: 400,
    price: 59.99,
    originalPrice: 100.00,
    savings: "40% off",
    popular: false,
    description: "For professional content creators",
    features: [
      "400 generation credits",
      "Highest priority processing",
      "Early access to new features",
      "1-on-1 support sessions",
      "Commercial usage rights",
      "Bulk generation tools"
    ]
  }
];

const SUBSCRIPTION_PLANS = [
  {
    id: "monthly-basic",
    name: "Basic Monthly",
    monthlyCredits: 100,
    bonusCredits: 25,
    price: 19.99,
    description: "Consistent monthly allowance with bonus credits",
    features: [
      "100 monthly credits",
      "25 bonus credits (first month)",
      "Roll-over unused credits",
      "Cancel anytime",
      "Priority support"
    ],
    badge: null
  },
  {
    id: "monthly-pro",
    name: "Pro Monthly",
    monthlyCredits: 300,
    bonusCredits: 100,
    price: 49.99,
    description: "Perfect for professional creators",
    features: [
      "300 monthly credits", 
      "100 bonus credits (first month)",
      "Premium recipe access",
      "Advanced features",
      "Commercial usage rights",
      "Custom recipe requests"
    ],
    badge: "Most Popular"
  },
  {
    id: "monthly-studio",
    name: "Studio Monthly",
    monthlyCredits: 750,
    bonusCredits: 250,
    price: 99.99,
    description: "For agencies and content studios",
    features: [
      "750 monthly credits",
      "250 bonus credits (first month)",
      "Team collaboration tools",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options"
    ],
    badge: "Enterprise"
  }
];

interface PricingSectionProps {
  onSelectPlan?: (planId: string, planType: 'credits' | 'subscription') => void;
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [selectedTab, setSelectedTab] = useState<'credits' | 'subscription'>('credits');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const handlePaytweedCheckout = async (planId: string, planType: 'credits' | 'subscription') => {
    setProcessingPayment(planId);
    
    try {
      const plan = planType === 'credits' 
        ? CREDIT_PACKAGES.find(p => p.id === planId)
        : SUBSCRIPTION_PLANS.find(p => p.id === planId);

      if (!plan) return;

      // Create checkout session via our backend
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planType,
          amount: Math.round(plan.price * 100),
          currency: 'USD',
          description: `${plan.name} - ${planType === 'credits' ? `${(plan as any).credits} Credits` : 'Monthly Subscription'}`,
          credits: planType === 'credits' ? (plan as any).credits : (plan as any).monthlyCredits
        })
      });

      const { checkoutUrl } = await response.json();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setProcessingPayment(null);
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your 
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent"> Plan</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Flexible pricing for every creator. Pay as you go or save with monthly subscriptions.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex bg-gray-800 rounded-xl p-1 mb-12">
            <button
              onClick={() => setSelectedTab('credits')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedTab === 'credits'
                  ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="inline mr-2 h-4 w-4" />
              On-Demand Credits
            </button>
            <button
              onClick={() => setSelectedTab('subscription')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedTab === 'subscription'
                  ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="inline mr-2 h-4 w-4" />
              Monthly Plans
            </button>
          </div>
        </div>

        {/* Credit Packages */}
        {selectedTab === 'credits' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-accent-blue' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-gradient-to-r from-accent-blue to-accent-purple text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-2xl mb-2">{pkg.name}</CardTitle>
                  <p className="text-gray-400 mb-4">{pkg.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-white">${pkg.price}</span>
                      <span className="text-gray-400 line-through">${pkg.originalPrice}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      {pkg.savings}
                    </Badge>
                    <p className="text-sm text-gray-400">{pkg.credits} credits</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePaytweedCheckout(pkg.id, 'credits')}
                    disabled={processingPayment === pkg.id}
                    className={`w-full mt-6 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-xl'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {processingPayment === pkg.id ? 'Processing...' : 'Get Credits'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Subscription Plans */}
        {selectedTab === 'subscription' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 ${
                  plan.badge === 'Most Popular' ? 'ring-2 ring-accent-purple' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className={`${
                      plan.badge === 'Most Popular' 
                        ? 'bg-gradient-to-r from-accent-purple to-pink-500' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    } text-white`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-2xl mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">${plan.price}<span className="text-lg text-gray-400">/mo</span></div>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        <Gift className="mr-1 h-3 w-3" />
                        +{plan.bonusCredits} bonus
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{plan.monthlyCredits} monthly credits</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePaytweedCheckout(plan.id, 'subscription')}
                    disabled={processingPayment === plan.id}
                    className={`w-full mt-6 ${
                      plan.badge === 'Most Popular'
                        ? 'bg-gradient-to-r from-accent-purple to-pink-500 hover:shadow-xl'
                        : plan.badge === 'Enterprise'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-xl'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {processingPayment === plan.id ? 'Processing...' : 'Start Subscription'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Methods */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Secure Payment Options</h3>
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-300">
              <CreditCard className="h-6 w-6" />
              <span>Credit Cards</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Smartphone className="h-6 w-6" />
              <span>Apple Pay</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Google Pay</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Bitcoin className="h-6 w-6" />
              <span>Cryptocurrency</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Shield className="h-5 w-5" />
            <span>Bank-level security powered by Paytweed</span>
          </div>
        </div>
      </div>
    </section>
  );
}