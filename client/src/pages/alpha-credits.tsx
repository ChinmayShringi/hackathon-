import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    Gift,
    Menu
} from "lucide-react";
import CoinbasePaymentModal from "@/components/coinbase-payment-modal";
import AlphaHeader from "@/components/alpha-header";

interface GuestStats {
    used: number;
    remaining: number;
    refreshSecondsLeft?: number;
}

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

export default function AlphaCredits() {
    const [selectedTab, setSelectedTab] = useState<'credits' | 'subscription'>('credits');
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch guest stats for the navigation badge
    const { data: guestStats } = useQuery<GuestStats>({
        queryKey: ['guest-stats'],
        queryFn: async () => {
            const response = await fetch('/api/alpha/guest-stats');
            if (!response.ok) {
                throw new Error('Failed to fetch guest stats');
            }
            return response.json();
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const handleCoinbaseCheckout = (plan: any, planType: 'credits' | 'subscription') => {
        setSelectedPlan({
            ...plan,
            type: planType
        });
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedPlan(null);
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Alpha Header with Navigation */}
            <AlphaHeader
                rightContent={
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => (window.location.href = "/alpha/my-makes")}
                                className="text-white hover:bg-accent-blue/20 relative"
                            >
                                My Makes
                                {guestStats && guestStats.used > 0 && (
                                    <Badge className="ml-2 bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                                        {guestStats.used}
                                    </Badge>
                                )}
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => (window.location.href = "/alpha/credits")}
                                className="bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/80 hover:to-accent-purple/80 text-white"
                            >
                                Get Credits
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden relative">
                            <Button
                                variant="ghost"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white hover:bg-accent-blue/20 relative"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            {/* Mobile Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-card-border rounded-lg shadow-lg z-50">
                                    <div className="p-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                window.location.href = "/alpha/my-makes";
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full justify-start text-white hover:bg-accent-blue/80"
                                        >
                                            My Makes
                                            {guestStats && guestStats.used > 0 && (
                                                <Badge className="ml-auto bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                                                    {guestStats.used}
                                                </Badge>
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                window.location.href = "/alpha/credits";
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full justify-start text-white hover:bg-accent-blue/80"
                                        >
                                            Get Credits
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }
            />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-accent-blue to-accent-purple py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Get Your Credits
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Choose the perfect plan for your creative needs. Pay with cryptocurrency via Coinbase Commerce.
                    </p>
                </div>
            </div>

            {/* Pricing Section */}
            <section>
                <div className="max-w-7xl mx-auto">
                    {/* Tab Selector */}
                    <div className="text-center mb-16">
                        <div className="inline-flex bg-gray-800 rounded-xl p-1 mb-12">
                            <button
                                onClick={() => setSelectedTab('credits')}
                                className={`px-8 py-3 rounded-lg font-medium transition-all ${selectedTab === 'credits'
                                    ? 'bg-accent-blue text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Credit Packages
                            </button>
                            <button
                                onClick={() => setSelectedTab('subscription')}
                                className={`px-8 py-3 rounded-lg font-medium transition-all ${selectedTab === 'subscription'
                                    ? 'bg-accent-blue text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Monthly Subscriptions
                            </button>
                        </div>
                    </div>

                    {/* Credit Packages */}
                    {selectedTab === 'credits' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {CREDIT_PACKAGES.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    className={`bg-card-bg border-gray-700 relative overflow-hidden hover:border-gray-600 transition-all ${pkg.popular ? 'border-accent-blue shadow-lg shadow-accent-blue/20' : ''
                                        }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-blue to-accent-purple text-white px-3 py-1 text-sm font-medium">
                                            Most Popular
                                        </div>
                                    )}

                                    <CardHeader className="text-center pb-4">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple p-0.5">
                                            <div className="bg-card-bg rounded-full w-full h-full flex items-center justify-center">
                                                <Zap className="h-8 w-8 text-accent-blue" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                                        <div className="text-3xl font-bold mb-1">
                                            <span className="text-success-green">{pkg.credits.toLocaleString()}</span>
                                            <span className="text-sm text-gray-400 ml-1">credits</span>
                                        </div>
                                        <div className="text-2xl font-bold">${pkg.price}</div>
                                        {pkg.originalPrice && (
                                            <div className="text-sm text-gray-400 line-through">${pkg.originalPrice}</div>
                                        )}
                                        {pkg.savings && (
                                            <Badge variant="secondary" className="mt-2">
                                                {pkg.savings}
                                            </Badge>
                                        )}
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <p className="text-gray-400 text-center mb-6">{pkg.description}</p>

                                        <ul className="space-y-3 mb-8">
                                            {pkg.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <Check className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                                                    <span className="text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => handleCoinbaseCheckout(pkg, 'credits')}
                                            className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/80 hover:to-accent-purple/80"
                                        >
                                            <Bitcoin className="mr-2 h-5 w-5" />
                                            Pay with Coinbase
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
                                    className="bg-card-bg border-gray-700 relative overflow-hidden hover:border-gray-600 transition-all"
                                >
                                    {plan.badge && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-blue to-accent-purple text-white px-3 py-1 text-sm font-medium">
                                            {plan.badge}
                                        </div>
                                    )}

                                    <CardHeader className="text-center pb-4">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-purple to-pink-500 p-0.5">
                                            <div className="bg-card-bg rounded-full w-full h-full flex items-center justify-center">
                                                <Crown className="h-8 w-8 text-accent-purple" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                                        <div className="text-3xl font-bold mb-1">
                                            <span className="text-success-green">{plan.monthlyCredits.toLocaleString()}</span>
                                            <span className="text-sm text-gray-400 ml-1">credits/month</span>
                                        </div>
                                        <div className="text-2xl font-bold">${plan.price}/month</div>
                                        {plan.bonusCredits > 0 && (
                                            <div className="text-sm text-accent-orange">
                                                +{plan.bonusCredits} bonus credits first month
                                            </div>
                                        )}
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <p className="text-gray-400 text-center mb-6">{plan.description}</p>

                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <Check className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                                                    <span className="text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => handleCoinbaseCheckout(plan, 'subscription')}
                                            className="w-full bg-gradient-to-r from-accent-purple to-pink-500 hover:from-accent-purple/80 hover:to-pink-500/80"
                                        >
                                            <Bitcoin className="mr-2 h-5 w-5" />
                                            Subscribe with Coinbase
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Security Message */}
                    <div className="text-center mt-16">
                        <div className="inline-flex items-center bg-gray-800 rounded-lg px-6 py-4">
                            <Shield className="h-6 w-6 text-accent-blue mr-3" />
                            <span className="text-gray-300">
                                Secure payments powered by Coinbase Commerce. Your cryptocurrency transactions are protected.
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Modal */}
            {isPaymentModalOpen && selectedPlan && (
                <CoinbasePaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={closePaymentModal}
                    plan={selectedPlan}
                />
            )}
        </div>
    );
}
