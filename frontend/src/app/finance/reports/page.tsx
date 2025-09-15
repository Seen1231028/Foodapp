'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye
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
  restaurants: number;
}

interface RestaurantRevenue {
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
  color: string;
}

export default function FinanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const metrics: FinancialMetrics = {
    totalRevenue: 2850000,
    totalOrders: 15420,
    averageOrderValue: 185,
    commission: 142500,
    pendingPayments: 25000,
    completedPayments: 2825000,
    refunds: 15000,
    growth: {
      revenue: 12.5,
      orders: 8.3,
      aov: 3.8
    }
  };

  const monthlyData: MonthlyData[] = [
    { month: "ม.ค.", revenue: 2200000, orders: 12000, commission: 110000, restaurants: 45 },
    { month: "ก.พ.", revenue: 2350000, orders: 13200, commission: 117500, restaurants: 48 },
    { month: "มี.ค.", revenue: 2500000, orders: 14100, commission: 125000, restaurants: 52 },
    { month: "เม.ย.", revenue: 2400000, orders: 13800, commission: 120000, restaurants: 50 },
    { month: "พ.ค.", revenue: 2650000, orders: 14800, commission: 132500, restaurants: 55 },
    { month: "มิ.ย.", revenue: 2850000, orders: 15420, commission: 142500, restaurants: 58 }
  ];

  const restaurantRevenue: RestaurantRevenue[] = [
    { name: "ร้านอาหารไทยแท้", revenue: 450000, orders: 2400, commission: 22500, status: "active" },
    { name: "ก๋วยเตี๋ยวลุงสมชาย", revenue: 320000, orders: 5300, commission: 16000, status: "active" },
    { name: "KFC สาขาเซ็นทรัล", revenue: 680000, orders: 2200, commission: 34000, status: "active" },
    { name: "สเต็กบ้านป้าน้อย", revenue: 380000, orders: 1500, commission: 19000, status: "active" },
    { name: "ขนมหวานมีนา", revenue: 220000, orders: 1800, commission: 11000, status: "active" },
    { name: "ซูชิกิน", revenue: 520000, orders: 1400, commission: 26000, status: "active" },
    { name: "พิซซ่าฮัท", revenue: 420000, orders: 1200, commission: 21000, status: "inactive" }
  ];

  const paymentMethods: PaymentMethodData[] = [
    { method: "บัตรเครดิต", amount: 1420000, percentage: 49.8, color: "#8884d8" },
    { method: "PromptPay", amount: 855000, percentage: 30.0, color: "#82ca9d" },
    { method: "เงินสด", amount: 427500, percentage: 15.0, color: "#ffc658" },
    { method: "TrueMoney", amount: 147500, percentage: 5.2, color: "#ff7300" }
  ];

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
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              ดูรายละเอียด
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </Button>
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
                        label={({ method, percentage }) => `${method} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                      <Badge variant="outline">{method.percentage}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(method.amount)}</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${method.percentage}%`, 
                          backgroundColor: method.color 
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