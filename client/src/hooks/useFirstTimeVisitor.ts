import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const VISITOR_TRACKING_KEY = "magicvidio_visitor_tracking";

interface VisitorTracking {
  hasSignedUp: boolean;
  hasSignedIn: boolean;
  firstVisit: string;
}

export function useFirstTimeVisitor() {
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkVisitorStatus = () => {
      try {
      
        
        // If user is authenticated, never show the offer
        if (isAuthenticated) {

          setIsFirstTimeVisitor(false);
          setIsLoading(false);
          return;
        }

        const stored = localStorage.getItem(VISITOR_TRACKING_KEY);

        
        if (!stored) {
          // Truly first-time visitor
          const tracking: VisitorTracking = {
            hasSignedUp: false,
            hasSignedIn: false,
            firstVisit: new Date().toISOString()
          };
          localStorage.setItem(VISITOR_TRACKING_KEY, JSON.stringify(tracking));
          
          setIsFirstTimeVisitor(true);
        } else {
          const tracking: VisitorTracking = JSON.parse(stored);
          const shouldShow = !tracking.hasSignedUp && !tracking.hasSignedIn;
          
          setIsFirstTimeVisitor(shouldShow);
        }
      } catch (error) {
        console.error("Error checking visitor status:", error);
        setIsFirstTimeVisitor(true); // Default to showing offer on error
      } finally {
        setIsLoading(false);
      }
    };

    const resetTracking = () => {
      try {
        localStorage.removeItem(VISITOR_TRACKING_KEY);
        setIsFirstTimeVisitor(true);
  
        // Force a recheck
        setTimeout(() => checkVisitorStatus(), 100);
      } catch (error) {
        console.error("Error resetting tracking:", error);
      }
    };

    checkVisitorStatus();
    
    // Make reset function globally available for testing
    if (typeof window !== 'undefined') {
      (window as any).resetVisitorTracking = resetTracking;
      (window as any).checkVisitorStatus = checkVisitorStatus;
  
    }
  }, [isAuthenticated]);

  const markSignedUp = () => {
    try {
      const stored = localStorage.getItem(VISITOR_TRACKING_KEY);
      const tracking: VisitorTracking = stored 
        ? JSON.parse(stored) 
        : { hasSignedUp: false, hasSignedIn: false, firstVisit: new Date().toISOString() };
      
      tracking.hasSignedUp = true;
      localStorage.setItem(VISITOR_TRACKING_KEY, JSON.stringify(tracking));
      setIsFirstTimeVisitor(false);
    } catch (error) {
      console.error("Error marking signed up:", error);
    }
  };

  const markSignedIn = () => {
    try {
      const stored = localStorage.getItem(VISITOR_TRACKING_KEY);
      const tracking: VisitorTracking = stored 
        ? JSON.parse(stored) 
        : { hasSignedUp: false, hasSignedIn: false, firstVisit: new Date().toISOString() };
      
      tracking.hasSignedIn = true;
      localStorage.setItem(VISITOR_TRACKING_KEY, JSON.stringify(tracking));
      setIsFirstTimeVisitor(false);
    } catch (error) {
      console.error("Error marking signed in:", error);
    }
  };

  return {
    isFirstTimeVisitor,
    isLoading,
    markSignedUp,
    markSignedIn
  };
}