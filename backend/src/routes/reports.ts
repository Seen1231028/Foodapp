import { Elysia } from "elysia";
import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const reportsRoutes = new Elysia({ prefix: '/reports' })
  .get('/dashboard', async ({ headers, set }) => {
    try {
      const token = headers.authorization?.replace('Bearer ', '');
      if (!token) {
        set.status = 401;
        return { success: false, error: 'ไม่พบ token การยืนยันตัวตน' };
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      } catch (e) {
        set.status = 401;
        return { success: false, error: 'Token ไม่ถูกต้องหรือหมดอายุ' };
      }

      const allowedRoles = ['admin', 'shop_owner'];
      if (!decoded || !allowedRoles.includes(decoded.role)) {
        console.warn('Unauthorized reports access attempt by role:', decoded?.role);
        set.status = 403;
        return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงข้อมูลรายงาน' };
      }

      // ---------------- Real DB Aggregations ----------------
      // Basic counts
      const [ totalUsers, totalMenus, orders, paidPayments, users, orderItems, payments ] = await Promise.all([
        prisma.user.count(),
        prisma.menu.count(),
        prisma.order.findMany({ select: { id: true, status: true, totalAmount: true, createdAt: true } }),
        prisma.payment.findMany({ where: { status: PaymentStatus.PAID }, select: { amount: true, method: true } }),
        prisma.user.findMany({ select: { id: true, createdAt: true, roleId: true } }),
        prisma.orderItem.findMany({ include: { menu: { select: { name: true } } } }),
        prisma.payment.findMany({ select: { method: true, status: true } })
      ]);

      // Orders grouping by status and sales basics
      const ordersByStatusMap: Record<string, number> = {};
      for (const o of orders) {
        ordersByStatusMap[o.status] = (ordersByStatusMap[o.status] || 0) + 1;
      }
      const ordersByStatus = Object.entries(ordersByStatusMap).map(([status, count]) => ({ status, count }));
      const totalOrders = orders.length;
      const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED);
      const totalSales = completedOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const averageOrderValue = completedOrders.length ? Math.round(totalSales / completedOrders.length) : 0;

      // Top selling items (sum quantity & revenue per menu)
      interface TopAgg { name: string; quantity: number; revenue: number; }
      const topAggMap: Record<number, TopAgg> = {};
      for (const item of orderItems) {
        const revenue = Number(item.price) * item.quantity;
        const key = item.menuId;
        if (!topAggMap[key]) {
          topAggMap[key] = { name: item.menu.name, quantity: 0, revenue: 0 };
        }
        topAggMap[key].quantity += item.quantity;
        topAggMap[key].revenue += revenue;
      }
      const topSellingItems = Object.values(topAggMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(it => ({ name: it.name, quantity: it.quantity, revenue: Math.round(it.revenue) }));

      // User counts by role (derive via roleId -> role name fetch minimal)
      const roles = await prisma.role.findMany({ select: { id: true, name: true } });
      const roleNameById = Object.fromEntries(roles.map(r => [r.id, r.name]));
      const usersByRoleMap: Record<string, number> = {};
      for (const u of users) {
        const rName = roleNameById[u.roleId] || 'unknown';
        usersByRoleMap[rName] = (usersByRoleMap[rName] || 0) + 1;
      }
      const usersByRoleArr = Object.entries(usersByRoleMap).map(([role, count]) => ({ role, count }));

      // New users this month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = users.filter(u => u.createdAt >= monthStart).length;

      // Active users heuristic: users who placed at least one order
      const userOrderSet = new Set(orders.map(o => o.id)); // actually order ids; need userId but we didn't select userId earlier
      // Re-fetch minimal orders with userId to compute active users
      const ordersWithUser = await prisma.order.findMany({ select: { userId: true } });
      const activeUserSet = new Set(ordersWithUser.map(o => o.userId));
      const activeUsers = activeUserSet.size;

      // Monthly charts (last 12 months)
      function monthKey(d: Date) { return d.getFullYear() + '-' + (d.getMonth()+1).toString().padStart(2,'0'); }
      const last12: string[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last12.push(monthKey(d));
      }

      const orderMonthAgg: Record<string, { sales: number; revenue: number; orders: number }> = {};
      for (const key of last12) orderMonthAgg[key] = { sales: 0, revenue: 0, orders: 0 };
      for (const o of orders) {
        const key = monthKey(o.createdAt);
        if (orderMonthAgg[key]) {
          orderMonthAgg[key].orders += 1;
          orderMonthAgg[key].revenue += Number(o.totalAmount);
          orderMonthAgg[key].sales += Number(o.totalAmount); // alias
        }
      }

      const locale = 'th-TH';
      const revenueData = last12.map(key => {
        const [y, m] = key.split('-').map(Number);
        const label = new Date(y, m - 1).toLocaleDateString(locale, { month: 'short' });
        return { month: label, revenue: Math.round(orderMonthAgg[key].revenue) };
      });
      const salesDataSeries = last12.map(key => {
        const [y, m] = key.split('-').map(Number);
        const label = new Date(y, m - 1).toLocaleDateString(locale, { month: 'short' });
        return { month: label, sales: Math.round(orderMonthAgg[key].sales) };
      });

      // User growth (last 6 months user counts cumulative)
      const last6Keys = last12.slice(-6);
      const userMonthCounts: Record<string, number> = {};
      for (const key of last6Keys) userMonthCounts[key] = 0;
      for (const u of users) {
        const key = monthKey(u.createdAt);
        if (userMonthCounts[key] !== undefined) userMonthCounts[key] += 1;
      }
      // cumulative style
      let running = 0;
      const userGrowthData = last6Keys.map(key => {
        running += userMonthCounts[key];
        const [y, m] = key.split('-').map(Number);
        const label = new Date(y, m - 1).toLocaleDateString(locale, { month: 'short' });
        return { month: label, users: running };
      });

      // Payment method distribution (paid only)
      const paymentMethodMap: Record<string, { count: number }> = {};
      for (const p of payments) {
        if (p.status !== PaymentStatus.PAID) continue;
        paymentMethodMap[p.method] = { count: (paymentMethodMap[p.method]?.count || 0) + 1 };
      }
      const paymentMethods = Object.entries(paymentMethodMap).map(([method, v]) => ({ method, count: v.count, percentage: 0 }));
      const totalPaidMethod = paymentMethods.reduce((s, m) => s + m.count, 0) || 1;
      for (const pm of paymentMethods) pm.percentage = +( (pm.count / totalPaidMethod) * 100 ).toFixed(1);

      // Assemble reportData
      const reportData = {
        salesReport: {
          totalSales: Math.round(totalSales),
          totalOrders,
          averageOrderValue,
          topSellingItems
        },
        userReport: {
          totalUsers,
          newUsersThisMonth,
          activeUsers,
          usersByRole: usersByRoleArr
        },
        performanceReport: {
          ordersByStatus,
          paymentMethods
        },
        chartData: {
          userGrowthData,
          salesData: salesDataSeries,
          revenueData
        },
        stats: {
          totalUsers,
          totalMenus,
          totalOrders,
          completedOrders: completedOrders.length,
          pendingOrders: ordersByStatusMap[OrderStatus.PENDING] || 0
        }
      };

      set.status = 200;
      return { success: true, data: reportData };

    } catch (error) {
      console.error('Reports dashboard error:', error);
      set.status = 500;
      return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน' };
    }
  });

export default reportsRoutes;