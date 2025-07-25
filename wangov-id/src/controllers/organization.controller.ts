import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import crypto from 'crypto';

// Register a new organization
export const registerOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, callbackUrl, webhookUrl, accessScope } = req.body;
    
    // Validate required fields
    if (!name || !type) {
      throw new AppError('Missing required fields', 400);
    }
    
    // Generate API key and secret
    const apiKey = crypto.randomBytes(16).toString('hex');
    const apiSecret = crypto.randomBytes(32).toString('hex');
    
    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        type,
        apiKey,
        apiSecret,
        callbackUrl,
        webhookUrl,
        accessScope: accessScope || ['basic_id']
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_REGISTER_ORGANIZATION',
        entityType: 'ORGANIZATION',
        entityId: organization.id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          organizationName: organization.name,
          organizationType: organization.type
        }
      }
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Organization registered successfully',
      data: {
        id: organization.id,
        name: organization.name,
        apiKey: organization.apiKey,
        apiSecret: organization.apiSecret
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// List all organizations
export const listOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const filters: any = {};
    
    if (req.query.name) {
      filters.name = {
        contains: String(req.query.name),
        mode: 'insensitive'
      };
    }
    
    if (req.query.type) {
      filters.type = String(req.query.type);
    }
    
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }
    
    // Get organizations
    const organizations = await prisma.organization.findMany({
      where: filters,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        type: true,
        isActive: true,
        createdAt: true,
        accessScope: true,
        _count: {
          select: {
            services: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get total count for pagination
    const total = await prisma.organization.count({ where: filters });
    
    res.status(200).json({
      status: 'success',
      data: {
        organizations,
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

// Get organization details
export const getOrganizationDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get organization with services
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        services: true,
        serviceAccesses: {
          include: {
            citizen: {
              select: {
                id: true,
                nid: true,
                firstName: true,
                lastName: true
              }
            },
            service: true
          },
          take: 10
        }
      }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    // Remove sensitive information
    const { apiSecret, ...safeData } = organization;
    
    res.status(200).json({
      status: 'success',
      data: safeData
    });
    
  } catch (error) {
    next(error);
  }
};

// Update organization
export const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, callbackUrl, webhookUrl, accessScope, isActive } = req.body;
    
    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { id }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: {
        name: name || undefined,
        callbackUrl: callbackUrl || undefined,
        webhookUrl: webhookUrl || undefined,
        accessScope: accessScope || undefined,
        isActive: isActive === undefined ? undefined : isActive
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_UPDATE_ORGANIZATION',
        entityType: 'ORGANIZATION',
        entityId: id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          organizationName: updatedOrganization.name,
          fields: Object.keys(req.body)
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Organization updated successfully',
      data: {
        id: updatedOrganization.id,
        name: updatedOrganization.name,
        isActive: updatedOrganization.isActive
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Revoke organization access
export const revokeOrganizationAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      throw new AppError('Revocation reason is required', 400);
    }
    
    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { id }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    // Generate new API secret
    const apiSecret = crypto.randomBytes(32).toString('hex');
    
    // Update organization to inactive and reset API secret
    await prisma.organization.update({
      where: { id },
      data: {
        isActive: false,
        apiSecret
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_REVOKE_ORGANIZATION_ACCESS',
        entityType: 'ORGANIZATION',
        entityId: id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          organizationName: organization.name,
          reason
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Organization access revoked successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Validate organization API key
export const validateOrganizationApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      throw new AppError('API key is required', 401);
    }
    
    // Find organization by API key
    const organization = await prisma.organization.findUnique({
      where: { apiKey }
    });
    
    if (!organization || !organization.isActive) {
      throw new AppError('Invalid or inactive API key', 401);
    }
    
    // Attach organization to request
    (req as any).organization = {
      id: organization.id,
      name: organization.name,
      type: organization.type,
      accessScope: organization.accessScope
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

// Get organization services
export const getOrganizationServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get services for this organization
    const services = await prisma.service.findMany({
      where: {
        organizationId: id
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: services
    });
    
  } catch (error) {
    next(error);
  }
};

// Register new service for organization
export const registerService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, requiredScopes } = req.body;
    
    // Validate required fields
    if (!name || !description || !requiredScopes) {
      throw new AppError('Missing required fields', 400);
    }
    
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    // Create service
    const service = await prisma.service.create({
      data: {
        name,
        description,
        requiredScopes,
        organizationId: id
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_REGISTER_SERVICE',
        entityType: 'SERVICE',
        entityId: service.id,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          organizationId: id,
          serviceName: service.name
        }
      }
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Service registered successfully',
      data: service
    });
    
  } catch (error) {
    next(error);
  }
};

// Update service
export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, serviceId } = req.params;
    const { name, description, requiredScopes, isActive } = req.body;
    
    // Check if service exists and belongs to organization
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        organizationId: id
      }
    });
    
    if (!service) {
      throw new AppError('Service not found', 404);
    }
    
    // Update service
    const updatedService = await prisma.service.update({
      where: {
        id: serviceId
      },
      data: {
        name: name || undefined,
        description: description || undefined,
        requiredScopes: requiredScopes || undefined,
        isActive: isActive === undefined ? undefined : isActive
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_UPDATE_SERVICE',
        entityType: 'SERVICE',
        entityId: serviceId,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          organizationId: id,
          serviceName: updatedService.name,
          fields: Object.keys(req.body)
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Service updated successfully',
      data: updatedService
    });
    
  } catch (error) {
    next(error);
  }
};

// Deactivate service
export const deactivateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, serviceId } = req.params;
    
    // Check if service exists and belongs to organization
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        organizationId: id
      }
    });
    
    if (!service) {
      throw new AppError('Service not found', 404);
    }
    
    // Update service
    await prisma.service.update({
      where: {
        id: serviceId
      },
      data: {
        isActive: false
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_DEACTIVATE_SERVICE',
        entityType: 'SERVICE',
        entityId: serviceId,
        adminId: req.admin?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        metadata: {
          organizationId: id,
          serviceName: service.name
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Service deactivated successfully'
    });
    
  } catch (error) {
    next(error);
  }
};
