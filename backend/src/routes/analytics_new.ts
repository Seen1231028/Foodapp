import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .get('/sales-daily', async () => {
    try {
      // Get sales data for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      });

      // Group by day of week
      const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
      const salesByDay = dayNames.map(day => ({ name: day, sales: 0 }));

      orders.forEach(order => {
        const dayOfWeek = new Date(order.createdAt).getDay();
        salesByDay[dayOfWeek].sales += Number(order.totalAmount);
      });

      return {
        success: true,
        data: salesByDay
      };
    } catch (error) {
      console.error('Analytics sales daily error:', error);
      return {
        success: false,
        error: 'Failed to fetch daily sales data'
      };
    }
  })

  .get('/orders-monthly', async () => {
    try {
      // Get order counts for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        }
      });

      // Group by month
      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const ordersByMonth = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === date.getFullYear();
        });

        ordersByMonth.push({
          name: monthNames[monthIndex],
          orders: monthOrders.length
        });
      }

      return {
        success: true,
        data: ordersByMonth
      };
    } catch (error) {
      console.error('Analytics orders monthly error:', error);
      return {
        success: false,
        error: 'Failed to fetch monthly orders data'
      };
    }
  })

  .get('/user-types', async () => {
    try {
      const users = await prisma.user.findMany({
        include: {
          role: true
        }
      });
      
      const roleCount: { [key: string]: number } = {};
      users.forEach(user => {
        const roleName = user.role.name;
        roleCount[roleName] = (roleCount[roleName] || 0) + 1;
      });

      const total = users.length;
      const roleNames: { [key: string]: string } = {
        'customer': 'ลูกค้า',
        'shop_owner': 'เจ้าของร้าน', 
        'admin': 'ผู้ดูแล',
        'finance': 'การเงิน'
      };

      const userTypeData = Object.entries(roleCount).map(([role, count]) => ({
        name: roleNames[role] || role,
        value: Math.round((count / total) * 100),
        count,
        color: '#8884d8'
      }));

      return {
        success: true,
        data: userTypeData
      };
    } catch (error) {
      console.error('Analytics user types error:', error);
      return {
        success: false,
        error: 'Failed to fetch user types data'
      };
    }
  })

  .get('/revenue-monthly', async () => {
    try {
      // Get revenue data for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        }
      });

      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const revenueByMonth = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === date.getFullYear();
        });

        const revenue = monthOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const orderCount = monthOrders.length;

        revenueByMonth.push({
          month: monthNames[monthIndex],
          revenue,
          orders: orderCount
        });
      }

      return {
        success: true,
        data: revenueByMonth
      };
    } catch (error) {
      console.error('Analytics revenue monthly error:', error);
      return {
        success: false,
        error: 'Failed to fetch monthly revenue data'
      };
    }
  })

  .get('/payment-methods', async () => {
    try {
      const payments = await prisma.payment.findMany();
      
      const methodCount: { [key: string]: { count: number, amount: number } } = {};
      payments.forEach(payment => {
        if (!methodCount[payment.method]) {
          methodCount[payment.method] = { count: 0, amount: 0 };
        }
        methodCount[payment.method].count++;
        const amount = payment.amount ? parseFloat(payment.amount.toString()) : 0;
        methodCount[payment.method].amount += amount;
      });

      const total = payments.length;
      const methodNames: { [key: string]: string } = {
        'CASH': 'เงินสด',
        'BANK_TRANSFER': 'โอนเงิน',
        'CREDIT_CARD': 'บัตรเครดิต',
        'WALLET': 'กระเป๋าเงิน'
      };

      const paymentMethodData = Object.entries(methodCount).map(([method, data]) => ({
        name: methodNames[method] || method,
        value: Math.round((data.count / total) * 100),
        amount: data.amount,
        count: data.count
      }));

      return {
        success: true,
        data: paymentMethodData
      };
    } catch (error) {
      console.error('Analytics payment methods error:', error);
      return {
        success: false,
        error: 'Failed to fetch payment methods data'
      };
    }
  })

  .get('/user-growth', async () => {
    try {
      // Get user registration data for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const users = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const userGrowth = [];
      let cumulativeUsers = 0;

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        
        const monthUsers = users.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === monthIndex && userDate.getFullYear() === date.getFullYear();
        });

        cumulativeUsers += monthUsers.length;

        userGrowth.push({
          month: monthNames[monthIndex],
          users: cumulativeUsers
        });
      }

      return {
        success: true,
        data: userGrowth
      };
    } catch (error) {
      console.error('Analytics user growth error:', error);
      return {
        success: false,
        error: 'Failed to fetch user growth data'
      };
    }
  })

  .get('/daily-sales-customers', async () => {
    try {
      // Get sales and customer data for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      });

      // Group by day of week
      const dayNames = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
      const dailyData = dayNames.map(day => ({ day, sales: 0, customers: 0 }));

      orders.forEach(order => {
        const dayOfWeek = new Date(order.createdAt).getDay();
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
        const amount = order.totalAmount ? parseFloat(order.totalAmount.toString()) : 0;
        dailyData[dayIndex].sales += amount;
        dailyData[dayIndex].customers += 1;
      });

      return {
        success: true,
        data: dailyData
      };
    } catch (error) {
      console.error('Analytics daily sales customers error:', error);
      return {
        success: false,
        error: 'Failed to fetch daily sales and customers data'
      };
    }
  })
  
  .get('/revenue-daily', async () => {
    try {
      // Get revenue data for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      });

      // Group by day of week
      const dayNames = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
      const revenueData = dayNames.map(day => ({ day, revenue: 0, transactions: 0 }));

      orders.forEach(order => {
        const dayOfWeek = new Date(order.createdAt).getDay();
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
        const amount = order.totalAmount ? parseFloat(order.totalAmount.toString()) : 0;
        revenueData[dayIndex].revenue += amount;
        revenueData[dayIndex].transactions += 1;
      });

      return {
        success: true,
        data: revenueData
      };
    } catch (error) {
      console.error('Analytics revenue daily error:', error);
      return {
        success: false,
        error: 'Failed to fetch daily revenue data'
      };
    }
  });