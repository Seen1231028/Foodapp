'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, BarChart3, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import authUtils from '@/utils/auth';

// Chart colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

interface FinanceData {
  overview: {
    totalRevenue: number;
    totalProfit: number;
    totalCosts: number;
    growthRate: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    profit: number;
    costs: number;
  }>;
  paymentMethods: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: number;
    type: string;
    description: string;
    amount: number;
    date: string;
    status: string;
  }>;
  stats: {
    totalUsers: number;
    totalMenus: number;
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
  };
}

export default function AdminFinance() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate authentication
        if (!authUtils.isAuthenticated()) {
          setError('กรุณาเข้าสู่ระบบใหม่');
          authUtils.clearAuth();
          window.location.href = '/auth/login';
          return;
        }

        // Fetch finance dashboard data
        const financeResponse = await fetch('http://localhost:4000/api/finance/dashboard', {
          headers: authUtils.getAuthHeaders()
        });

        if (!financeResponse.ok) {
          if (financeResponse.status === 401) {
            setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชี Admin');
            authUtils.clearAuth();
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 2000);
            return;
          }
          throw new Error(`HTTP ${financeResponse.status}: ${financeResponse.statusText}`);
        }

        const financeResult = await financeResponse.json();
        if (financeResult.success) {
          setFinanceData(financeResult.data);
        } else {
          throw new Error(financeResult.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลการเงิน');
        }

        // Fetch analytics data
        const analyticsResponse = await fetch('http://localhost:4000/api/finance/analytics', {
          headers: authUtils.getAuthHeaders()
        });

        if (analyticsResponse.ok) {
          const analyticsResult = await analyticsResponse.json();
          if (analyticsResult.success) {
            setAnalyticsData(analyticsResult.data);
          }
        }

      } catch (err) {
        console.error('Finance data fetch error:', err);
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
          setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
        }
      } finally {
        setLoading(false);
      }
    };

    // Validate authentication with admin requirement
    if (!authUtils.validateAuth(true)) {
      return; // validateAuth will handle redirection
    }

    fetchFinanceData();
  }, []);

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'CASH': return 'เงินสด';
      case 'BANK_TRANSFER': return 'โอนเงิน';
      case 'CREDIT_CARD': return 'บัตรเครดิต';
      case 'DEBIT_CARD': return 'บัตรเดบิต';
      case 'WALLET': return 'กระเป๋าเงิน';
      default: return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800">ชำระแล้ว</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">รอชำระ</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800">ล้มเหลว</Badge>;
      case 'REFUNDED':
        return <Badge className="bg-blue-100 text-blue-800">คืนเงิน</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Finance Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Finance Management</h1>
          <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Finance Management</h1>
            <p className="text-muted-foreground">ตรวจสอบยอดเงินและออกรายงานทางการเงิน</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            ออกรายงาน
          </Button>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ฿{financeData?.overview?.totalRevenue?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                +{financeData?.overview?.growthRate?.toFixed(1) || '0'}% จากเดือนที่แล้ว
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รายได้วันนี้</CardTitle>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ฿{financeData?.overview?.totalProfit?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                จากยอดขายทั้งหมด
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">การชำระเงินที่สำเร็จ</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeData?.stats?.completedOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                รอดำเนินการ: {financeData?.stats?.activeOrders || 0} รายการ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้งาน</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeData?.stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">เมนูทั้งหมด: {financeData?.stats?.totalMenus || 0} รายการ</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">ธุรกรรมล่าสุด</TabsTrigger>
            <TabsTrigger value="methods">วิธีการชำระเงิน</TabsTrigger>
            <TabsTrigger value="reports">รายงาน</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ธุรกรรมล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financeData?.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <DollarSign className={`w-5 h-5 ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleString('th-TH')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ฿{transaction.amount.toLocaleString()}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>สถิติการชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financeData?.paymentMethods?.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.method}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.percentage}% ของยอดรวม
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ฿{method.amount?.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {method.percentage}% ของยอดรวม
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    รายได้รายวัน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
                    </div>
                  ) : error ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-red-500">ข้อผิดพลาด: {error}</div>
                    </div>
                  ) : analyticsData?.dailySalesData ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.dailySalesData.map((item: any) => ({ 
                        day: item.day, 
                        revenue: item.sales, 
                        transactions: item.customers 
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          name === 'revenue' ? `฿${value.toLocaleString()}` : value,
                          name === 'revenue' ? 'รายได้' : 'ธุรกรรม'
                        ]} />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">ไม่มีข้อมูล</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>สัดส่วนการชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={financeData?.paymentMethods?.map(method => ({
                          name: method.method,
                          value: method.percentage
                        })) || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(financeData?.paymentMethods || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'สัดส่วน']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>รายได้และกำไรรายเดือน</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
                    </div>
                  ) : error ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-red-500">ข้อผิดพลาด: {error}</div>
                    </div>
                  ) : financeData?.monthlyData ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={financeData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          `฿${value.toLocaleString()}`,
                          name === 'revenue' ? 'รายได้' : 'กำไร'
                        ]} />
                        <Bar dataKey="revenue" fill="#8884d8" name="รายได้" />
                        <Bar dataKey="profit" fill="#82ca9d" name="กำไร" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-muted-foreground">ไม่มีข้อมูล</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>เครื่องมือรายงาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Receipt className="w-6 h-6 mb-2" />
                    รายงานรายวัน
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    รายงานรายสัปดาห์
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <DollarSign className="w-6 h-6 mb-2" />
                    รายงานรายเดือน
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
