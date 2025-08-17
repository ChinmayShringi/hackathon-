import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    X,
    Loader2,
    CreditCard,
    Bitcoin,
    Shield,
    Zap,
    ExternalLink,
    AlertCircle
} from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: {
        id: string;
        name: string;
        price: number;
        credits: number;
        type: 'credits' | 'subscription';
    };
}

interface PaymentStatus {
    status: 'pending' | 'processing' | 'success' | 'failed';
    message: string;
    checkoutUrl?: string;
    error?: string;
}

export default function CoinbasePaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
        status: 'pending',
        message: 'Preparing your payment...'
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && plan) {
            createCheckoutSession();
        }
    }, [isOpen, plan]);

    const createCheckoutSession = async () => {
        if (!plan) return;

        setIsLoading(true);
        setPaymentStatus({
            status: 'processing',
            message: 'Creating checkout session...'
        });

        try {
            const response = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: plan.id,
                    planType: plan.type,
                    amount: plan.price,
                    currency: 'USD',
                    description: `${plan.name} - ${plan.type === 'credits' ? `${plan.credits} Credits` : 'Monthly Subscription'}`,
                    credits: plan.credits
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { checkoutUrl, sessionId, chargeId } = await response.json();

            if (checkoutUrl) {
                setPaymentStatus({
                    status: 'pending',
                    message: 'Redirecting to Coinbase checkout...',
                    checkoutUrl
                });

                // Redirect to Coinbase checkout
                setTimeout(() => {
                    window.location.href = checkoutUrl;
                }, 1500);
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus({
                status: 'failed',
                message: 'Failed to create checkout session',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setPaymentStatus({
            status: 'pending',
            message: 'Preparing your payment...'
        });
        createCheckoutSession();
    };

    const handleExternalCheckout = () => {
        if (paymentStatus.checkoutUrl) {
            window.open(paymentStatus.checkoutUrl, '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-white text-xl mb-2">
                        Complete Your Purchase
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                        {plan.name} - ${plan.price}
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Plan Summary */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300 text-sm">Plan:</span>
                            <span className="text-white font-medium">{plan.name}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300 text-sm">Credits:</span>
                            <span className="text-white font-medium">{plan.credits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Total:</span>
                            <span className="text-white font-bold text-lg">${plan.price}</span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="text-center">
                        {paymentStatus.status === 'pending' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-accent-blue animate-spin" />
                                </div>
                                <p className="text-gray-300">{paymentStatus.message}</p>
                                {paymentStatus.checkoutUrl && (
                                    <Button
                                        onClick={handleExternalCheckout}
                                        className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-xl"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Open Coinbase Checkout
                                    </Button>
                                )}
                            </div>
                        )}

                        {paymentStatus.status === 'processing' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-accent-blue animate-spin" />
                                </div>
                                <p className="text-gray-300">{paymentStatus.message}</p>
                            </div>
                        )}

                        {paymentStatus.status === 'success' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <Check className="h-8 w-8 text-green-400" />
                                </div>
                                <p className="text-green-400 font-medium">Payment Successful!</p>
                                <p className="text-gray-300 text-sm">
                                    Your credits have been added to your account.
                                </p>
                                <Button
                                    onClick={onClose}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    Continue
                                </Button>
                            </div>
                        )}

                        {paymentStatus.status === 'failed' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <AlertCircle className="h-8 w-8 text-red-400" />
                                </div>
                                <p className="text-red-400 font-medium">Payment Failed</p>
                                <p className="text-gray-300 text-sm">
                                    {paymentStatus.error || 'An error occurred while processing your payment.'}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleRetry}
                                        className="flex-1 bg-accent-blue hover:bg-accent-blue/80"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={onClose}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Methods Info */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <CreditCard className="h-4 w-4" />
                                <span>Cards</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <Bitcoin className="h-4 w-4" />
                                <span>Crypto</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                            <Shield className="h-3 w-3" />
                            <span>Secured by Coinbase Commerce</span>
                        </div>
                    </div>

                    {/* Close Button */}
                    {paymentStatus.status === 'pending' && (
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
