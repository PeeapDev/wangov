import { Router, Request, Response } from 'express';
import { prisma } from '../utils/database';

const router = Router();

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'WanGov-ID',
      version: '1.0.0',
      database: 'connected',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(200).json(healthStatus);
  } catch (error) {
    const healthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'WanGov-ID',
      version: '1.0.0',
      database: 'disconnected',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    res.status(503).json(healthStatus);
  }
});

// Detailed system status
router.get('/status', async (req: Request, res: Response) => {
  try {
    // Database metrics
    const dbResult = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        version() as database_version,
        current_timestamp as timestamp
    ` as any[];
    
    const systemStatus = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      service: {
        name: 'WanGov-ID',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        status: 'connected',
        name: dbResult[0]?.database_name,
        version: dbResult[0]?.database_version,
        timestamp: dbResult[0]?.timestamp
      },
      endpoints: {
        auth: '/api/auth',
        citizens: '/api/citizens', 
        admin: '/api/admin',
        organizations: '/api/organizations',
        sso: '/api/sso'
      }
    };
    
    res.status(200).json(systemStatus);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
