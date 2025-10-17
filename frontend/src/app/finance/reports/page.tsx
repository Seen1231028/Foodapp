'use client';

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Calendar,
  Filter,
  Eye,
  FileText,
  FileJson,
  Printer
} from "lucide-react";

interface FinancialMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  commission: number;
  pendingPayments: number;
  completedPayments: number;
  refunds: number;
  growth: {
    revenue: number;
    orders: number;
    aov: number;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
  commission: number;
}

interface RestaurantRevenue {
  shopId?: number;
  name: string;
  revenue: number;
  orders: number;
  commission: number;
  status: 'active' | 'inactive';
}

interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
}

interface ReportData {
  metrics: FinancialMetrics;
  monthlyData: MonthlyData[];
  restaurantRevenue: RestaurantRevenue[];
  paymentMethods: PaymentMethodData[];
}

export default function FinanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบ');
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/finance/reports?period=${selectedPeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลรายงานได้');
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  // Payment method colors
  const paymentColors: Record<string, string> = {
    'CREDIT_CARD': '#8884d8',
    'DEBIT_CARD': '#82ca9d',
    'CASH': '#ffc658',
    'BANK_TRANSFER': '#ff7300',
    'WALLET': '#0088aa'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  // Export functions
  const exportToCSV = () => {
    if (!data) return;

    const { metrics, monthlyData, restaurantRevenue, paymentMethods } = data;

    // สร้าง CSV content
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    
    // Header
    csv += `รายงานการเงิน\n`;
    csv += `ช่วงเวลา: ${getPeriodLabel(selectedPeriod)}\n`;
    csv += `วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    // Metrics Summary
    csv += `สรุปภาพรวม\n`;
    csv += `รายการ,จำนวน,การเติบโต\n`;
    csv += `รายได้รวม,${metrics.totalRevenue.toFixed(2)},${metrics.growth.revenue.toFixed(2)}%\n`;
    csv += `จำนวนออเดอร์,${metrics.totalOrders},${metrics.growth.orders.toFixed(2)}%\n`;
    csv += `มูลค่าเฉลี่ยต่อออเดอร์,${metrics.averageOrderValue.toFixed(2)},${metrics.growth.aov.toFixed(2)}%\n`;
    csv += `ค่าคอมมิชชั่น,${metrics.commission.toFixed(2)},\n`;
    csv += `รอการชำระเงิน,${metrics.pendingPayments.toFixed(2)},\n`;
    csv += `ชำระเงินแล้ว,${metrics.completedPayments.toFixed(2)},\n\n`;

    // Monthly Data
    csv += `รายได้รายเดือน\n`;
    csv += `เดือน,รายได้,จำนวนออเดอร์,ค่าคอมมิชชั่น\n`;
    monthlyData.forEach(month => {
      csv += `${month.month},${month.revenue.toFixed(2)},${month.orders},${month.commission.toFixed(2)}\n`;
    });
    csv += `\n`;

    // Restaurant Revenue
    csv += `รายได้ตามร้านอาหาร\n`;
    csv += `ร้านอาหาร,รายได้,จำนวนออเดอร์,ค่าคอมมิชชั่น,สถานะ\n`;
    restaurantRevenue.forEach(restaurant => {
      csv += `${restaurant.name},${restaurant.revenue.toFixed(2)},${restaurant.orders},${restaurant.commission.toFixed(2)},${restaurant.status}\n`;
    });
    csv += `\n`;

    // Payment Methods
    csv += `วิธีการชำระเงิน\n`;
    csv += `วิธีการ,จำนวนเงิน,สัดส่วน\n`;
    paymentMethods.forEach(method => {
      csv += `${method.method},${method.amount.toFixed(2)},${method.percentage.toFixed(2)}%\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานการเงิน_${selectedPeriod}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      'today': 'วันนี้',
      'yesterday': 'เมื่อวาน',
      'this_week': 'สัปดาห์นี้',
      'last_week': 'สัปดาห์ที่แล้ว',
      'this_month': 'เดือนนี้',
      'last_month': 'เดือนที่แล้ว',
      'this_year': 'ปีนี้'
    };
    return labels[period] || period;
  };

  const exportToJSON = () => {
    if (!data) return;

    const exportData = {
      reportInfo: {
        period: getPeriodLabel(selectedPeriod),
        periodKey: selectedPeriod,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Finance System'
      },
      ...data
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `finance-report_${selectedPeriod}_${Date.now()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout title="รายงานการเงิน">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="รายงานการเงิน">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="รายงานการเงิน">
        <Alert>
          <AlertDescription>ไม่มีข้อมูล</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const { metrics, monthlyData, restaurantRevenue, paymentMethods } = data;

  return (
    <DashboardLayout title="รายงานการเงิน">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">วันนี้</SelectItem>
                <SelectItem value="yesterday">เมื่อวาน</SelectItem>
                <SelectItem value="this_week">สัปดาห์นี้</SelectItem>
                <SelectItem value="last_week">สัปดาห์ที่แล้ว</SelectItem>
                <SelectItem value="this_month">เดือนนี้</SelectItem>
                <SelectItem value="last_month">เดือนที่แล้ว</SelectItem>
                <SelectItem value="this_year">ปีนี้</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">ภาพรวม</SelectItem>
                <SelectItem value="revenue">รายได้</SelectItem>
                <SelectItem value="commission">ค่าคอมมิชชั่น</SelectItem>
                <SelectItem value="payments">การชำระเงิน</SelectItem>
                <SelectItem value="restaurants">ร้านอาหาร</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={printReport} disabled={!data}>
              <Printer className="h-4 w-4 mr-2" />
              พิมพ์
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={!data}>
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออกรายงาน
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>เลือกรูปแบบ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  ส่งออกเป็น CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON}>
                  <FileJson className="h-4 w-4 mr-2" />
                  ส่งออกเป็น JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(metrics.growth.revenue)}`}>
                {getGrowthIcon(metrics.growth.revenue)}
                <span className="ml-1">+{metrics.growth.revenue}% จากเดือนที่แล้ว</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">จำนวนออเดอร์</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.totalOrders)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(metrics.growth.orders)}`}>
                {getGrowthIcon(metrics.growth.orders)}
                <span className="ml-1">+{metrics.growth.orders}% จากเดือนที่แล้ว</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ค่าเฉลี่ยต่อออเดอร์</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(metrics.growth.aov)}`}>
                {getGrowthIcon(metrics.growth.aov)}
                <span className="ml-1">+{metrics.growth.aov}% จากเดือนที่แล้ว</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ค่าคอมมิชชั่น</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.commission)}</div>
              <p className="text-xs text-muted-foreground">5% ของยอดขายรวม</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="revenue">รายได้</TabsTrigger>
            <TabsTrigger value="payments">การชำระเงิน</TabsTrigger>
            <TabsTrigger value="restaurants">ร้านอาหาร</TabsTrigger>
            <TabsTrigger value="analytics">วิเคราะห์</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>รายได้รายเดือน</CardTitle>
                  <CardDescription>รายได้และค่าคอมมิชชั่นในช่วง 6 เดือนที่ผ่านมา</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="รายได้" />
                      <Bar dataKey="commission" fill="#82ca9d" name="ค่าคอมมิชชั่น" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Methods Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>วิธีการชำระเงิน</CardTitle>
                  <CardDescription>สัดส่วนการชำระเงินแต่ละประเภท</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ method, percentage }) => `${method} ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={paymentColors[entry.method] || '#999999'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Payment Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">ชำระเงินแล้ว</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(metrics.completedPayments)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {((metrics.completedPayments / metrics.totalRevenue) * 100).toFixed(1)}% ของยอดรวม
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-600">รอชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(metrics.pendingPayments)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {((metrics.pendingPayments / metrics.totalRevenue) * 100).toFixed(1)}% ของยอดรวม
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">เงินคืน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(metrics.refunds)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {((metrics.refunds / metrics.totalRevenue) * 100).toFixed(1)}% ของยอดรวม
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>แนวโน้มรายได้</CardTitle>
                <CardDescription>รายได้และจำนวนออเดอร์รายเดือน</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="รายได้" />
                    <Line type="monotone" dataKey="commission" stroke="#82ca9d" strokeWidth={2} name="ค่าคอมมิชชั่น" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{method.method}</span>
                      <Badge variant="outline">{method.percentage.toFixed(1)}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(method.amount)}</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${method.percentage}%`, 
                          backgroundColor: paymentColors[method.method] || '#999999'
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>รายได้ตามร้านอาหาร</CardTitle>
                <CardDescription>รายได้และค่าคอมมิชชั่นของแต่ละร้าน</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantRevenue.map((restaurant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{restaurant.name}</h3>
                          <Badge variant={restaurant.status === 'active' ? 'default' : 'secondary'}>
                            {restaurant.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(restaurant.orders)} ออเดอร์
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(restaurant.revenue)}</div>
                        <div className="text-sm text-muted-foreground">
                          ค่าคอมมิชชั่น: {formatCurrency(restaurant.commission)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>การเติบโตของจำนวนร้าน</CardTitle>
                  <CardDescription>จำนวนร้านอาหารที่เข้าร่วมระบบ</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="restaurants" stroke="#8884d8" strokeWidth={2} name="จำนวนร้าน" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>สถิติสำคัญ</CardTitle>
                  <CardDescription>ตัวเลขสำคัญของระบบ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ร้านอาหารที่ใช้งาน</span>
                    <span className="text-lg font-bold">58 ร้าน</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">อัตราการเติบโต (เดือน)</span>
                    <span className="text-lg font-bold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ออเดอร์เฉลี่ยต่อร้าน</span>
                    <span className="text-lg font-bold">266 ออเดอร์</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">รายได้เฉลี่ยต่อร้าน</span>
                    <span className="text-lg font-bold">{formatCurrency(49138)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}