import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// OAuth session data interface
interface OAuthSession {
  oauth?: {
    state: string;
    nonce?: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    organization_id: string;
  };
  [key: string]: any;
}

// JWT payload interface
interface CustomJwtPayload extends jwt.JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  scope?: string;
  aud?: string;
  iss?: string;
}

// Map for storing temporary authorization codes
const authorizationCodes = new Map();

// Initialize SSO login
export const initiateLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      client_id, 
      redirect_uri, 
      response_type, 
      scope, 
      state, 
      nonce 
    } = req.query;
    
    // Validate required parameters
    if (!client_id || !redirect_uri || !response_type) {
      throw new AppError('Missing required parameters', 400);
    }
    
    // Validate client (service provider)
    const organization = await prisma.organization.findFirst({
      where: {
        apiKey: client_id as string,
        isActive: true
      }
    });
    
    if (!organization) {
      throw new AppError('Invalid client_id', 401);
    }
    
    // Check if redirect URI is allowed for this client
    if (organization.callbackUrl !== redirect_uri) {
      throw new AppError('Invalid redirect_uri', 401);
    }
    
    // Validate response type
    if (response_type !== 'code' && response_type !== 'token' && response_type !== 'id_token') {
      throw new AppError('Unsupported response_type', 400);
    }
    
    // Store OAuth state in session for CSRF protection
    const session = req.session as any;
    if (!session) {
      throw new AppError('Session not available', 500);
    }
    session.oauth = {
      state: state as string,
      nonce: nonce as string,
      client_id: client_id as string,
      redirect_uri: redirect_uri as string,
      scope: scope as string || 'openid profile',
      organization_id: organization.id
    };
    
    // Render login page or redirect to login
    // In a real implementation, this would render an actual login page
    res.status(200).json({
      status: 'success',
      message: 'SSO login initiation stub - would redirect to login page',
      data: {
        login_url: `/api/auth/login?sso=true&client_id=${client_id}`,
        organization: organization.name
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Authorization endpoint - called after user authenticates
export const authorizeRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would be called after user authentication
    // User should already be authenticated at this point
    
    const session = req.session as any;
    const oauth = session?.oauth;
    const citizenId = req.user?.id;
    
    if (!oauth || !citizenId) {
      throw new AppError('Invalid SSO session', 400);
    }
    
    // Generate authorization code with 10 minute expiry
    const code = crypto.randomBytes(16).toString('hex');
    
    authorizationCodes.set(code, {
      citizenId,
      client_id: oauth.client_id,
      scope: oauth.scope,
      organization_id: oauth.organization_id,
      exp: Date.now() + 600000 // 10 minutes
    });
    
    // Create audit log for the authorization
    await prisma.auditLog.create({
      data: {
        action: 'SSO_AUTHORIZATION',
        entityType: 'SSO',
        entityId: code,
        citizenId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          client_id: oauth.client_id,
          scope: oauth.scope,
          organization_id: oauth.organization_id
        }
      }
    });
    
    // Construct redirect URL with code
    const redirectUrl = new URL(oauth.redirect_uri as string);
    redirectUrl.searchParams.append('code', code);
    
    if (oauth.state) {
      redirectUrl.searchParams.append('state', oauth.state as string);
    }
    
    // Clear OAuth data from session
    const sessionForCleanup = req.session as any;
    if (sessionForCleanup?.oauth) {
      delete sessionForCleanup.oauth;
    }
    
    // Redirect back to client with authorization code
    res.redirect(redirectUrl.toString());
    
  } catch (error) {
    next(error);
  }
};

