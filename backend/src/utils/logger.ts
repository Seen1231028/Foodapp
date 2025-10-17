import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogParams {
  userId?: number;
  username?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: number;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  status?: 'SUCCESS' | 'FAILED' | 'WARNING';
}

/**
 * บันทึก activity log ลงฐานข้อมูล
 */
export async function logActivity(params: LogParams) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        username: params.username || null,
        userRole: params.userRole || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        description: params.description,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        status: params.status || 'SUCCESS',
      },
    });

    console.log(`[LOG] ${params.action} - ${params.description}`);
    return log;
  } catch (error) {
    console.error('[LOG ERROR]', error);
    // Don't throw error to prevent breaking the main flow
    return null;
  }
}

/**
 * Actions constants
 */
export const LOG_ACTIONS = {
  // Authentication
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  PASSWORD_RESET: 'PASSWORD_RESET',
  
  // CRUD Operations
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  
  // Specific Actions
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE',
  
  // Finance
  PAYMENT_APPROVE: 'PAYMENT_APPROVE',
  PAYMENT_REJECT: 'PAYMENT_REJECT',
  REFUND: 'REFUND',
  
  // Export
  EXPORT_CSV: 'EXPORT_CSV',
  EXPORT_JSON: 'EXPORT_JSON',
  EXPORT_PDF: 'EXPORT_PDF',
  
  // System
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  SYSTEM_WARNING: 'SYSTEM_WARNING',
} as const;

/**
 * Entity types constants
 */
export const LOG_ENTITIES = {
  USER: 'User',
  ORDER: 'Order',
  MENU: 'Menu',
  PAYMENT: 'Payment',
  SHOP: 'Shop',
  CATEGORY: 'Category',
  ROLE: 'Role',
  SYSTEM: 'System',
  REPORT: 'Report',
} as const;

/**
 * Helper function สำหรับดึง IP address จาก request
 */
export function getIpAddress(request: any): string | undefined {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    undefined
  );
}

/**
 * Helper function สำหรับดึง user agent จาก request
 */
export function getUserAgent(request: any): string | undefined {
  return request.headers.get('user-agent') || undefined;
}

/**
 * Middleware สำหรับ logging API calls
 */
export function createLogMiddleware(action: string, entity: string) {
  return async (context: any, next: any) => {
    const start = Date.now();
    
    try {
      await next();
      const duration = Date.now() - start;
      
      // Log successful API call
      await logActivity({
        userId: context.user?.id,
        username: context.user?.username,
        userRole: context.user?.role?.name,
        action,
        entity,
        description: `${action} ${entity} - ${duration}ms`,
        ipAddress: getIpAddress(context.request),
        userAgent: getUserAgent(context.request),
        status: 'SUCCESS',
      });
    } catch (error: any) {
      const duration = Date.now() - start;
      
      // Log failed API call
      await logActivity({
        userId: context.user?.id,
        username: context.user?.username,
        userRole: context.user?.role?.name,
        action,
        entity,
        description: `${action} ${entity} FAILED - ${error.message}`,
        metadata: { error: error.message, duration },
        ipAddress: getIpAddress(context.request),
        userAgent: getUserAgent(context.request),
        status: 'FAILED',
      });
      
      throw error;
    }
  };
}

export default {
  logActivity,
  LOG_ACTIONS,
  LOG_ENTITIES,
  getIpAddress,
  getUserAgent,
  createLogMiddleware,
};
