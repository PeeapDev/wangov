import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import crypto from 'crypto';

// Get citizen profile
export const getCitizenProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Get citizen with related data
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
      include: {
        authMethods: true,
        consents: true,
        documents: true,
        serviceAccesses: {
          include: {
            organization: true,
            service: true
          }
        }
      }
    });
    
    if (!citizen) {
      throw new AppError('Citizen not found', 404);
    }
    
    // Remove sensitive data before sending response
    const safeData = {
      id: citizen.id,
      nid: citizen.nid,
      firstName: citizen.firstName,
      middleName: citizen.middleName,
      lastName: citizen.lastName,
      dateOfBirth: citizen.dateOfBirth,
      gender: citizen.gender,
      contact: citizen.contact,
      createdAt: citizen.createdAt,
      updatedAt: citizen.updatedAt,
      authMethods: citizen.authMethods,
      consents: citizen.consents,
      documents: citizen.documents,
      serviceAccesses: citizen.serviceAccesses
    };
    
    res.status(200).json({
      status: 'success',
      data: safeData
    });
    
  } catch (error) {
    next(error);
  }
};

// Update citizen profile
export const updateCitizenProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    const { firstName, middleName, lastName } = req.body;
    
    // Update only allowed fields
    const updatedCitizen = await prisma.citizen.update({
      where: { id: citizenId },
      data: {
        firstName: firstName || undefined,
        middleName: middleName || undefined,
        lastName: lastName || undefined
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'PROFILE_UPDATED',
        entityType: 'CITIZEN',
        entityId: citizenId,
        citizenId: citizenId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          fields: Object.keys(req.body).filter(key => 
            ['firstName', 'middleName', 'lastName'].includes(key)
          )
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        firstName: updatedCitizen.firstName,
        middleName: updatedCitizen.middleName,
        lastName: updatedCitizen.lastName
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Update contact information
export const updateContactInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    const { email, phone, address } = req.body;
    
    // Get current citizen data
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId }
    });
    
    if (!citizen) {
      throw new AppError('Citizen not found', 404);
    }
    
    // Update contact information (stored as JSON)
    const currentContact = citizen.contact as any;
    const updatedContact = {
      ...currentContact,
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address })
    };
    
    // Update citizen record
    await prisma.citizen.update({
      where: { id: citizenId },
      data: {
        contact: updatedContact
      }
    });
    
    // If email changed, update auth method and mark as unverified
    if (email && email !== currentContact.email) {
      await prisma.authMethod.updateMany({
        where: {
          citizenId,
          type: 'EMAIL',
          isPrimary: true
        },
        data: {
          value: email.toLowerCase(),
          isVerified: false,
          verifiedAt: null
        }
      });
      
      // Send verification email (stub for now)
    }
    
    // If phone changed, update auth method and mark as unverified
    if (phone && phone !== currentContact.phone) {
      await prisma.authMethod.updateMany({
        where: {
          citizenId,
          type: 'PHONE',
          isPrimary: true
        },
        data: {
          value: phone,
          isVerified: false,
          verifiedAt: null
        }
      });
      
      // Send verification SMS (stub for now)
    }
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CONTACT_INFO_UPDATED',
        entityType: 'CITIZEN',
        entityId: citizenId,
        citizenId: citizenId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          fields: Object.keys(req.body).filter(key => 
            ['email', 'phone', 'address'].includes(key)
          )
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Contact information updated successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Enroll biometrics
export const enrollBiometrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // This would be a placeholder for actual biometric enrollment logic
    // In a real system, this would handle secure biometric data processing
    
    res.status(200).json({
      status: 'success',
      message: 'Biometric enrollment stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Verify biometrics
export const verifyBiometrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // This would be a placeholder for actual biometric verification logic
    // In a real system, this would handle secure matching against enrolled templates
    
    res.status(200).json({
      status: 'success',
      message: 'Biometric verification stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Get activity log
export const getActivityLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get audit logs for this citizen
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        citizenId
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        action: true,
        entityType: true,
        timestamp: true,
        ipAddress: true,
        userAgent: true
      }
    });
    
    // Get total count for pagination
    const total = await prisma.auditLog.count({
      where: {
        citizenId
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        logs: auditLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Manage consents
export const manageConsents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Handle different HTTP methods
    if (req.method === 'GET') {
      // Get all consents
      const consents = await prisma.consent.findMany({
        where: {
          citizenId
        }
      });
      
      return res.status(200).json({
        status: 'success',
        data: consents
      });
    }
    
    if (req.method === 'POST') {
      // Create new consent
      const { purpose, dataCategories, granted } = req.body;
      
      const newConsent = await prisma.consent.create({
        data: {
          citizenId,
          purpose,
          dataCategories,
          granted,
          grantedAt: granted ? new Date() : null
        }
      });
      
      return res.status(201).json({
        status: 'success',
        message: 'Consent recorded successfully',
        data: newConsent
      });
    }
    
    if (req.method === 'PUT') {
      // Update existing consent
      const consentId = req.params.consentId;
      const { granted } = req.body;
      
      // Verify consent belongs to this citizen
      const consent = await prisma.consent.findFirst({
        where: {
          id: consentId,
          citizenId
        }
      });
      
      if (!consent) {
        throw new AppError('Consent not found', 404);
      }
      
      const updatedConsent = await prisma.consent.update({
        where: {
          id: consentId
        },
        data: {
          granted,
          grantedAt: granted ? new Date() : consent.grantedAt,
          revokedAt: !granted ? new Date() : null
        }
      });
      
      return res.status(200).json({
        status: 'success',
        message: granted ? 'Consent granted' : 'Consent revoked',
        data: updatedConsent
      });
    }
    
    // If method not handled
    throw new AppError('Method not allowed', 405);
    
  } catch (error) {
    next(error);
  }
};

// Get documents
export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const filters: any = { citizenId };
    
    if (req.query.type) {
      filters.type = String(req.query.type);
    }
    
    if (req.query.isVerified !== undefined) {
      filters.isVerified = req.query.isVerified === 'true';
    }
    
    // Get documents with pagination
    const documents = await prisma.document.findMany({
      where: filters,
      orderBy: {
        uploadedAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        filename: true,
        fileSize: true,
        mimeType: true,
        isVerified: true,
        verifiedAt: true,
        uploadedAt: true
      }
    });
    
    // Get total count for pagination
    const total = await prisma.document.count({
      where: filters
    });
    
    // Create audit log for document access
    await prisma.auditLog.create({
      data: {
        action: 'DOCUMENTS_ACCESSED',
        entityType: 'DOCUMENT',
        entityId: citizenId,
        citizenId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          documentCount: documents.length
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Upload document
export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Get document info from request
    // In a real implementation, this would come from multipart form data
    const { type, filename, description, fileContent, mimeType } = req.body;
    
    // Validate required fields
    if (!type || !filename) {
      throw new AppError('Document type and filename are required', 400);
    }
    
    // Create document record in database
    const document = await prisma.document.create({
      data: {
        citizenId,
        type,
        filename,
        fileSize: Buffer.from(fileContent || '').length, // In a real implementation, get actual file size
        mimeType: mimeType || 'application/octet-stream',
        hash: crypto.createHash('sha256').update(fileContent || '').digest('hex'), // Generate hash of file content
        isVerified: false
      }
    });
    
    // In a real implementation, this would store the file in secure storage
    // Example: AWS S3, Azure Blob Storage, etc.
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DOCUMENT_UPLOADED',
        entityType: 'DOCUMENT',
        entityId: document.id,
        citizenId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          documentType: document.type,
          filename: document.filename
        }
      }
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: {
        id: document.id,
        type: document.type,
        filename: document.filename,
        uploadedAt: document.uploadedAt
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get service access
export const getServiceAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.id;
    
    if (!citizenId) {
      throw new AppError('Authentication required', 401);
    }
    
    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get service access entries for this citizen
    const serviceAccesses = await prisma.serviceAccess.findMany({
      where: {
        citizenId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
        revokedAt: null
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get total count for pagination
    const total = await prisma.serviceAccess.count({
      where: {
        citizenId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
        revokedAt: null
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        serviceAccesses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};