// Token endpoint - exchange authorization code for tokens
export const generateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;
    
    // Validate required parameters
    if (!grant_type) {
      throw new AppError('Missing grant_type parameter', 400);
    }
    
    // Handle different grant types
    if (grant_type === 'authorization_code') {
      // Validate required parameters for authorization code grant
      if (!code || !client_id || !client_secret || !redirect_uri) {
        throw new AppError('Missing required parameters', 400);
      }
      
      // Validate client
      const organization = await prisma.organization.findFirst({
        where: {
          apiKey: client_id,
          apiSecret: client_secret,
          isActive: true
        }
      });
      
      if (!organization) {
        throw new AppError('Invalid client credentials', 401);
      }
      
      // Validate authorization code
      const codeData = authorizationCodes.get(code);
      
      if (!codeData || codeData.exp < Date.now() || codeData.client_id !== client_id) {
        throw new AppError('Invalid authorization code', 401);
      }
      
      // Delete used code
      authorizationCodes.delete(code);
      
      // Get citizen
      const citizen = await prisma.citizen.findUnique({
        where: {
          id: codeData.citizenId
        }
      });
      
      if (!citizen) {
        throw new AppError('User not found', 404);
      }
      
      // Generate access token with 1 hour expiry
      const accessToken = jwt.sign(
        { 
          sub: citizen.nid, // Using nid as subject identifier for consistency
          name: `${citizen.firstName} ${citizen.lastName}`,
          scope: codeData.scope
        },
        process.env.JWT_SECRET || 'dev_secret',
        { 
          expiresIn: '1h',
          audience: client_id,
          issuer: process.env.BASE_URL || 'http://localhost:3000'
        }
      );
      
      // Generate ID token if openid scope is present
      let idToken = null;
      if (codeData.scope.includes('openid')) {
        idToken = jwt.sign(
          {
            sub: citizen.nid,
            name: `${citizen.firstName} ${citizen.lastName}`,
            given_name: citizen.firstName,
            family_name: citizen.lastName
          },
          process.env.JWT_SECRET || 'dev_secret',
          {
            expiresIn: '1h',
            audience: client_id,
            issuer: process.env.BASE_URL || 'http://localhost:3000'
          }
        );
      }
      
      // Generate refresh token with 30 day expiry
      const refreshToken = jwt.sign(
        { 
          sub: citizen.nid,
          type: 'refresh'
        },
        process.env.JWT_SECRET || 'dev_secret',
        { 
          expiresIn: '30d',
          audience: client_id,
          issuer: process.env.BASE_URL || 'http://localhost:3000'
        }
      );
      
      // Create service access record
      await prisma.serviceAccess.create({
        data: {
          citizenId: codeData.citizenId,
          organizationId: organization.id,
          serviceId: 'default-service', // This would be determined by the organization's services
          scopes: codeData.scope.split(' '),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });
      
      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: 'SSO_TOKEN_ISSUED',
          entityType: 'SSO',
          entityId: citizen.id,
          citizenId: citizen.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || 'unknown',
          metadata: {
            client_id,
            scope: codeData.scope
          }
        }
      });
      
      // Return tokens
      return res.status(200).json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: refreshToken,
        ...(idToken && { id_token: idToken })
      });
    }
    
    if (grant_type === 'refresh_token') {
      const { refresh_token, client_id, client_secret } = req.body;
      
      // Validate required parameters
      if (!refresh_token || !client_id || !client_secret) {
        throw new AppError('Missing required parameters', 400);
      }
      
      // Validate client
      const organization = await prisma.organization.findFirst({
        where: {
          apiKey: client_id,
          apiSecret: client_secret,
          isActive: true
        }
      });
      
      if (!organization) {
        throw new AppError('Invalid client credentials', 401);
      }
      
      // Verify refresh token
      try {
        const decoded = jwt.verify(
          refresh_token,
          process.env.JWT_SECRET || 'dev_secret'
        ) as any;
        
        // Check if token is a refresh token
        if (decoded.type !== 'refresh') {
          throw new Error('Invalid token type');
        }
        
        // Find citizen by NID
        const citizen = await prisma.citizen.findUnique({
          where: {
            nid: decoded.sub
          }
        });
        
        if (!citizen) {
          throw new AppError('User not found', 404);
        }
        
        // Generate new access token
        const accessToken = jwt.sign(
          { 
            sub: citizen.nid,
            name: `${citizen.firstName} ${citizen.lastName}`
          },
          process.env.JWT_SECRET || 'dev_secret',
          { 
            expiresIn: '1h',
            audience: client_id,
            issuer: process.env.BASE_URL || 'http://localhost:3000'
          }
        );
        
        // Return new access token
        return res.status(200).json({
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: 3600
        });
        
      } catch (error) {
        throw new AppError('Invalid refresh token', 401);
      }
    }
    
    if (grant_type === 'client_credentials') {
      const { client_id, client_secret, scope } = req.body;
      
      // Validate required parameters
      if (!client_id || !client_secret) {
        throw new AppError('Missing required parameters', 400);
      }
      
      // Validate client
      const organization = await prisma.organization.findFirst({
        where: {
          apiKey: client_id,
          apiSecret: client_secret,
          isActive: true
        }
      });
      
      if (!organization) {
        throw new AppError('Invalid client credentials', 401);
      }
      
      // Check if requested scope is allowed
      const requestedScope = scope || 'api:access';
      const allowedScopes = organization.accessScope;
      
      if (!allowedScopes.some(s => requestedScope.includes(s))) {
        throw new AppError('Requested scope not allowed', 403);
      }
      
      // Generate client access token
      const accessToken = jwt.sign(
        { 
          sub: client_id,
          scope: requestedScope
        },
        process.env.JWT_SECRET || 'dev_secret',
        { 
          expiresIn: '1h',
          audience: 'api',
          issuer: process.env.BASE_URL || 'http://localhost:3000'
        }
      );
      
      // Return access token
      return res.status(200).json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600
      });
    }
    
    // Unsupported grant type
    throw new AppError(`Unsupported grant_type: ${grant_type}`, 400);
    
  } catch (error) {
    next(error);
  }
};

