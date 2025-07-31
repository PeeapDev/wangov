import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import axios from 'axios';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

// Register a new citizen
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, middleName, lastName, dateOfBirth, gender, email, phone, password } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !email || !phone || !password) {
      throw new AppError('Missing required fields', 400);
    }
    
    // Generate a unique National ID (nid) - 12 digits
    // In production, this would connect to a national ID generation service
    const nid = `SL${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create citizen record with contact information
    const newCitizen = await prisma.citizen.create({
      data: {
        nid,
        firstName,
        middleName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        contact: {
          email,
          phone,
          address: req.body.address || null
        },
        credentials: {
          create: {
            password: hashedPassword
          }
        },
        authMethods: {
          create: [
            {
              type: 'EMAIL',
              value: email.toLowerCase(),
              isPrimary: true
            },
            {
              type: 'PHONE',
              value: phone
            }
          ]
        }
      }
    });
    
    // Create audit log for registration
    await prisma.auditLog.create({
      data: {
        action: 'CITIZEN_REGISTERED',
        entityType: 'CITIZEN',
        entityId: newCitizen.id,
        citizenId: newCitizen.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          nid: newCitizen.nid
        }
      }
    });
    
    // Send verification emails/SMS in production
    
    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please verify your email and phone.',
      data: {
        citizenId: newCitizen.id,
        nid: newCitizen.nid
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Login with email/phone and password
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = identifier || email;
    
    if (!loginIdentifier || !password) {
      throw new AppError('Email/phone and password are required', 400);
    }
    
    // Find citizen by email or phone
    const authMethod = await prisma.authMethod.findFirst({
      where: {
        OR: [
          { value: loginIdentifier.toLowerCase(), type: 'EMAIL' },
          { value: loginIdentifier, type: 'PHONE' }
        ],
        isVerified: true
      },
      include: {
        citizen: {
          include: {
            credentials: true
          }
        }
      }
    });
    
    if (!authMethod || !authMethod.citizen) {
      throw new AppError('Invalid credentials', 401);
    }
    
    const { citizen } = authMethod;
    
    // Verify password
    const passwordValid = await bcrypt.compare(
      password, 
      citizen.credentials?.password || ''
    );
    
    if (!passwordValid) {
      // Increment failed attempts
      if (citizen.credentials) {
        await prisma.credentials.update({
          where: { citizenId: citizen.id },
          data: { failedAttempts: { increment: 1 } }
        });
      }
      
      throw new AppError('Invalid credentials', 401);
    }
    
    // Reset failed attempts on successful login
    if (citizen.credentials) {
      await prisma.credentials.update({
        where: { citizenId: citizen.id },
        data: { failedAttempts: 0 }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: citizen.id,
        nid: citizen.nid 
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '1d' }
    );
    
    // Create session
    const session = await prisma.session.create({
      data: {
        citizenId: citizen.id,
        token,
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip,
        device: req.headers['user-agent'] || 'unknown',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CITIZEN_LOGIN',
        entityType: 'SESSION',
        entityId: session.id,
        citizenId: citizen.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {}
      }
    });
    
    // Send token in response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        citizen: {
          id: citizen.id,
          nid: citizen.nid,
          firstName: citizen.firstName,
          lastName: citizen.lastName
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Verify email address
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body;
    
    // Implementation for email verification
    // This would validate the OTP code sent to the email
    
    res.status(200).json({
      status: 'success',
      message: 'Email verification stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Verify phone number
export const verifyPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, code } = req.body;
    
    // Implementation for phone verification
    // This would validate the OTP code sent via SMS
    
    res.status(200).json({
      status: 'success',
      message: 'Phone verification stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.body;
    
    // Implementation for password reset request
    // This would generate a reset token and send it via email/SMS
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    
    // Implementation for password reset
    // This would validate the reset token and update the password
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    // Implementation for token refresh
    // This would validate the refresh token and issue a new access token
    
    res.status(200).json({
      status: 'success',
      message: 'Token refresh stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Revoke session
    await prisma.session.updateMany({
      where: {
        token,
        citizenId: req.user?.id,
        isRevoked: false
      },
      data: {
        isRevoked: true
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CITIZEN_LOGOUT',
        entityType: 'SESSION',
        entityId: token,
        citizenId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {}
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Get current credentials
    const credentials = await prisma.credentials.findUnique({
      where: { citizenId }
    });
    
    if (!credentials) {
      throw new AppError('Credentials not found', 404);
    }
    
    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, credentials.password || '');
    if (!passwordValid) {
      throw new AppError('Current password is incorrect', 401);
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await prisma.credentials.update({
      where: { citizenId },
      data: {
        password: hashedPassword,
        passwordUpdatedAt: new Date(),
        forceChange: false
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_CHANGED',
        entityType: 'CREDENTIALS',
        entityId: credentials.id,
        citizenId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {}
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// OAuth callback handler for WanGov SSO
export const oauthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      throw new AppError('Authorization code is required', 400);
    }
    
    // Determine user role based on the state parameter (which contains redirect info)
    // If state contains subdomain info, it's a provider portal, otherwise it's citizen
    let userRole = 'citizen';
    let tokenPrefix = 'citizen';
    
    // Check if this is a provider portal login by examining the state or other context
    // For now, we'll default to citizen unless we detect provider context
    if (state && (state.includes('edsa') || state.includes('provider') || state.includes('dashboard'))) {
      userRole = 'provider-admin';
      tokenPrefix = 'provider-admin';
    }
    
    const mockUser = {
      id: 'oauth-user-' + Date.now(),
      email: 'john.doe@wangov.sl',
      role: userRole,
      firstName: 'John',
      lastName: 'Doe',
      isEmailVerified: true
    };
    
    res.status(200).json({
      status: 'success',
      message: 'OAuth authentication successful',
      data: {
        // Use compatible token format that authService recognizes
        token: `mock-token-${tokenPrefix}-` + Date.now(),
        user: mockUser
      }
    });
    
  } catch (error) {
    logger.error('OAuth callback error:', error);
    next(error);
  }
};

/**
 * Download WordPress Plugin
 */
export const downloadWordPressPlugin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Path to the WordPress plugin directory
    const pluginPath = path.join(process.cwd(), '../wangov-wordpress/wangov-id');
    
    // Check if plugin directory exists
    if (!fs.existsSync(pluginPath)) {
      return res.status(404).json({
        status: 'error',
        message: 'WordPress plugin not found'
      });
    }
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="wangov-wordpress-plugin.zip"');
    
    // Create archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Handle archive errors
    archive.on('error', (err: any) => {
      logger.error('Archive error:', err);
      throw err;
    });
    
    // Pipe archive to response
    archive.pipe(res);
    
    // Add plugin files to archive
    archive.directory(pluginPath, 'wangov-id');
    
    // Finalize the archive
    await archive.finalize();
    
    logger.info('WordPress plugin downloaded successfully');
    
  } catch (error) {
    logger.error('WordPress plugin download error:', error);
    next(error);
  }
};
