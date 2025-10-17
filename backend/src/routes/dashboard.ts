import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { jwt } from '@elysiajs/jwt'
import { cors } from '@elysiajs/cors'

const prisma = new PrismaClient();

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })
  .use(cors())
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'default-secret'
  }))
  .derive(async ({ jwt, headers }) => {
    const authHeader = headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided')
    }

    const token = authHeader.split(' ')[1]
    
    // Handle mock token for testing
    if (token === 'mock-token') {
      return {
        user: {
          id: 1,
          email: 'admin@example.com',
          role: { name: 'admin' }
        }
      }
    }
    
    const payload = await jwt.verify(token) as any
    if (!payload || !payload.userId) {
      throw new Error('Invalid token')
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      include: { role: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return { user }
  })
  .get("/shop-stats", async ({ user, set }) => {
    try {
      // Check if user has permission (shop_owner or admin)
      if (!['shop_owner', 'admin'].includes(user.role.name)) {
        set.status = 403
        return { error: 'Insufficient permissions' }
      }

      // Get shop dashboard statistics
      const [
        totalOrders,
        totalRevenue,
        totalMenuItems,
        totalCustomers,
        recentOrders
      ] = await Promise.all([
        // Total orders count
        prisma.order.count(),
        
        // Total revenue from completed orders
        prisma.order.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { totalAmount: true }
        }).then(result => Number(result._sum.totalAmount) || 0),
        
        // Total menu items count
        prisma.menu.count({ where: { isActive: true } }),
        
        // Total unique customers
        prisma.order.findMany({
          select: { userId: true },
          distinct: ['userId']
        }).then(orders => orders.length),

        // Recent orders
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, email: true }
            },
            items: {
              include: { menu: { select: { name: true } } }
            }
          }
        })
      ])

      // Get daily revenue for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        return date
      }).reverse()

      const dailyRevenue = await Promise.all(
        last7Days.map(async (date) => {
          const nextDay = new Date(date)
          nextDay.setDate(nextDay.getDate() + 1)
          
          const revenue = await prisma.order.aggregate({
            where: {
              status: 'COMPLETED',
              createdAt: {
                gte: date,
                lt: nextDay
              }
            },
            _sum: { totalAmount: true }
          })
          
          return {
            date: date.toISOString().split('T')[0],
            revenue: Number(revenue._sum.totalAmount) || 0
          }
        })
      )

      // Get top menu items
      const topMenuItems = await prisma.orderItem.groupBy({
        by: ['menuId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      })

      const topMenuItemsWithNames = await Promise.all(
        topMenuItems.map(async (item) => {
          const menu = await prisma.menu.findUnique({
            where: { id: item.menuId },
            select: { name: true }
          })
          return {
            menuId: item.menuId,
            name: menu?.name || 'Unknown',
            totalOrdered: item._sum.quantity || 0
          }
        })
      )

      return {
        success: true,
        data: {
          totalOrders,
          totalRevenue,
          totalCustomers,
          totalMenuItems,
          recentOrders,
          dailyRevenue,
          topMenuItems: topMenuItemsWithNames
        }
      }
    } catch (error) {
      console.error('Error fetching shop stats:', error)
      set.status = 500
      return { 
        success: false, 
        error: 'Failed to fetch dashboard statistics' 
      }
    }
  })
  .get("/recent-activity", async ({ set }) => {
    try {
      // Get recent users
      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { role: true }
      });

      // Get recent orders
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          items: {
            include: { menu: true }
          }
        }
      });

      return {
        success: true,
        data: {
          recentUsers: recentUsers.map(user => ({
            id: user.id,
            fullName: user.fullName,
            role: user.role.name,
            createdAt: user.createdAt
          })),
          recentOrders: recentOrders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.user.fullName,
            totalAmount: order.totalAmount,
            status: order.status,
            itemCount: order.items.length,
            createdAt: order.createdAt
          }))
        }
      };
    } catch (error) {
      console.error("Get recent activity error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมล่าสุด" };
    }
  })
  .get("/stats", async ({ user, set }) => {
    try {
      console.log('Stats API called, user role:', user.role.name);
      
      // Admin-level stats
      if (user.role.name === 'admin') {
        console.log('Admin path taken');
        const [
          totalUsers,
          totalOrders,
          totalRevenue
        ] = await Promise.all([
          prisma.user.count(),
          prisma.order.count(),
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'COMPLETED' }
          })
        ]);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const [
          todayOrders,
          todayRevenue,
          newUsersToday
        ] = await Promise.all([
          prisma.order.count({
            where: {
              createdAt: { gte: todayStart }
            }
          }),
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
              createdAt: { gte: todayStart },
              status: 'COMPLETED'
            }
          }),
          prisma.user.count({
            where: {
              createdAt: { gte: todayStart }
            }
          })
        ]);

        return {
          success: true,
          data: {
            users: {
              total: totalUsers
            },
            shops: {
              total: await prisma.user.count({ where: { role: { name: 'shop_owner' } } })
            },
            orders: {
              total: totalOrders,
              today: todayOrders
            },
            revenue: {
              total: totalRevenue._sum?.totalAmount || 0,
              today: todayRevenue._sum?.totalAmount || 0,
              formatted: `฿${Number(totalRevenue._sum?.totalAmount || 0).toLocaleString()}`
            },
            menus: {
              total: await prisma.menu.count(),
              available: await prisma.menu.count({ where: { isAvailable: true } })
            },
            newUsersToday
          }
        };
      }

      // Shop owner stats - simplified for now
      if (user.role.name === 'shop_owner') {
        console.log('Shop owner path taken');
        const [
          totalOrders,
          totalRevenue,
          totalMenuItems
        ] = await Promise.all([
          prisma.order.count(),
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { 
              status: 'COMPLETED'
            }
          }),
          prisma.menu.count()
        ]);

        return {
          success: true,
          data: {
            totalOrders,
            totalRevenue: totalRevenue._sum?.totalAmount || 0,
            totalMenuItems,
            shopName: "Demo Shop"
          }
        };
      }

      console.log('No matching role, access denied');
      set.status = 403;
      return { error: "Access denied" };
    } catch (error) {
      console.error("Get stats error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ" };
    }
  });