'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Store,
  Package,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import authUtils from '@/utils/auth';

// Chart colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

interface ReportData {
  salesReport: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topSellingItems: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
  };
  userReport: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    usersByRole: Array<{
      role: string;
      count: number;
    }>;
  };
  performanceReport: {
    ordersByStatus: Array<{
      status: string;
      count: number;
    }>;
    paymentMethods: Array<{
      method: string;
      count: number;
      percentage: number;
    }>;
  };
  chartData: {
    userGrowthData: Array<{
      month: string;
      users: number;
    }>;
    salesData: Array<{
      month: string;
      sales: number;
    }>;
    revenueData: Array<{
      month: string;
      revenue: number;
    }>;
  };
  stats: {
    totalUsers: number;
    totalMenus: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
  };
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    const fetchReportData = async () => {
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

        // Fetch reports data from API
        const reportsResponse = await fetch('http://localhost:4000/api/reports/dashboard', {
          headers: authUtils.getAuthHeaders()
        });

        if (!reportsResponse.ok) {
          if (reportsResponse.status === 401) {
            setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชี Admin');
            authUtils.clearAuth();
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 2000);
            return;
          }
          throw new Error(`HTTP ${reportsResponse.status}: ${reportsResponse.statusText}`);
        }

        const reportsResult = await reportsResponse.json();
        if (reportsResult.success) {
          setReportData(reportsResult.data);
        } else {
          throw new Error(reportsResult.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน');
        }

      } catch (err) {
        console.error('Reports data fetch error:', err);
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

    fetchReportData();
  }, [selectedPeriod]);

  const getStatusName = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'สำเร็จ';
      case 'PENDING': return 'รอดำเนินการ';
      case 'PREPARING': return 'กำลังเตรียม';
      case 'CANCELLED': return 'ยกเลิก';
      case 'READY': return 'พร้อมรับ';
      default: return status;
    }
  };

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

  const getRoleName = (role: string) => {
    switch (role) {
      case 'customer': return 'ลูกค้า';
      case 'shop_owner': return 'เจ้าของร้าน';
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'finance': return 'ฝ่ายการเงิน';
      default: return role;
    }
  };

  if (loading) {
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Reports</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">รายงานและการวิเคราะห์ข้อมูลของระบบ</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              เลือกช่วงเวลา
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              ดาวน์โหลดรายงาน
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ยอดขายรวม</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ฿{reportData?.salesReport.totalSales.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                +15% จากเดือนที่แล้ว
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ออเดอร์รวม</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.salesReport.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                เฉลี่ย ฿{reportData?.salesReport.averageOrderValue} ต่อออเดอร์
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.userReport.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                ใหม่ {reportData?.userReport.newUsersThisMonth} คน เดือนนี้
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ที่ใช้งานอยู่</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.userReport.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {reportData?.userReport.activeUsers && reportData?.userReport.totalUsers 
                  ? Math.round((reportData.userReport.activeUsers / reportData.userReport.totalUsers) * 100)
                  : 0}% ของผู้ใช้ทั้งหมด
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">รายงานการขาย</TabsTrigger>
            <TabsTrigger value="users">รายงานผู้ใช้</TabsTrigger>
            <TabsTrigger value="performance">ประสิทธิภาพ</TabsTrigger>
            <TabsTrigger value="analytics">การวิเคราะห์</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>สินค้าขายดี</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData?.salesReport.topSellingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ขายได้ {item.quantity} รายการ
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">฿{item.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          เฉลี่ย ฿{Math.round(item.revenue / item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ผู้ใช้ตามบทบาท</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData?.userReport.usersByRole.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{getRoleName(role.role)}</p>
                          <p className="text-sm text-muted-foreground">
                            {((role.count / reportData.userReport.totalUsers) * 100).toFixed(1)}% ของผู้ใช้ทั้งหมด
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{role.count}</p>
                        <p className="text-sm text-muted-foreground">คน</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>สถานะออเดอร์</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData?.performanceReport.ordersByStatus.map((status, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{getStatusName(status.status)}</span>
                        </div>
                        <span className="text-lg font-bold">{status.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>วิธีการชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData?.performanceReport.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{getPaymentMethodName(method.method)}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{method.count}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({method.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>รายได้รายเดือน</CardTitle>
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
                  ) : reportData?.chartData?.revenueData ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={reportData.chartData.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          name === 'revenue' ? `฿${value.toLocaleString()}` : value,
                          name === 'revenue' ? 'รายได้' : 'ออเดอร์'
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
                  <CardTitle>การเติบโตของผู้ใช้</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData?.chartData?.userGrowthData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} คน`, 'ผู้ใช้']} />
                      <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ยอดขายรายวัน</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData?.chartData?.salesData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'sales' ? `฿${value}` : `${value} คน`,
                        name === 'sales' ? 'ยอดขาย' : 'ลูกค้า'
                      ]} />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>วิธีการชำระเงิน</CardTitle>
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
                  ) : reportData?.performanceReport?.paymentMethods ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.performanceReport.paymentMethods.map(method => ({
                            name: getPaymentMethodName(method.method),
                            value: method.percentage
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: { name: string, percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.performanceReport.paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">ไม่มีข้อมูล</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>เครื่องมือการวิเคราะห์ขั้นสูง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col">
                    <BarChart3 className="w-8 h-8 mb-2" />
                    <span>กราฟเปรียบเทียบ</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <TrendingUp className="w-8 h-8 mb-2" />
                    <span>การคาดการณ์</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Eye className="w-8 h-8 mb-2" />
                    <span>Dashboard แบบละเอียด</span>
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
