import { useState, useEffect } from 'react';

interface SalesData {
  name: string;
  sales: number;
}

interface OrderData {
  name: string;
  orders: number;
}

interface UserTypeData {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
  displayMonth?: string;
}

interface DailySalesData {
  day: string;
  sales: number;
  customers: number;
}

interface PaymentMethodData {
  name: string;
  value: number;
  amount: number;
  count: number;
}

interface UserGrowthData {
  month: string;
  users: number;
}

export const useAnalytics = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [userTypeData, setUserTypeData] = useState<UserTypeData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [dailySalesData, setDailySalesData] = useState<DailySalesData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics data in parallel
      const [
        salesRes, 
        ordersRes, 
        userTypesRes, 
        revenueRes,
        dailySalesRes,
        paymentMethodsRes,
        userGrowthRes
      ] = await Promise.all([
        fetch('http://localhost:4000/api/analytics/sales-daily'),
        fetch('http://localhost:4000/api/analytics/orders-monthly'),
        fetch('http://localhost:4000/api/analytics/user-types'),
        fetch('http://localhost:4000/api/analytics/revenue-monthly'),
        fetch('http://localhost:4000/api/analytics/daily-sales-customers'),
        fetch('http://localhost:4000/api/analytics/payment-methods'),
        fetch('http://localhost:4000/api/analytics/user-growth')
      ]);

      // Check if all requests were successful
      if (!salesRes.ok || !ordersRes.ok || !userTypesRes.ok || !revenueRes.ok || 
          !dailySalesRes.ok || !paymentMethodsRes.ok || !userGrowthRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [
        salesResult, 
        ordersResult, 
        userTypesResult, 
        revenueResult,
        dailySalesResult,
        paymentMethodsResult,
        userGrowthResult
      ] = await Promise.all([
        salesRes.json(),
        ordersRes.json(),
        userTypesRes.json(),
        revenueRes.json(),
        dailySalesRes.json(),
        paymentMethodsRes.json(),
        userGrowthRes.json()
      ]);

      // Update state with fetched data
      if (salesResult.success) {
        setSalesData(salesResult.data);
      }
      
      if (ordersResult.success) {
        setOrderData(ordersResult.data);
      }
      
      if (userTypesResult.success) {
        setUserTypeData(userTypesResult.data);
      }
      
      if (revenueResult.success) {
        setRevenueData(revenueResult.data);
      }

      if (dailySalesResult.success) {
        setDailySalesData(dailySalesResult.data);
      }

      if (paymentMethodsResult.success) {
        setPaymentMethodData(paymentMethodsResult.data);
      }

      if (userGrowthResult.success) {
        setUserGrowthData(userGrowthResult.data);
      }

    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    salesData,
    orderData,
    userTypeData,
    revenueData,
    dailySalesData,
    paymentMethodData,
    userGrowthData,
    loading,
    error,
    refetch: fetchAnalyticsData
  };
};