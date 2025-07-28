import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    nid: string;
    role?: string;
    organizationId?: string;
  };
}

/**
 * JWT authentication middleware for WanGov API routes
 * Verifies the token and adds the user data to the request object
 */
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    try {
      // Verify token using environment variable secret or default secret
      const secret = process.env.JWT_SECRET || 'wangov_default_secret';
      const decoded = jwt.verify(token, secret) as {
        id: string;
        nid: string;
        role?: string;
        organizationId?: string;
      };
      
      // Add user data to request object
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } else {
    // If no token is provided, continue but with no user data
    // This allows public routes to be accessed
    next();
  }
};

/**
 * Middleware to check if user has admin role
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

/**
 * Middleware to check if user has organization admin role
 */
export const requireOrganizationAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'organization_admin' && 
      req.user.role !== 'admin' && 
      req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Organization admin access required' });
  }
  
  next();
};

/**
 * Middleware to check if user is accessing their own data
 * Uses the userId parameter in the request to check ownership
 */
export const requireOwnership = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const userId = req.params.userId || req.body.userId;
  
  // Admins can access any user's data
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    return next();
  }
  
  // Users can only access their own data
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized access to resource' });
  }
  
  next();
};
