import { User } from "@shared/schema";
import { UserAccount } from "./unified-auth";
import { AdminSession } from "./admin-auth";

declare module 'express-session' {
  interface SessionData {
    // Legacy session fields for backward compatibility
    user?: User & {
      access_token?: string;
      refresh_token?: string;
      authMethod?: 'debug';
    };
    guestId?: string;
    
    // Unified auth session fields
    unifiedSessionId?: string;
    userAccount?: UserAccount;
    
    // Admin session fields
    admin?: AdminSession;
  }
}