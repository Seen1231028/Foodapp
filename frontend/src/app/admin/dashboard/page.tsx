'use client';

import { DashboardLayout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Store, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Link from "next/link";

// Mock data for dashboard
const dashboardStats = [
  { 
    label: "ผู้ใช้งานทั้งหมด", 
    value: "12,845", 
    change: "+12.5%",
    changeType: "increase",
    icon: Users, 
    color: "text-blue-600",
    description: "เพิ่มขึ้น 1,425 คนจากเดือนที่แล้ว"
  },
  { 
    label: "ร้านค้าทั้งหมด", 
    value: "2,186", 
    change: "+8.3%",
    changeType: "increase",
    icon: Store, 
    color: "text-green-600",
    description: "รออนุมัติ 45 ร้าน"
  },
  { 
    label: "ยอดขายรวม", 
    value: "฿3,245,890", 
    change: "+18.7%",
    changeType: "increase",
    icon: DollarSign, 
    color: "text-orange-600",
    description: "เป้าหมายเดือนนี้ 95%"
  },
  { 
    label: "คำสั่งซื้อวันนี้", 
    value: "1,847", 
    change: "-3.2%",
    changeType: "decrease",
    icon: ShoppingBag, 
    color: "text-purple-600",
    description: "เฉลี่ย 1,650 คำสั่ง/วัน"
  }
];

const weeklyOrders = [
  { day: 'จันทร์', orders: 1200, revenue: 180000 },
  { day: 'อังคาร', orders: 1350, revenue: 205000 },
  { day: 'พุธ', orders: 1180, revenue: 172000 },
  { day: 'พฤหัส', orders: 1620, revenue: 245000 },
  { day: 'ศุกร์', orders: 1890, revenue: 285000 },
  { day: 'เสาร์', orders: 2150, revenue: 325000 },
  { day: 'อาทิตย์', orders: 1950, revenue: 295000 }
];

const monthlyGrowth = [
  { month: 'ม.ค.', users: 850, shops: 145, orders: 28500 },
  { month: 'ก.พ.', users: 950, shops: 165, orders: 32000 },
  { month: 'มี.ค.', users: 1150, shops: 185, orders: 38500 },
  { month: 'เม.ย.', users: 1320, shops: 205, orders: 42000 },
  { month: 'พ.ค.', users: 1485, shops: 225, orders: 47500 },
  { month: 'มิ.ย.', users: 1650, shops: 248, orders: 52000 }
];

const userDistribution = [
  { name: 'ลูกค้า', value: 85, count: 10918 },
  { name: 'เจ้าของร้าน', value: 12, count: 1541 },
  { name: 'ผู้ดูแลระบบ', value: 2, count: 257 },
  { name: 'ฝ่ายการเงิน', value: 1, count: 129 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentActivities = [
  {
    id: 1,
    type: "shop_approval",
    message: "ร้านอาหารไทยแท้ได้รับการอนุมัติแล้ว",
    time: "5 นาทีที่แล้ว",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "user_registration",
    message: "มีผู้ใช้ใหม่สมัครสมาชิก 15 คน",
    time: "10 นาทีที่แล้ว",
    icon: Users,
    color: "text-blue-600"
  },
  {
    id: 3,
    type: "payment_issue",
    message: "การชำระเงินมีปัญหา - ร้าน Pizza Corner",
    time: "25 นาทีที่แล้ว",
    icon: AlertTriangle,
    color: "text-red-600"
  },
  {
    id: 4,
    type: "high_order_volume",
    message: "ยอดคำสั่งซื้อสูงกว่าปกติ 25%",
    time: "1 ชั่วโมงที่แล้ว",
    icon: TrendingUp,
    color: "text-orange-600"
  },
  {
    id: 5,
    type: "shop_pending",
    message: "มีร้านค้ารออนุมัติ 3 ร้าน",
    time: "2 ชั่วโมงที่แล้ว",
    icon: Clock,
    color: "text-yellow-600"
  }
];

const pendingTasks = [
  {
    id: 1,
    title: "อนุมัติร้านค้าใหม่",
    count: 45,
    priority: "high",
    description: "ร้านค้าที่รออนุมัติการเข้าร่วม"
  },
  {
    id: 2,
    title: "ตรวจสอบการชำระเงิน",
    count: 8,
    priority: "medium",
    description: "รายการชำระเงินที่มีปัญหา"
  },
  {
    id: 3,
    title: "จัดการข้อร้องเรียน",
    count: 23,
    priority: "medium",
    description: "ข้อร้องเรียนจากผู้ใช้งาน"
  },
  {
    id: 4,
    title: "อัปเดตนโยบาย",
    count: 2,
    priority: "low",
    description: "เอกสารนโยบายที่ต้องปรับปรุง"
  }
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">สำคัญมาก</Badge>;
    case "medium":
      return <Badge variant="default">ปานกลาง</Badge>;
    case "low":
      return <Badge variant="secondary">ต่ำ</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.changeType === "increase" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-full">
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              มีร้านค้า 45 ร้านรออนุมัติ และการชำระเงิน 8 รายการที่ต้องตรวจสอบ
            </AlertDescription>
          </Alert>
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              ยอดขายเดือนนี้เติบโต 18.7% และมีผู้ใช้ใหม่เพิ่มขึ้น 12.5%
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>คำสั่งซื้อรายสัปดาห์</CardTitle>
              <CardDescription>จำนวนคำสั่งซื้อและยอดขายรายวัน</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'orders' ? `${value.toLocaleString()} คำสั่ง` : `฿${value.toLocaleString()}`,
                      name === 'orders' ? 'คำสั่งซื้อ' : 'ยอดขาย'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#8884d8" name="คำสั่งซื้อ" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="ยอดขาย" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>การเติบโตรายเดือน</CardTitle>
              <CardDescription>จำนวนผู้ใช้ ร้านค้า และคำสั่งซื้อ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      value.toLocaleString(),
                      name === 'users' ? 'ผู้ใช้' : name === 'shops' ? 'ร้านค้า' : 'คำสั่งซื้อ'
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="ผู้ใช้" />
                  <Line type="monotone" dataKey="shops" stroke="#82ca9d" strokeWidth={2} name="ร้านค้า" />
                  <Line type="monotone" dataKey="orders" stroke="#ffc658" strokeWidth={2} name="คำสั่งซื้อ" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>การกระจายผู้ใช้งาน</CardTitle>
              <CardDescription>สัดส่วนผู้ใช้งานตามบทบาท</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>กิจกรรมล่าสุด</CardTitle>
              <CardDescription>อัปเดตแบบเรียลไทม์</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-1 bg-muted rounded-full">
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-card-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>งานที่ต้องดำเนินการ</CardTitle>
              <CardDescription>รายการที่ต้องติดตาม</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{task.title}</span>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{task.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>การดำเนินการด่วน</CardTitle>
            <CardDescription>ลิงก์ไปยังงานที่ใช้บ่อย</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Button className="h-20 flex flex-col gap-2 w-full" variant="outline">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">จัดการผู้ใช้</span>
                </Button>
              </Link>
              <Link href="/admin/shops">
                <Button className="h-20 flex flex-col gap-2 w-full" variant="outline">
                  <Store className="h-6 w-6" />
                  <span className="text-sm">อนุมัติร้านค้า</span>
                </Button>
              </Link>
              <Link href="/admin/finance">
                <Button className="h-20 flex flex-col gap-2 w-full" variant="outline">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">จัดการการเงิน</span>
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button className="h-20 flex flex-col gap-2 w-full" variant="outline">
                  <Activity className="h-6 w-6" />
                  <span className="text-sm">ดูรายงาน</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}