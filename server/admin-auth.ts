import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// Hard-coded admin credentials (hashed password)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$10$p8hl4O5v72Bj/AF8tEVla.kHG2bG9rcJQfL5Gl88Ta1LMx1qNeqKy';

export interface AdminSession {
  isAdmin: boolean;
  username: string;
  loginTime: number;
}

declare global {
  namespace Express {
    interface Session {
      admin?: AdminSession;
    }
  }
}

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.admin?.isAdmin) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  next();
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set admin session
    req.session.admin = {
      isAdmin: true,
      username: ADMIN_USERNAME,
      loginTime: Date.now()
    };

    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const adminLogout = (req: Request, res: Response) => {
  req.session.admin = undefined;
  res.json({ success: true, message: 'Admin logout successful' });
};

export const checkAdminStatus = (req: Request, res: Response) => {
  const isAuthenticated = !!req.session.admin?.isAdmin;
  res.json({ 
    isAuthenticated,
    username: req.session.admin?.username || null
  });
}; 