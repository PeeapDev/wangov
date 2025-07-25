import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { prisma } from '../utils/database';

interface JwtPayload {
  id: string;
  nid: string; // National ID - using consistent field name for ID
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        nid: string;
        role?: string;
      };
      admin?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateCitizen = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'dev_secret'
    ) as JwtPayload;
    
    // Find active session for this token
    const session = await prisma.session.findFirst({
      where: {
        citizenId: decoded.id,
        token: token,
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    
    if (!session) {
      throw new AppError('Invalid or expired session', 401);
    }
    
    // Find citizen
    const citizen = await prisma.citizen.findUnique({
      where: {
        id: decoded.id
      }
    });
    
    if (!citizen) {
      throw new AppError('User not found', 401);
    }
    
    // Attach user to request
    req.user = {
      id: decoded.id,
      nid: decoded.nid
    };
    
    // Update session last accessed
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        updatedAt: new Date()
      }
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};

export const authenticateAdmin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Admin authentication required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.ADMIN_JWT_SECRET || 'admin_dev_secret'
    ) as JwtPayload;
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.id
      }
    });
    
    if (!admin || !admin.isActive) {
      throw new AppError('Admin not found or inactive', 401);
    }
    
    // Attach admin to request
    req.admin = {
      id: admin.id,
      role: admin.role
    };
    
    // Log admin action for audit
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_API_ACCESS',
        entityType: 'API',
        entityId: req.originalUrl,
        adminId: admin.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          method: req.method,
          path: req.path
        }
      }
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid admin token', 401));
    }
    next(error);
  }
};

// Role-based access control middleware
export const requireAdminRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};
