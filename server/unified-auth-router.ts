import { Router } from 'express';
import { UnifiedAuthService, unifiedAuthMiddleware, requireAuth, requireRegistered, getGenerationLimits } from './unified-auth';
import { storage } from './storage';
import { z } from 'zod';
import { USER_TYPES } from '@shared/user-types';
import { ACCESS_ROLES } from '@shared/access-roles';
import { nanoid } from 'nanoid';

const router = Router();

// Apply unified auth middleware to all routes
router.use(unifiedAuthMiddleware);

// Get current user account
router.get('/user', (req, res) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.userAccount);
});

// Upgrade guest to registered account
const upgradeSchema = z.object({
  email: z.string().email(),
  oauthProvider: z.enum(['google', 'facebook']).optional(),
  passwordHash: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

router.post('/upgrade', requireAuth, async (req, res) => {
  try {
    if (!req.userAccount) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.userAccount.accountType !== USER_TYPES.GUEST) {
      return res.status(400).json({ error: "Only guest accounts can be upgraded" });
    }

    const validation = upgradeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: validation.error.errors
      });
    }

    const { email, oauthProvider, passwordHash, firstName, lastName } = validation.data;

    const authService = UnifiedAuthService.getInstance();
    const upgradedUser = await authService.upgradeGuestToRegistered(
      req.userAccount.id,
      email,
      oauthProvider,
      passwordHash
    );

    // Update additional fields if provided
    if (firstName || lastName) {
      await storage.updateUser(upgradedUser.id, {
        firstName: firstName || req.userAccount.firstName,
        lastName: lastName || req.userAccount.lastName
      });
    }

    // Get fresh user data
    const freshUser = await authService.getUserById(upgradedUser.id);

    res.json({
      success: true,
      user: freshUser,
      message: "Account upgraded successfully"
    });
  } catch (error) {
    console.error('Account upgrade error:', error);
    if (error instanceof Error && error.message.includes('Email already registered')) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Failed to upgrade account" });
  }
});

// Get user generation limits
router.get('/limits', (req, res) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { creditsRemaining } = getGenerationLimits(req.userAccount);

  res.json({
    creditsRemaining,
    accountType: req.userAccount.accountType,
    accessRole: req.userAccount.accessRole
  });
});

// Create a new user from Dynamic Labs authentication
router.post('/create-user', async (req, res) => {
  try {
    const { email, firstName, lastName, profileImageUrl, dynamicUserId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const userId = nanoid();
    const userData = {
      id: userId,
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      profileImageUrl: profileImageUrl || null,
      credits: 20, // Give new users 20 free credits
      accountType: USER_TYPES.REGISTERED,
      accessRole: ACCESS_ROLES.USER,
      sessionToken: nanoid(),
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      canUpgradeToRegistered: false,
      isEphemeral: false,
    };

    const newUser = await storage.createUser(userData);

    // Set session cookie
    res.cookie('session_token', userData.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    if (!req.userAccount) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { firstName, lastName, profileImageUrl } = req.body;

    const updatedUser = await storage.updateUser(req.userAccount.id, {
      firstName: firstName || req.userAccount.firstName,
      lastName: lastName || req.userAccount.lastName,
      profileImageUrl: profileImageUrl || req.userAccount.profileImageUrl,
      updatedAt: new Date().toISOString(),
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Debug endpoints (only in development)
if (process.env.NODE_ENV === 'development') {
  // Get debug users
  router.get('/debug/users', (req, res) => {
    const debugUsers = [
      {
        id: 'admin_debug',
        email: 'admin@magicvidio.com',
        firstName: 'Admin',
        lastName: 'User',
        accountType: USER_TYPES.REGISTERED,
        accessRole: ACCESS_ROLES.ADMIN,
        credits: 1000
      },
      {
        id: 'test_debug',
        email: 'test@magicvidio.com',
        firstName: 'Test',
        lastName: 'User',
        accountType: USER_TYPES.REGISTERED,
        accessRole: ACCESS_ROLES.TEST,
        credits: 100
      }
    ];
    res.json({ users: debugUsers });
  });

  // Switch to debug user
  router.post('/debug/switch', async (req, res) => {
    const { userId } = req.body;

    if (!['admin_debug', 'test_debug'].includes(userId)) {
      return res.status(400).json({ error: "Invalid debug user" });
    }

    const authService = UnifiedAuthService.getInstance();
    const debugUser = await authService.getUserById(userId);

    if (!debugUser) {
      return res.status(404).json({ error: "Debug user not found" });
    }

    // Update session to use debug user's session token
    req.session.unifiedSessionId = debugUser.sessionToken;
    req.userAccount = debugUser;

    res.json({ success: true, user: debugUser });
  });
}

// Logout
router.post('/logout', (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true });
  });
});

export default router; 