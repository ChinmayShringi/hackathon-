import { useState } from "react";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 100,
    price: 9.99,
    popular: false,
    features: [
      "100 Credits",
      "Access to all recipes",
      "Basic support",
      "Download generated content",
      "30-day credit validity"
    ],
    icon: Zap,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "creator",
    name: "Creator Pack",
    credits: 500,
    price: 39.99,
    popular: true,
    features: [
      "500 Credits",
      "Access to all recipes", 
      "Priority support",
      "Download generated content",
      "90-day credit validity",
      "Batch generation (coming soon)"
    ],
    icon: Star,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 1000,
    price: 69.99,
    popular: false,
    features: [
      "1000 Credits",
      "Access to all recipes",
      "Premium support",
      "Download generated content", 
      "120-day credit validity",
      "Batch generation (coming soon)",
      "API access (coming soon)"
    ],
    icon: Crown,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 5000,
    price: 299.99,
    popular: false,
    features: [
      "5000 Credits",
      "Access to all recipes",
      "Dedicated support",
      "Download generated content",
      "1-year credit validity",
      "Batch generation",
      "API access",
      "Custom recipes",
      "Team collaboration"
    ],
    icon: Rocket,
    color: "from-emerald-500 to-teal-500"
  }
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [purchasingPackage, setPurchasingPackage] = useState<string | null>(null);

  const purchaseMutation = useMutation({
    mutationFn: async (data: { amount: number; package: string }) => {
      return await apiRequest("POST", "/api/credits/purchase", data);
    },
    onSuccess: (data: any, variables) => {
      toast({
        title: "Credits Purchased Successfully!",
        description: `You now have ${data.newBalance} credits available.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setPurchasingPackage(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Sign In",
          description: "You need to be logged in to purchase credits.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/auth/user";
        }, 1000);
        return;
      }
      toast({
        title: "Purchase Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setPurchasingPackage(null);
    },
  });

  const handlePurchase = (pkg: typeof CREDIT_PACKAGES[0]) => {
    if (!isAuthenticated) {
                window.location.href = "/api/auth/user";
      return;
    }
    
    setPurchasingPackage(pkg.id);
    purchaseMutation.mutate({
      amount: pkg.credits,
      package: pkg.name
    });
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Choose Your
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                {" "}Creative Power
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Pay only for what you create. No subscriptions, no hidden fees. Start with free credits and scale as you grow.
            </p>
          </div>

          {/* Credit Usage Guide */}
          <div className="bg-card-bg rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">How Credits Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Text Overlays</h3>
                <p className="text-gray-400 text-sm mb-2">1-2 Credits</p>
                <p className="text-gray-500 text-xs">Add professional text, logos, and branding elements to existing images</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">AI Images</h3>
                <p className="text-gray-400 text-sm mb-2">4-8 Credits</p>
                <p className="text-gray-500 text-xs">Generate stunning AI images using our curated recipe prompts</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Premium Videos</h3>
                <p className="text-gray-400 text-sm mb-2">15-25 Credits</p>
                <p className="text-gray-500 text-xs">High-quality video generation with advanced AI models (coming soon)</p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {CREDIT_PACKAGES.map((pkg) => {
              const IconComponent = pkg.icon;
              const isPurchasing = purchasingPackage === pkg.id;
              
              return (
                <Card 
                  key={pkg.id} 
                  className={`bg-card-bg border-gray-700 relative overflow-hidden hover:border-gray-600 transition-all ${
                    pkg.popular ? 'border-accent-blue shadow-lg shadow-accent-blue/20' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-blue to-accent-purple text-white px-3 py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${pkg.color} p-0.5`}>
                      <div className="bg-card-bg rounded-full w-full h-full flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold mb-1">
                      <span className="text-success-green">{pkg.credits.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 ml-1">credits</span>
                    </div>
                    <div className="text-2xl font-bold">${pkg.price}</div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-success-green mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      disabled={isPurchasing || purchaseMutation.isPending}
                      className={`w-full ${
                        pkg.popular 
                          ? 'bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg' 
                          : `bg-gradient-to-r ${pkg.color} hover:shadow-lg`
                      } transition-all`}
                    >
                      {isPurchasing ? "Processing..." : "Purchase Now"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="bg-card-bg rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Do credits expire?</h3>
                <p className="text-gray-400 text-sm">Credits have different validity periods based on your package. Starter packs last 30 days, while Enterprise credits last a full year.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I get a refund?</h3>
                <p className="text-gray-400 text-sm">Yes, we offer a 7-day money-back guarantee for unused credits. Contact support for assistance.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and cryptocurrency payments for your convenience.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free tier?</h3>
                <p className="text-gray-400 text-sm">Yes! New users get 10 free credits to try our platform. Perfect for testing recipes before purchasing.</p>
              </div>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="text-center py-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Need More Than 5,000 Credits?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              For enterprises and agencies with high-volume content creation needs, 
              we offer custom pricing and dedicated support.
            </p>
            <Button
              onClick={() => window.location.href = "mailto:enterprise@magicvid.io"}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Contact Enterprise Sales
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}