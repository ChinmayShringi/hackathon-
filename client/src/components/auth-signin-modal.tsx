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
import { Mail, Chrome, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirstTimeVisitor } from "@/hooks/useFirstTimeVisitor";

interface AuthSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function AuthSignInModal({ isOpen, onClose, onSwitchToSignUp }: AuthSignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { markSignedIn } = useFirstTimeVisitor();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mark as signed in since they're going through the signin flow
      markSignedIn();

      // Redirect to unified auth for email signin
      toast({
        title: "Redirecting to Sign In",
        description: "You'll be taken to our secure sign in page",
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

  const handleGoogleSignIn = () => {
    // Mark as signed in since they're going through the signin flow
    markSignedIn();
    
    toast({
      title: "Redirecting to Google",
      description: "You'll be taken to Google to sign in",
    });
    setTimeout(() => {
      window.location.href = "/api/auth/user";
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card-bg border-card-border">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-bold text-white">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Sign in to your account to continue creating amazing content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
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
              <span className="px-2 bg-card-bg text-gray-400">or sign in with email</span>
            </div>
          </div>

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-accent-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                "Signing In..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Switch to Sign Up */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Need an account?{" "}
              <button
                onClick={onSwitchToSignUp}
                className="text-accent-blue hover:text-accent-purple transition-colors font-medium inline-flex items-center"
              >
                Sign Up
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}