import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Mail, Chrome, Sparkles, Zap, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirstTimeVisitor } from "@/hooks/useFirstTimeVisitor";

interface AuthSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  recipeName?: string;
}

export default function AuthSignupModal({ isOpen, onClose, onSwitchToSignIn, recipeName }: AuthSignupModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { markSignedUp } = useFirstTimeVisitor();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      markSignedUp();

      toast({
        title: "Redirecting to Sign Up",
        description: "You'll be taken to our secure sign up page",
      });
      setTimeout(() => {
        window.location.href = "/api/auth/user";
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    markSignedUp();
    
    toast({
      title: "Redirecting to Google",
      description: "You'll be taken to Google to sign up",
    });
    setTimeout(() => {
      window.location.href = "/api/auth/user";
    }, 1000);
  };

  const benefits = [
    { icon: Sparkles, text: "Generate unlimited content with AI" },
    { icon: Zap, text: "Access to premium recipes and models" },
    { icon: Star, text: "Save and organize your creations" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card-bg border-card-border">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-bold text-white">
            Start Creating Amazing Content
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {recipeName ? (
              <>Get started with <span className="text-accent-blue font-medium">{recipeName}</span> and unlock your creative potential</>
            ) : (
              "Join thousands of creators making professional content with AI"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Benefits showcase */}
          <div className="bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 p-4 rounded-lg border border-accent-blue/20">
            <h3 className="text-sm font-semibold text-white mb-3">What you'll get:</h3>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-accent-blue/20 rounded">
                    <benefit.icon className="h-3 w-3 text-accent-blue" />
                  </div>
                  <span className="text-xs text-gray-300">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Sign Up */}
          <Button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
          >
            <Chrome className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card-bg text-gray-400">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-gray-300">
                Email address
              </Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-accent-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-accent-blue"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Switch to Sign In */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToSignIn}
                className="text-accent-blue hover:text-accent-purple transition-colors font-medium inline-flex items-center"
              >
                Sign In
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}