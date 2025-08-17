import { Link } from "wouter";
import { ReactNode, useState } from "react";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { User, LogOut, Flame, X } from "lucide-react";
import dllLogo from "../assets/images/dll-logo.svg?url";
import { useQuery } from "@tanstack/react-query";

interface AlphaHeaderProps {
  rightContent?: ReactNode;
}

export default function AlphaHeader({ rightContent }: AlphaHeaderProps) {
  const { user, handleLogOut, setShowAuthFlow } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      if (!isLoggedIn) return null;
      const response = await fetch('/api/auth/user', { credentials: 'include' });
      if (response.ok) return response.json();
      return null;
    },
    enabled: isLoggedIn,
    refetchInterval: 30000,
  });

  const userCredits = userData?.credits || 0;

  const handleLogout = async () => {
    try {
      await handleLogOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLoginClick = () => {
    setShowAuthFlow(true);
  };

  return (
    <nav className="bg-card-bg border-b border-card-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link href="/">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src={dllLogo}
              alt="delula - live preview"
              className="h-8 w-auto text-white"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </Link>


        <div className="flex items-center space-x-4">

          {rightContent && (
            <div className="flex items-center">
              {rightContent}
            </div>
          )}


          {isLoggedIn && user ? (
            <div className="flex items-center space-x-3">

              <Link href="/alpha/account">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-accent-blue/20 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{user.firstName || user.username || user.email?.split('@')[0] || 'User'}</span>
                </Button>
              </Link>


              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (

            <Button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 