// Validate token
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev_secret'
      ) as CustomJwtPayload;
      
      res.status(200).json({
        active: true,
        sub: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        scope: decoded.scope
      });
      
    } catch (error) {
      res.status(200).json({
        active: false
      });
    }
    
  } catch (error) {
    next(error);
  }
};

// Revoke token
export const revokeToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, token_type_hint } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new AppError('Client authentication required', 401);
    }
    
    // Extract client credentials from Basic auth
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [client_id, client_secret] = credentials.split(':');
    
    // Validate client
    const organization = await prisma.organization.findFirst({
      where: {
        apiKey: client_id,
        apiSecret: client_secret,
        isActive: true
      }
    });
    
    if (!organization) {
      throw new AppError('Invalid client credentials', 401);
    }
    
    // In a real implementation, we would add the token to a blocklist
    // For now, we'll return a success response
    
    res.status(200).json({
      status: 'success'
    });
    
  } catch (error) {
    next(error);
  }
};

// Get user info (OpenID Connect)
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    const nid = req.user?.nid;
    
    if (!citizenId || !nid) {
      throw new AppError('Authentication required', 401);
    }
    
    // Get citizen details
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId }
    });
    
    if (!citizen) {
      throw new AppError('User not found', 404);
    }
    
    const contact = citizen.contact as any;
    
    // Return user info in OpenID Connect format
    res.status(200).json({
      sub: nid,
      name: `${citizen.firstName} ${citizen.lastName}`,
      given_name: citizen.firstName,
      family_name: citizen.lastName,
      email: contact.email,
      email_verified: true, // Would be based on email verification status
      gender: citizen.gender.toLowerCase(),
      birthdate: citizen.dateOfBirth.toISOString().split('T')[0] // YYYY-MM-DD format
    });
    
  } catch (error) {
    next(error);
  }
};

// Get service provider metadata (SAML)
export const getServiceProviderMetadata = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, this would return SAML metadata XML
    // For now, we'll return a stub response
    
    res.status(200).json({
      status: 'success',
      message: 'SAML metadata stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Handle SAML callback
export const handleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, this would handle SAML assertion processing
    // For now, we'll return a stub response
    
    res.status(200).json({
      status: 'success',
      message: 'SAML callback stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// SSO logout
export const logoutSso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id_token_hint, post_logout_redirect_uri, state } = req.query;
    
    // In a real implementation, this would invalidate the SSO session
    // For now, we'll return a stub response
    
    if (post_logout_redirect_uri) {
      const redirectUrl = new URL(post_logout_redirect_uri as string);
      
      if (state) {
        redirectUrl.searchParams.append('state', state as string);
      }
      
      // Redirect to client's logout page
      return res.redirect(redirectUrl.toString());
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged out of SSO session'
    });
    
  } catch (error) {
    next(error);
  }
};
