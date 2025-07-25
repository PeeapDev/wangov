import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // If it's our own AppError, use its status and message
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, { 
      error: err.stack,
      path: req.path,
      method: req.method,
      requestId: req.headers['x-request-id'] || 'unknown',
      ip: req.ip
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
      requestId: req.headers['x-request-id'] || 'unknown',
      ip: req.ip
    });
  }
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};
