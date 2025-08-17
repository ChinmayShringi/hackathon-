import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      // Return null for 401 instead of throwing to prevent auth screen
      if (response.status === 401) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  // Track successful authentication
  useEffect(() => {
    if (user) {
      // Mark user as having successfully completed authentication
      const VISITOR_TRACKING_KEY = "magicvidio_visitor_tracking";
      try {
        const stored = localStorage.getItem(VISITOR_TRACKING_KEY);
        const tracking = stored 
          ? JSON.parse(stored) 
          : { hasSignedUp: false, hasSignedIn: false, firstVisit: new Date().toISOString() };
        
        // Mark as signed in (covers both sign up and sign in flows)
        tracking.hasSignedIn = true;
        localStorage.setItem(VISITOR_TRACKING_KEY, JSON.stringify(tracking));
      } catch (error) {
        console.error("Error tracking authentication:", error);
      }
    }
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
