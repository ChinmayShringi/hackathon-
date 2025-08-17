import { useState } from "react";
import { useAuth } from "./useAuth";

export function useAuthInterception() {
  const { isAuthenticated } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [recipeName, setRecipeName] = useState<string>("");

  const interceptAction = (action: () => void, recipeNameForModal?: string) => {
    if (isAuthenticated) {
      // User is authenticated, execute action immediately
      action();
    } else {
      // User not authenticated, show signup modal
      setPendingAction(() => action);
      setRecipeName(recipeNameForModal || "");
      setShowSignupModal(true);
    }
  };

  const executeQueuedAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowSignupModal(false);
    setPendingAction(null);
    setRecipeName("");
  };

  return {
    showSignupModal,
    recipeName,
    interceptAction,
    executeQueuedAction,
    closeModal,
  };
}