import { RequestHandler } from 'express';
import { storage } from './storage';
import { USER_TYPES, ACCESS_ROLES } from '@shared/user-types';
import { nanoid } from 'nanoid';

// Create a new user from Dynamic Labs authentication
export const createUser: RequestHandler = async (req, res) => {
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
};

// Get current user profile
export const getCurrentUser: RequestHandler = async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token' });
        }

        const user = await storage.getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(401).json({ error: 'Invalid session token' });
        }

        // Update last seen
        await storage.updateUserLastSeen(user.id);

        res.json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

// Update user profile
export const updateUserProfile: RequestHandler = async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token' });
        }

        const user = await storage.getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(401).json({ error: 'Invalid session token' });
        }

        const { firstName, lastName, profileImageUrl } = req.body;

        const updatedUser = await storage.updateUser(user.id, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            profileImageUrl: profileImageUrl || user.profileImageUrl,
            updatedAt: new Date().toISOString(),
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

// Logout user
export const logoutUser: RequestHandler = async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token;

        if (sessionToken) {
            // Clear session token in database
            const user = await storage.getUserBySessionToken(sessionToken);
            if (user) {
                await storage.updateUser(user.id, {
                    sessionToken: null,
                    updatedAt: new Date().toISOString(),
                });
            }
        }

        // Clear session cookie
        res.clearCookie('session_token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
};
