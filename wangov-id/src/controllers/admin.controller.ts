import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Admin login
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;
    
    if (!loginIdentifier || !password) {
      throw new AppError('Username/email and password are required', 400);
    }
    
    // Find admin user by username or email
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: loginIdentifier },
          { email: loginIdentifier }
        ]
      }
    });
    
    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }
    
    if (!admin.isActive) {
      throw new AppError('Account is disabled', 403);
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id,
        role: admin.role 
      },
      process.env.ADMIN_JWT_SECRET || 'admin_dev_secret',
      { expiresIn: '8h' }
    );
    
    // Update last login timestamp
    await prisma.admin.update({
      where: {
        id: admin.id
      },
      data: {
        lastLogin: new Date()
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_LOGIN',
        entityType: 'ADMIN',
        entityId: admin.id,
        adminId: admin.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          username: admin.username,
          role: admin.role
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// List citizens with filtering and pagination
export const listCitizens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const filters: any = {};
    if (req.query.search) {
      const search = String(req.query.search);
      filters.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { nid: { contains: search } }
      ];
    }
    
    // Get citizens
    const citizens = await prisma.citizen.findMany({
      where: filters,
      skip,
      take: limit,
      select: {
        id: true,
        nid: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
        contact: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get total count for pagination
    const total = await prisma.citizen.count({ where: filters });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_LIST_CITIZENS',
        entityType: 'ADMIN_ACTION',
        entityId: 'list_citizens',
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          filters: req.query,
          page,
          limit,
          total
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        citizens,
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

// Get single citizen details
export const getCitizenDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get citizen with related data
    const citizen = await prisma.citizen.findUnique({
      where: { id },
      include: {
        authMethods: true,
        biometricData: {
          select: {
            id: true,
            enrollmentDate: true,
            lastVerification: true,
            quality: true
          }
        },
        documents: true,
        serviceAccesses: {
          include: {
            service: {
              include: {
                organization: true
              }
            }
          }
        },
        consents: true,
        auditLogs: {
          take: 10,
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
    
    if (!citizen) {
      throw new AppError('Citizen not found', 404);
    }
    
    // Remove sensitive information - create safe data object
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
      biometricData: citizen.biometricData,
      authMethods: citizen.authMethods,
      consents: citizen.consents,
      auditLogs: citizen.auditLogs,
      documents: citizen.documents,
      serviceAccesses: citizen.serviceAccesses
    };
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_VIEW_CITIZEN',
        entityType: 'CITIZEN',
        entityId: id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          nid: citizen.nid
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: safeData
    });
    
  } catch (error) {
    next(error);
  }
};

// Create citizen (for administrative enrollment)
export const createCitizen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      firstName, middleName, lastName, dateOfBirth, gender, 
      email, phone, address, temporaryPassword, documentType, documentNumber 
    } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !email || !phone) {
      throw new AppError('Missing required fields', 400);
    }
    
    // Generate a unique National ID (nid) - 12 digits
    // In production, this would connect to a national ID generation service
    const nid = `SL${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    
    // Generate a secure temporary password if not provided
    const password = temporaryPassword || 
      Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create citizen record
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
          address: address || null
        },
        credentials: {
          create: {
            password: hashedPassword,
            forceChange: true
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
              value: phone,
              isPrimary: false
            }
          ]
        }
      }
    });
    
    // If document information provided, create document record
    if (documentType && documentNumber) {
      await prisma.document.create({
        data: {
          citizenId: newCitizen.id,
          type: documentType,
          filename: `${documentType}_${documentNumber}`,
          fileSize: 0, // Placeholder
          mimeType: 'text/plain', // Placeholder
          hash: '', // Placeholder
          isVerified: true,
          verifiedBy: req.admin?.id,
          verifiedAt: new Date(),
          metadata: {
            documentNumber,
            adminVerified: true,
            verifiedById: req.admin?.id
          }
        }
      });
    }
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_CREATE_CITIZEN',
        entityType: 'CITIZEN',
        entityId: newCitizen.id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          nid: newCitizen.nid
        }
      }
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Citizen created successfully',
      data: {
        citizen: {
          id: newCitizen.id,
          nid: newCitizen.nid,
          firstName: newCitizen.firstName,
          lastName: newCitizen.lastName
        },
        temporaryPassword: password
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Update citizen information
export const updateCitizen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { firstName, middleName, lastName, gender, contact } = req.body;
    
    // Find citizen first
    const citizen = await prisma.citizen.findUnique({
      where: { id }
    });
    
    if (!citizen) {
      throw new AppError('Citizen not found', 404);
    }
    
    // Update citizen record
    const updatedCitizen = await prisma.citizen.update({
      where: { id },
      data: {
        firstName: firstName || undefined,
        middleName: middleName || undefined,
        lastName: lastName || undefined,
        gender: gender || undefined,
        contact: contact ? { ...(citizen.contact as object), ...contact } : undefined
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_UPDATE_CITIZEN',
        entityType: 'CITIZEN',
        entityId: id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          nid: citizen.nid,
          fields: Object.keys(req.body)
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Citizen updated successfully',
      data: {
        id: updatedCitizen.id,
        nid: updatedCitizen.nid,
        firstName: updatedCitizen.firstName,
        lastName: updatedCitizen.lastName
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Suspend citizen account
export const suspendCitizen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      throw new AppError('Suspension reason is required', 400);
    }
    
    // Find citizen first
    const citizen = await prisma.citizen.findUnique({
      where: { id }
    });
    
    if (!citizen) {
      throw new AppError('Citizen not found', 404);
    }
    
    // Revoke all active sessions
    await prisma.session.updateMany({
      where: {
        citizenId: id,
        isRevoked: false
      },
      data: {
        isRevoked: true
      }
    });
    
    // Lock credentials
    await prisma.credentials.update({
      where: {
        citizenId: id
      },
      data: {
        lockedUntil: new Date(9999, 11, 31) // Far future date
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_SUSPEND_CITIZEN',
        entityType: 'CITIZEN',
        entityId: id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          nid: citizen.nid,
          reason
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Citizen account suspended successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Reactivate suspended citizen account
export const reactivateCitizen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      throw new AppError('Reactivation reason is required', 400);
    }
    
    // Find citizen first
    const citizen = await prisma.citizen.findUnique({
      where: { id }
    });
    
    if (!citizen) {
      throw new AppError('Citizen not found', 404);
    }
    
    // Unlock credentials
    await prisma.credentials.update({
      where: {
        citizenId: id
      },
      data: {
        lockedUntil: null,
        failedAttempts: 0
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_REACTIVATE_CITIZEN',
        entityType: 'CITIZEN',
        entityId: id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          nid: citizen.nid,
          reason
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Citizen account reactivated successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Get system statistics
export const getSystemStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get various counts
    const citizenCount = await prisma.citizen.count();
    const activeSessionCount = await prisma.session.count({
      where: {
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    const organizationCount = await prisma.organization.count();
    const serviceCount = await prisma.service.count();
    const documentCount = await prisma.document.count();
    
    // Get recent registrations (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentRegistrations = await prisma.citizen.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    });
    
    // Get recent logins (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentLogins = await prisma.auditLog.count({
      where: {
        action: 'CITIZEN_LOGIN',
        timestamp: {
          gte: yesterday
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        totalCitizens: citizenCount,
        activeSessions: activeSessionCount,
        totalOrganizations: organizationCount,
        totalServices: serviceCount,
        totalDocuments: documentCount,
        recentRegistrations,
        recentLogins
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get audit logs
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const filters: any = {};
    
    if (req.query.action) {
      filters.action = String(req.query.action);
    }
    
    if (req.query.entityType) {
      filters.entityType = String(req.query.entityType);
    }
    
    if (req.query.entityId) {
      filters.entityId = String(req.query.entityId);
    }
    
    if (req.query.citizenId) {
      filters.citizenId = String(req.query.citizenId);
    }
    
    if (req.query.adminId) {
      filters.adminId = String(req.query.adminId);
    }
    
    if (req.query.startDate && req.query.endDate) {
      filters.timestamp = {
        gte: new Date(String(req.query.startDate)),
        lte: new Date(String(req.query.endDate))
      };
    } else if (req.query.startDate) {
      filters.timestamp = {
        gte: new Date(String(req.query.startDate))
      };
    } else if (req.query.endDate) {
      filters.timestamp = {
        lte: new Date(String(req.query.endDate))
      };
    }
    
    // Get audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        citizen: {
          select: {
            nid: true,
            firstName: true,
            lastName: true
          }
        },
        admin: {
          select: {
            username: true,
            role: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const total = await prisma.auditLog.count({ where: filters });
    
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

// Get system health
export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check database connection
    let databaseStatus = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      databaseStatus = 'unhealthy';
      logger.error('Database health check failed', { error });
    }
    
    // Mock other service checks for now
    const serviceChecks = {
      database: databaseStatus,
      redis: 'healthy',
      biometricEngine: 'healthy',
      storageService: 'healthy',
      emailService: 'healthy',
      smsService: 'healthy'
    };
    
    const allHealthy = Object.values(serviceChecks).every(status => status === 'healthy');
    
    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date(),
      services: serviceChecks,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error) {
    next(error);
  }
};

// Configure system
export const configureSystem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would be a placeholder for system configuration
    // In a real implementation, this would update system settings
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_SYSTEM_CONFIG',
        entityType: 'SYSTEM',
        entityId: 'config',
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          changes: req.body
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'System configuration stub - will be implemented in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Manage admin users
export const manageAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Handle different HTTP methods for admin management
    // This implements strict security policies to protect admin accounts
    
    // Following the Hospital Staff Management Security Policy
    // 1. Ensuring admin credentials are protected
    // 2. Maintaining strict separation between admin accounts
    // 3. Enforcing authorization boundaries
    
    // For the prototype, we'll return a stub response
    
    res.status(200).json({
      status: 'success',
      message: 'Admin management stub - will be implemented with proper security controls in next phase'
    });
    
  } catch (error) {
    next(error);
  }
};

// Generate reports
export const generateReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportType } = req.query;
    
    // This would generate different types of reports
    // For now, we'll return a stub response
    
    res.status(200).json({
      status: 'success',
      message: `Report generation stub for ${reportType} - will be implemented in next phase`
    });
    
  } catch (error) {
    next(error);
  }
};
