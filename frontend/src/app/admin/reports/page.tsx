'use client';

import { DashboardLayout } from "@/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
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
  Users, 
  ShoppingBag, 
  DollarSign,
  Download,
  Calendar
} from "lucide-react";

// Mock data
const monthlyData = [
  { month: 'ม.ค.', users: 120, orders: 850, revenue: 425000 },
  { month: 'ก.พ.', users: 135, orders: 920, revenue: 460000 },
  { month: 'มี.ค.', users: 158, orders: 1100, revenue: 550000 },
  { month: 'เม.ย.', users: 142, orders: 980, revenue: 490000 },
  { month: 'พ.ค.', users: 167, orders: 1250, revenue: 625000 },
  { month: 'มิ.ย.', users: 189, orders: 1380, revenue: 690000 },
];

const categoryData = [
  { name: 'อาหารไทย', value: 45, color: '#0088FE' },
  { name: 'อาหารฝรั่ง', value: 25, color: '#00C49F' },
  { name: 'อาหารญี่ปุ่น', value: 15, color: '#FFBB28' },
  { name: 'อาหารจีน', value: 10, color: '#FF8042' },
  { name: 'อื่นๆ', value: 5, color: '#8884D8' },
];

const systemStats = {
  totalUsers: 1250,
  totalOrders: 8950,
  totalRevenue: 4475000,
  growthRate: 15.3,
  avgOrderValue: 500,
  topCategory: 'อาหารไทย'
};

export default function AdminReportsPage() {
  return (
    <DashboardLayout title="รายงานการใช้งานระบบ">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{systemStats.growthRate}% จากเดือนที่แล้ว
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ออเดอร์ทั้งหมด</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalOrders.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% จากเดือนที่แล้ว
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{systemStats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.2% จากเดือนที่แล้ว
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ค่าเฉลี่ยต่อออเดอร์</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{systemStats.avgOrderValue}</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% จากเดือนที่แล้ว
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>รายได้รายเดือน</CardTitle>
                  <CardDescription>สถิติรายได้ 6 เดือนล่าสุด</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`฿${value.toLocaleString()}`, 'รายได้']}
                  />
                  <Bar dataKey="revenue" fill="#0088FE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>การกระจายประเภทอาหาร</CardTitle>
              <CardDescription>สัดส่วนออเดอร์ตามประเภทอาหาร</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'สัดส่วน']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Growth Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>การเติบโตของผู้ใช้</CardTitle>
                <CardDescription>จำนวนผู้ใช้ใหม่และออเดอร์รายเดือน</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  เลือกช่วงวันที่
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออก
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  name="ผู้ใช้ใหม่"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  name="ออเดอร์"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>ตัวชี้วัดประสิทธิภาพ</CardTitle>
            <CardDescription>ความก้าวหน้าของระบบในด้านต่างๆ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">อัตราการเติบโตของผู้ใช้</span>
                  <span className="text-sm text-muted-foreground">15.3%</span>
                </div>
                <Progress value={15.3} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">อัตราการเก็บรักษาลูกค้า</span>
                  <span className="text-sm text-muted-foreground">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">ความพึงพอใจร้านค้า</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">อัตราการทำงานของระบบ</span>
                  <span className="text-sm text-muted-foreground">99.8%</span>
                </div>
                <Progress value={99.8} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}