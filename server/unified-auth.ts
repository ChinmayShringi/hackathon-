import { RequestHandler } from 'express';
import { nanoid } from 'nanoid';
import { storage } from './storage';
import { User } from '@shared/schema';
import { USER_TYPES, type UserTypeId } from '@shared/user-types';
import { ACCESS_ROLES, type AccessRoleId } from '@shared/access-roles';

// Core types for the unified auth system
export type AccountType = UserTypeId; // Now uses integer-based types
export type AccessRole = AccessRoleId; // Now uses integer-based types
export type OAuthProvider = 'google' | 'facebook';

export interface UserAccount {
  id: string;
  accountType: AccountType;
  accessRole: AccessRole;

  // Common fields
  createdAt: Date;
  lastSeenAt: Date;
  sessionToken: string;

  // Registered-specific fields
  email?: string;
  passwordHash?: string;
  oauthProvider?: OAuthProvider;
  credits: number;

  // Guest-specific metadata
  isEphemeral?: boolean;
  canUpgradeToRegistered: boolean;

  // System-specific metadata
  allowDebit: boolean; // Allows negative credits for system users

  // Legacy fields for compatibility
  firstName?: string;
  lastName?: string;
  handle?: string;
  profileImageUrl?: string;
}

// Debug configuration
const DEBUG_CONFIG = {
  boundGuestId: process.env.DEV_BOUND_GUEST_ID,
  testUsers: [
    {
      id: 'admin_debug',
      email: 'admin@magicvidio.com',
      firstName: 'Admin',
      lastName: 'User',
      accountType: USER_TYPES.REGISTERED,
      accessRole: ACCESS_ROLES.ADMIN,
      credits: 1000,
      oauthProvider: 'google' as OAuthProvider
    },
    {
      id: 'test_debug',
      email: 'test@magicvidio.com',
      firstName: 'Test',
      lastName: 'User',
      accountType: USER_TYPES.REGISTERED,
      accessRole: ACCESS_ROLES.TEST,
      credits: 100,
      oauthProvider: 'google' as OAuthProvider
    }
  ]
};

declare global {
  namespace Express {
    interface Request {
      userAccount?: UserAccount;
    }
  }
}

export class UnifiedAuthService {
  private static instance: UnifiedAuthService;

  static getInstance(): UnifiedAuthService {
    if (!UnifiedAuthService.instance) {
      UnifiedAuthService.instance = new UnifiedAuthService();
    }
    return UnifiedAuthService.instance;
  }

  /**
   * Create or retrieve a guest user account
   */
  async createOrRetrieveGuest(sessionId: string): Promise<UserAccount> {
    // Check if session already has a guest user
    const existingUser = await storage.getUserBySessionToken(sessionId);
    if (existingUser && existingUser.accountType === USER_TYPES.GUEST) {
      await this.updateLastSeen(existingUser.id);
      return this.mapUserToAccount(existingUser);
    }

    // When DEV_BOUND_GUEST_ID is set, all guest sessions use the shared guest user
    if (DEBUG_CONFIG.boundGuestId) {
      const sharedGuestUser = await storage.getUser(DEBUG_CONFIG.boundGuestId);
      if (sharedGuestUser) {
        // In DEV_BOUND mode, ensure the shared guest user has the fixed session token
        const fixedSessionToken = 'dev_bound_session_token';
        await storage.updateUser(sharedGuestUser.id, {
          sessionToken: fixedSessionToken,
          lastSeenAt: new Date()
        });
        return this.mapUserToAccount({
          ...sharedGuestUser,
          sessionToken: fixedSessionToken,
          lastSeenAt: new Date()
        });
      }
    }

    // Create new ephemeral guest user (when DEV_BOUND_GUEST_ID is not set)
    const guestId = `guest_${nanoid(12)}`;

    const newUser = await storage.upsertUser({
      id: guestId,
      accountType: USER_TYPES.GUEST,
      accessRole: ACCESS_ROLES.USER,
      sessionToken: sessionId, // Use the session ID as the session token
      isEphemeral: true,
      canUpgradeToRegistered: true,
      credits: 30, // Ephemeral guests get 30 credits
      createdAt: new Date(),
      lastSeenAt: new Date()
    });

    return this.mapUserToAccount(newUser);
  }

  /**
   * Upgrade a guest account to registered
   */
  async upgradeGuestToRegistered(
    guestId: string,
    email: string,
    oauthProvider?: OAuthProvider,
    passwordHash?: string
  ): Promise<UserAccount> {
    const guestUser = await storage.getUser(guestId);
    if (!guestUser || guestUser.accountType !== USER_TYPES.GUEST) {
      throw new Error('Invalid guest user for upgrade');
    }

    // Check if email is already taken
    if (email) {
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.id !== guestId) {
        throw new Error('Email already registered');
      }
    }

    // Upgrade the user
    const upgradedUser = await storage.upsertUser({
      ...guestUser,
      accountType: USER_TYPES.REGISTERED,
      email,
      oauthProvider,
      passwordHash,
      isEphemeral: false,
      canUpgradeToRegistered: false,
      updatedAt: new Date()
    });

