import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useFirstTimeVisitor } from "@/hooks/useFirstTimeVisitor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, User, LogOut, Gift } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HamburgerMenu from "@/components/hamburger-menu";
import dllLogo from "../assets/images/dll-logo.svg?url";

interface NavigationProps {
  onClaimCreditsClick?: () => void;
  onSignInClick?: () => void;
}

export default function Navigation({ onClaimCreditsClick, onSignInClick }: NavigationProps = {}) {
  const { user, isAuthenticated } = useAuth();
  const { isFirstTimeVisitor } = useFirstTimeVisitor();
  const [location] = useLocation();

  const handleLogin = () => {
    if (onSignInClick) {
      onSignInClick();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleClaimCredits = () => {
    if (onClaimCreditsClick) {
      onClaimCreditsClick();
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-dark/80 backdrop-blur-lg border-b border-gray-800 z-[35]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-3">
                <img 
                  src={dllLogo} 
                  alt="delula - live preview" 
                  className="h-8 w-auto cursor-pointer"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                {user && user.accessRole && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.accessRole === 3 // Admin
                      ? 'bg-blue-500 text-white' 
                      : user.accessRole === 2 // Test
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white' // User
                  }`}>
                    {user.accessRole === 3 ? 'ADMIN' : user.accessRole === 2 ? 'TEST' : 'USER'}
                  </span>
                )}
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/gallery" className={`text-gray-300 hover:text-white transition-colors ${location === '/gallery' ? 'text-white' : ''}`}>
                Gallery
              </Link>
              <Link href="/tutorials" className={`text-gray-300 hover:text-white transition-colors ${location === '/tutorials' ? 'text-white' : ''}`}>
                Learn
              </Link>
              <Link href="/pricing" className={`text-gray-300 hover:text-white transition-colors ${location === '/pricing' ? 'text-white' : ''}`}>
                Pricing
              </Link>
              {isAuthenticated && (
                <Link href="/create-recipe" className={`text-gray-300 hover:text-white transition-colors ${location === '/create-recipe' ? 'text-white' : ''}`}>
                  Create Recipe
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link href="/home" className={`text-gray-300 hover:text-white transition-colors ${location === '/home' ? 'text-white' : ''}`}>
                    Recipes
                  </Link>
                  <Link href="/dashboard" className={`text-gray-300 hover:text-white transition-colors ${location === '/dashboard' ? 'text-white' : ''}`}>
                    Dashboard
                  </Link>
                  <Link href="/my-gallery" className={`text-gray-300 hover:text-white transition-colors ${location === '/my-gallery' ? 'text-white' : ''}`}>
                    My Gallery
                  </Link>
                  <Link href="/queue" className={`text-gray-300 hover:text-white transition-colors ${location === '/queue' ? 'text-white' : ''}`}>
                    Queue
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center bg-card-bg px-3 py-2 rounded-lg">
                  <Coins className="h-4 w-4 text-success-green mr-2" />
                  <span className="text-sm font-medium">{user.credits || 0} Credits</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || ""} />
                        <AvatarFallback>
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <HamburgerMenu />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {isFirstTimeVisitor && (
                  <Button 
                    onClick={handleClaimCredits}
                    variant="outline"
                    className="relative border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white transition-all"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Free Credits
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 bg-accent-purple text-white text-xs px-1.5 py-0.5"
                    >
                      20
                    </Badge>
                  </Button>
                )}
                <Button 
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
                >
                  Sign In
                </Button>
                <HamburgerMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
