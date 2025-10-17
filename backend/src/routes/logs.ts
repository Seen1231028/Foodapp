import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logsRoute = new Elysia({ prefix: '/logs' })
  // Get all activity logs with filters
  .get('/', async ({ query }) => {
    try {
      const {
        page = '1',
        limit = '50',
        userId,
        action,
        entity,
        status,
        startDate,
        endDate,
        search,
      } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};

      if (userId) {
        where.userId = parseInt(userId);
      }

      if (action) {
        where.action = action;
      }

      if (entity) {
        where.entity = entity;
      }

      if (status) {
        where.status = status;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate);
        }
      }

      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { entity: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get logs
      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.activityLog.count({ where }),
      ]);

      // Parse metadata JSON
      const logsWithParsedMetadata = logs.map((log) => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));

      return {
        success: true,
        data: logsWithParsedMetadata,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      };
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  })

  // Get log statistics
  .get('/stats', async ({ query }) => {
    try {
      const { startDate, endDate } = query;

      const where: any = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate);
        }
      }

      // Get statistics
      const [
        totalLogs,
        logsByAction,
        logsByEntity,
        logsByStatus,
        logsByUser,
        recentErrors,
      ] = await Promise.all([
        // Total logs
        prisma.activityLog.count({ where }),

        // Logs by action
        prisma.activityLog.groupBy({
          by: ['action'],
          where,
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),

        // Logs by entity
        prisma.activityLog.groupBy({
          by: ['entity'],
          where,
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),

        // Logs by status
        prisma.activityLog.groupBy({
          by: ['status'],
          where,
          _count: { id: true },
        }),

        // Top users
        prisma.activityLog.groupBy({
          by: ['userId', 'username'],
          where: {
            ...where,
            userId: { not: null },
          },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),

        // Recent errors
        prisma.activityLog.findMany({
          where: {
            ...where,
            status: 'FAILED',
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

      return {
        success: true,
        data: {
          totalLogs,
          byAction: logsByAction.map((item) => ({
            action: item.action,
            count: item._count.id,
          })),
          byEntity: logsByEntity.map((item) => ({
            entity: item.entity,
            count: item._count.id,
          })),
          byStatus: logsByStatus.map((item) => ({
            status: item.status,
            count: item._count.id,
          })),
          topUsers: logsByUser.map((item) => ({
            userId: item.userId,
            username: item.username,
            count: item._count.id,
          })),
          recentErrors: recentErrors.map((log) => ({
            ...log,
            metadata: log.metadata ? JSON.parse(log.metadata) : null,
          })),
        },
      };
    } catch (error: any) {
      console.error('Error fetching log stats:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  })

  // Get user activity timeline
  .get('/user/:userId', async ({ params }) => {
    try {
      const userId = parseInt(params.userId);

      const logs = await prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      const logsWithParsedMetadata = logs.map((log) => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));

      return {
        success: true,
        data: logsWithParsedMetadata,
      };
    } catch (error: any) {
      console.error('Error fetching user logs:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  })

  // Get entity history
  .get('/entity/:entity/:entityId', async ({ params }) => {
    try {
      const { entity, entityId } = params;

      const logs = await prisma.activityLog.findMany({
        where: {
          entity,
          entityId: parseInt(entityId),
        },
        orderBy: { createdAt: 'desc' },
      });

      const logsWithParsedMetadata = logs.map((log) => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));

      return {
        success: true,
        data: logsWithParsedMetadata,
      };
    } catch (error: any) {
      console.error('Error fetching entity logs:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  })

  // Delete old logs (admin only)
  .delete('/cleanup', async ({ query }) => {
    try {
      const { days = '90' } = query;
      const daysNum = parseInt(days);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      const result = await prisma.activityLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      return {
        success: true,
        message: `Deleted ${result.count} logs older than ${daysNum} days`,
        deletedCount: result.count,
      };
    } catch (error: any) {
      console.error('Error cleaning up logs:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  });
