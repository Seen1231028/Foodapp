import authUtils from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Interface สำหรับข้อมูล report
export interface ShopReportData {
  salesData: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  weeklyData: Array<{
    day: string;
    orders: number;
    revenue: number;
  }>;
  topMenuItems: Array<{
    name: string;
    orders: number;
    revenue: number;
    percentage: number;
  }>;
  performanceStats: Array<{
    label: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    description: string;
  }>;
}

// ดึงข้อมูล dashboard stats สำหรับ shop
export const getDashboardStats = async () => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// ดึงข้อมูล analytics รายเดือน
export const getMonthlyRevenue = async () => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const response = await fetch(`${API_BASE_URL}/analytics/revenue-monthly`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly revenue');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }
};

// ดึงข้อมูล analytics รายสัปดาห์
export const getDailySales = async () => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const response = await fetch(`${API_BASE_URL}/analytics/sales-daily`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch daily sales');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    throw error;
  }
};

// ดึงข้อมูล orders รายเดือน
export const getMonthlyOrders = async () => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const response = await fetch(`${API_BASE_URL}/analytics/orders-monthly`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly orders');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching monthly orders:', error);
    throw error;
  }
};

// ดึงข้อมูลเมนูยอดนิยมจาก API
export const getTopMenuItems = async () => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    // ใช้ API menu เพื่อดึงข้อมูลเมนูทั้งหมด
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }

    const result = await response.json();
    
    // จำลองข้อมูลยอดนิยมจากเมนูที่มี (เพราะยังไม่มี analytics เมนู)
    if (result.success && result.data) {
      const menuItems = result.data.slice(0, 5); // เอา 5 อันแรก
      const mockTopItems = menuItems.map((item: any, index: number) => ({
        name: item.name,
        orders: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor((Math.random() * 15000) + 5000),
        percentage: Math.floor(Math.random() * 30) + 10
      }));

      return {
        success: true,
        data: mockTopItems
      };
    }

    return { success: false, data: [] };
  } catch (error) {
    console.error('Error fetching top menu items:', error);
    throw error;
  }
};

// ดึงข้อมูลรายงานแบบรวม
export const getShopReports = async (): Promise<ShopReportData> => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const url = `${API_BASE_URL}/reports/dashboard`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let bodyText = '';
      try { bodyText = await response.text(); } catch {}
      console.error('Reports dashboard fetch failed', { url, status: response.status, statusText: response.statusText, body: bodyText });
      if (response.status === 401) {
        throw new Error('ไม่ได้รับอนุญาต (401)');
      }
      if (response.status === 403) {
        throw new Error('ไม่มีสิทธิ์เข้าถึง (403)');
      }
      throw new Error(`Failed to fetch reports dashboard (status ${response.status})`);
    }

    const result = await response.json();
    if (!result.success) {
      console.error('Reports dashboard API returned failure', result);
      throw new Error(result.error || 'รายงานไม่สำเร็จ');
    }
    const data = result.data;

    // salesData: map revenueData (fallback to salesData if present)
    const revenueData: any[] = data.chartData?.revenueData || [];
    const salesSeries: any[] = data.chartData?.salesData || [];

    const salesData = revenueData.map((r, i) => ({
      month: r.month,
      revenue: r.revenue || r.sales || 0,
      orders: Math.floor((salesSeries[i]?.sales || r.revenue || 0) / 180),
      customers: Math.floor(((salesSeries[i]?.sales || r.revenue || 0) / 180) * 0.7)
    }));

    // weeklyData: synthesize from last 7 points of salesSeries or revenueData
    const baseWeekly = salesSeries.slice(-7);
    const dayNames = ['จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์','เสาร์','อาทิตย์'];
    const weeklyData = baseWeekly.map((d, idx) => ({
      day: dayNames[idx % dayNames.length],
      orders: Math.floor((d.sales || 0) / 200),
      revenue: Math.floor(d.sales || 0)
    }));

    // topMenuItems: from salesReport.topSellingItems
    const topSelling = data.salesReport?.topSellingItems || [];
    const totalTopRevenue = topSelling.reduce((s: number, it: any) => s + it.revenue, 0) || 1;
    const topMenuItems = topSelling.map((it: any) => ({
      name: it.name,
      orders: it.quantity,
      revenue: it.revenue,
      percentage: Math.round((it.revenue / totalTopRevenue) * 100)
    })).slice(0,5);

    // performanceStats: derive from salesReport + stats
    const totalRevenue = data.salesReport?.totalSales || 0;
    const totalOrders = data.salesReport?.totalOrders || 0;
    const avgOrderValue = data.salesReport?.averageOrderValue || 0;

    const performanceStats = [
      {
        label: 'รายได้เดือนนี้',
        value: `฿${totalRevenue.toLocaleString()}`,
        change: '+0%',
        changeType: 'increase' as const,
        description: 'จำลองไม่มีข้อมูลเทียบ'
      },
      {
        label: 'คำสั่งซื้อเดือนนี้',
        value: totalOrders.toString(),
        change: '+0%',
        changeType: 'increase' as const,
        description: 'จำนวนออเดอร์ทั้งหมด'
      },
      {
        label: 'ลูกค้าใหม่',
        value: Math.floor(totalOrders * 0.3).toString(),
        change: '+0%',
        changeType: 'increase' as const,
        description: 'คาดการณ์ 30% ของออเดอร์'
      },
      {
        label: 'ค่าเฉลี่ยต่อออเดอร์',
        value: `฿${avgOrderValue.toLocaleString()}`,
        change: '+0%',
        changeType: 'increase' as const,
        description: 'Average Order Value'
      },
      {
        label: 'ออเดอร์สำเร็จ',
        value: (data.stats?.completedOrders || 0).toString(),
        change: '+0%',
        changeType: 'increase' as const,
        description: 'คำสั่งซื้อสำเร็จ'
      },
      {
        label: 'ออเดอร์ค้าง',
        value: (data.stats?.pendingOrders || 0).toString(),
        change: '+0%',
        changeType: 'decrease' as const,
        description: 'คำสั่งซื้อรอดำเนินการ'
      }
    ];

    return { salesData, weeklyData, topMenuItems, performanceStats };
  } catch (error) {
    console.error('Error fetching shop reports (unified):', error);
    throw error;
  }
};