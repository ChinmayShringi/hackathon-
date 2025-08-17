import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, Image, Video, CreditCard, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleLogin = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsOpen(false);
  };

  const menuItems = [
    { href: "/", label: "Home", icon: Home, show: true },
    { href: "/gallery", label: "Gallery", icon: Image, show: true },
    { href: "/tutorials", label: "Learn", icon: Video, show: true },
    { href: "/pricing", label: "Pricing", icon: CreditCard, show: true },
    { href: "/create-recipe", label: "Create Recipe", icon: Settings, show: isAuthenticated },
    { href: "/dashboard", label: "Dashboard", icon: User, show: isAuthenticated },
    { href: "/my-gallery", label: "My Gallery", icon: Image, show: isAuthenticated },
    { href: "/queue", label: "Queue", icon: Settings, show: isAuthenticated },
    { href: "/profile", label: "Profile", icon: User, show: isAuthenticated },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-[60]"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-screen w-80 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMenu}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {/* Navigation Items */}
              {menuItems
                .filter(item => item.show)
                .map((item) => (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={closeMenu}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        location === item.href 
                          ? 'bg-accent-blue text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                ))}

              {/* Authentication */}
              <div className="pt-4 border-t border-gray-800">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user ? String(user.firstName || 'U').charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {user ? (`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User') : 'User'}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {user ? user.credits : 0} credits
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}