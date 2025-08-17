import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Github, 
  Chrome,
  Twitter,
  Facebook,
  Apple
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { toast } = useToast();

  const handleSocialLogin = (provider: string) => {
    // Redirect to unified auth system
    window.location.href = "/api/auth/user";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Welcome to MagicVidio
          </DialogTitle>
          <p className="text-center text-gray-400 text-sm">
            Choose your preferred sign-in method
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin('google')}
              className="w-full bg-white hover:bg-gray-100 text-black border border-gray-300 h-12"
            >
              <Chrome className="h-5 w-5 mr-3" />
              Continue with Google
            </Button>
            
            <Button
              onClick={() => handleSocialLogin('github')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white h-12"
            >
              <Github className="h-5 w-5 mr-3" />
              Continue with GitHub
            </Button>

            <Button
              onClick={() => handleSocialLogin('twitter')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white h-12"
            >
              <Twitter className="h-5 w-5 mr-3" />
              Continue with Twitter
            </Button>

            <Button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              <Facebook className="h-5 w-5 mr-3" />
              Continue with Facebook
            </Button>

            <Button
              onClick={() => handleSocialLogin('apple')}
              className="w-full bg-black hover:bg-gray-900 text-white h-12"
            >
              <Apple className="h-5 w-5 mr-3" />
              Continue with Apple
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}