    // Gift credits on upgrade (stub for future implementation)
    await this.tryCreditsUpgrade(upgradedUser.id, guestUser.credits);

    return this.mapUserToAccount(upgradedUser);
  }

  /**
   * Get user account by session token
   */
  async getUserBySessionToken(sessionToken: string): Promise<UserAccount | null> {
    const user = await storage.getUserBySessionToken(sessionToken);
    if (!user) return null;

    await this.updateLastSeen(user.id);
    return this.mapUserToAccount(user);
  }

  /**
   * Get user account by session token with fallback to shared guest user
   */
  async getUserBySessionTokenWithFallback(sessionToken: string): Promise<UserAccount | null> {
    // In DEV_BOUND mode, always return shared guest user regardless of session token
    if (DEBUG_CONFIG.boundGuestId) {
      const sharedGuestUser = await storage.getUser(DEBUG_CONFIG.boundGuestId);
      if (sharedGuestUser) {
        await this.updateLastSeen(sharedGuestUser.id);
        return this.mapUserToAccount({
          ...sharedGuestUser,
          sessionToken // just pass through whatever was provided
        });
      }
      return null;
    }
    // Normal mode: try to get user by session token
    const user = await storage.getUserBySessionToken(sessionToken);
    if (user) {
      await this.updateLastSeen(user.id);
      return this.mapUserToAccount(user);
    }
    return null;
  }

  /**
   * Get user account by ID
   */
  async getUserById(userId: string): Promise<UserAccount | null> {
    const user = await storage.getUser(userId);
    if (!user) return null;

    await this.updateLastSeen(user.id);
    return this.mapUserToAccount(user);
  }

  /**
   * Update user's last seen timestamp
   */
  private async updateLastSeen(userId: string): Promise<void> {
    await storage.updateUser(userId, {
      lastSeenAt: new Date()
    });
  }

  /**
   * Gift credits on account upgrade (stub for future implementation)
   */
  private async tryCreditsUpgrade(userId: string, previousCredits: number): Promise<void> {
    console.log(`Credits upgrade stub: User ${userId} had ${previousCredits} credits as guest`);
  }

  /**
   * Map database user to UserAccount interface
   */
  private mapUserToAccount(user: User): UserAccount {
    return {
      id: user.id,
      accountType: (user.accountType as AccountType) || USER_TYPES.GUEST,
      accessRole: (user.accessRole as AccessRole) || ACCESS_ROLES.USER,
      createdAt: user.createdAt || new Date(),
      lastSeenAt: user.lastSeenAt || user.createdAt || new Date(),
      sessionToken: user.sessionToken || '',
      email: user.email || undefined,
      passwordHash: user.passwordHash || undefined,
      oauthProvider: user.oauthProvider as OAuthProvider || undefined,
      credits: user.credits,
      isEphemeral: user.isEphemeral || false,
      canUpgradeToRegistered: user.canUpgradeToRegistered || false,
      allowDebit: user.accountType === USER_TYPES.SYSTEM, // Set allowDebit based on user type
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      handle: user.handle || undefined,
      profileImageUrl: user.profileImageUrl || undefined
    };
  }

  /**
   * Initialize debug users in database
   */
  async initializeDebugUsers(): Promise<void> {
    for (const debugUser of DEBUG_CONFIG.testUsers) {
      try {
        await storage.upsertUser({
          ...debugUser,
          createdAt: new Date(),
          lastSeenAt: new Date()
        });
      } catch (error) {
        console.error(`Failed to initialize debug user ${debugUser.id}:`, error);
      }
    }
  }
}

// Middleware for unified authentication
export const unifiedAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authService = UnifiedAuthService.getInstance();

    // Get or create session ID (any session token works in DEV_BOUND mode)
    let sessionId = req.session.unifiedSessionId;
    if (!sessionId) {
      sessionId = nanoid(32);
      req.session.unifiedSessionId = sessionId;
    }

    // Get or create user account
    const userAccount = await authService.getUserBySessionTokenWithFallback(sessionId) ||
      await authService.createOrRetrieveGuest(sessionId);

    req.userAccount = userAccount;
    next();
  } catch (error) {
    console.error('Unified auth error:', error);
    next();
  }
};

// Middleware to require authentication
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Middleware to require registered account
export const requireRegistered: RequestHandler = (req, res, next) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.userAccount.accountType !== USER_TYPES.REGISTERED) {
    return res.status(403).json({ error: "Registered account required" });
  }
  next();
};

// Middleware to require specific access role
export const requireRole = (role: AccessRole): RequestHandler => {
  return (req, res, next) => {
    if (!req.userAccount) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (req.userAccount.accessRole !== role) {
      return res.status(403).json({ error: `Access role '${role}' required` });
    }
    next();
  };
};

// Helper functions for checking permissions
export const getGenerationLimits = (userAccount: UserAccount): {
  creditsRemaining: number;
  allowDebit: boolean;
} => {
  return {
    creditsRemaining: userAccount.credits,
    allowDebit: userAccount.allowDebit
  };
}; 