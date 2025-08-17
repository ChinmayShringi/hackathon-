import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    Loader2,
    ArrowRight,
    Home,
    Zap,
    CreditCard,
    Bitcoin
} from "lucide-react";

export default function PaymentSuccess() {
    const [, setLocation] = useLocation();
    const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [paymentDetails, setPaymentDetails] = useState<any>(null);

    useEffect(() => {
        // Get charge ID from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const chargeId = urlParams.get('charge');

        if (chargeId) {
            verifyPayment(chargeId);
        } else {
            setPaymentStatus('failed');
        }
    }, []);

    const verifyPayment = async (chargeId: string) => {
        try {
            const response = await fetch(`/api/payments/success?charge=${chargeId}`);

            if (response.ok) {
                setPaymentStatus('success');
                // You can fetch additional payment details here if needed
            } else {
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
        }
    };

    const handleContinue = () => {
        setLocation('/dashboard');
    };

    const handleGoHome = () => {
        setLocation('/');
    };

    if (paymentStatus === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-dark flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                    <CardContent className="text-center py-12">
                        <Loader2 className="h-12 w-12 text-accent-blue animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Verifying Payment</h2>
                        <p className="text-gray-400">Please wait while we confirm your payment...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-dark flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-white text-xl mb-2">Payment Verification Failed</CardTitle>
                        <p className="text-gray-400 text-sm">
                            We couldn't verify your payment. Please contact support if you believe this is an error.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            className="w-full"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-dark flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-400" />
                    </div>
                    <CardTitle className="text-white text-2xl mb-2">Payment Successful!</CardTitle>
                    <p className="text-gray-400 text-sm">
                        Your credits have been added to your account. You can now start creating amazing content!
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Success Summary */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-300 text-sm">Status:</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <Check className="mr-1 h-3 w-3" />
                                Confirmed
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-300 text-sm">Payment Method:</span>
                            <div className="flex items-center gap-2">
                                <Bitcoin className="h-4 w-4 text-accent-blue" />
                                <span className="text-white text-sm">Coinbase Commerce</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Transaction ID:</span>
                            <span className="text-white text-sm font-mono">
                                {new URLSearchParams(window.location.search).get('charge')?.slice(-8)}...
                            </span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-accent-blue/10 rounded-lg p-4 border border-accent-blue/20">
                        <h3 className="text-accent-blue font-semibold mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            What's Next?
                        </h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Your credits are now available in your account</li>
                            <li>• Start creating videos with our AI-powered recipes</li>
                            <li>• Explore premium features and advanced options</li>
                            <li>• Check your dashboard for usage statistics</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleContinue}
                            className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-xl"
                        >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Go to Dashboard
                        </Button>

                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            className="w-full"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </div>

                    {/* Support Info */}
                    <div className="text-center text-gray-400 text-xs">
                        <p>Need help? Contact our support team</p>
                        <p>or check our documentation for guides</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
