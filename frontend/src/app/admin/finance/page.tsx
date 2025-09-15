'use client';

import { DashboardLayout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState } from "react";

// Mock data for financial overview
const financialStats = [
  { 
    label: "รายได้รวม (เดือนนี้)", 
    value: "฿1,245,800", 
    change: "+12.5%",
    changeType: "increase",
    icon: DollarSign, 
    color: "text-green-600" 
  },
  { 
    label: "ค่าคอมมิชชั่น", 
    value: "฿124,580", 
    change: "+8.3%",
    changeType: "increase",
    icon: CreditCard, 
    color: "text-blue-600" 
  },
  { 
    label: "ยอดค้างจ่าย", 
    value: "฿89,450", 
    change: "-15.2%",
    changeType: "decrease",
    icon: Wallet, 
    color: "text-orange-600" 
  },
  { 
    label: "กำไรสุทธิ", 
    value: "฿89,200", 
    change: "+18.7%",
    changeType: "increase",
    icon: TrendingUp, 
    color: "text-purple-600" 
  }
];

const monthlyRevenue = [
  { month: 'ม.ค.', revenue: 950000, commission: 95000, profit: 65000 },
  { month: 'ก.พ.', revenue: 1050000, commission: 105000, profit: 75000 },
  { month: 'มี.ค.', revenue: 1245800, commission: 124580, profit: 89200 },
  { month: 'เม.ย.', revenue: 1180000, commission: 118000, profit: 82000 },
  { month: 'พ.ค.', revenue: 1320000, commission: 132000, profit: 95000 },
  { month: 'มิ.ย.', revenue: 1450000, commission: 145000, profit: 105000 }
];

const revenueByCategory = [
  { name: 'อาหารไทย', value: 35, amount: 435530 },
  { name: 'อาหารฝรั่ง', value: 25, amount: 311450 },
  { name: 'อาหารจีน', value: 20, amount: 249160 },
  { name: 'อาหารญี่ปุ่น', value: 12, amount: 149496 },
  { name: 'อื่นๆ', value: 8, amount: 99664 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const transactions = [
  {
    id: "TXN-2024-001",
    shop: "ร้านอาหารไทยแท้",
    amount: 2850,
    commission: 285,
    type: "order",
    status: "completed",
    date: "2024-03-16",
    time: "14:30"
  },
  {
    id: "TXN-2024-002",
    shop: "Pizza Corner",
    amount: -1200,
    commission: 0,
    type: "refund",
    status: "processing",
    date: "2024-03-16",
    time: "13:15"
  },
  {
    id: "TXN-2024-003",
    shop: "ก๋วยเตี๋ยวเรือ",
    amount: 480,
    commission: 48,
    type: "order",
    status: "completed",
    date: "2024-03-16",
    time: "12:45"
  },
  {
    id: "TXN-2024-004",
    shop: "Burger House",
    amount: 1650,
    commission: 165,
    type: "order",
    status: "pending",
    date: "2024-03-16",
    time: "11:20"
  },
  {
    id: "TXN-2024-005",
    shop: "ส้มตำนางแน่น",
    amount: 320,
    commission: 32,
    type: "order",
    status: "completed",
    date: "2024-03-15",
    time: "19:45"
  }
];

const pendingPayments = [
  {
    id: "PAY-2024-001",
    shop: "ร้านอาหารไทยแท้",
    amount: 28500,
    dueDate: "2024-03-20",
    daysOverdue: 0
  },
  {
    id: "PAY-2024-002",
    shop: "Pizza Corner",
    amount: 45200,
    dueDate: "2024-03-18",
    daysOverdue: 2
  },
  {
    id: "PAY-2024-003",
    shop: "ก๋วยเตี๋ยวเรือ",
    amount: 15750,
    dueDate: "2024-03-22",
    daysOverdue: 0
  }
];

const getTransactionStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="outline" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        สำเร็จ
      </Badge>;
    case "pending":
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        รอดำเนินการ
      </Badge>;
    case "processing":
      return <Badge variant="default" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        กำลังประมวลผล
      </Badge>;
    case "failed":
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        ล้มเหลว
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTransactionTypeBadge = (type: string) => {
  switch (type) {
    case "order":
      return <Badge variant="default">คำสั่งซื้อ</Badge>;
    case "refund":
      return <Badge variant="destructive">คืนเงิน</Badge>;
    case "commission":
      return <Badge variant="secondary">ค่าคอมมิชชั่น</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export default function FinanceDashboard() {
  const [timeFilter, setTimeFilter] = useState("month");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <DashboardLayout title="จัดการการเงิน">
      <div className="space-y-6">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
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

        {/* Pending Payments Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            มีการชำระเงินค้างจ่าย 2 รายการ รวม ฿60,950 โปรดตรวจสอบและดำเนินการ
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="transactions">ธุรกรรม</TabsTrigger>
            <TabsTrigger value="payments">การจ่ายเงิน</TabsTrigger>
            <TabsTrigger value="analytics">วิเคราะห์</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>รายได้รายเดือน</CardTitle>
                  <CardDescription>เปรียบเทียบรายได้และกำไรรายเดือน</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `฿${value.toLocaleString()}`, 
                          name === 'revenue' ? 'รายได้' : name === 'commission' ? 'ค่าคอมมิชชั่น' : 'กำไร'
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="รายได้" />
                      <Bar dataKey="commission" fill="#82ca9d" name="ค่าคอมมิชชั่น" />
                      <Bar dataKey="profit" fill="#ffc658" name="กำไร" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>รายได้ตามประเภทอาหาร</CardTitle>
                  <CardDescription>การกระจายรายได้ตามประเภทร้านอาหาร</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>ธุรกรรมล่าสุด</CardTitle>
                    <CardDescription>รายการธุรกรรมทั้งหมดในระบบ</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">วันนี้</SelectItem>
                        <SelectItem value="week">สัปดาห์นี้</SelectItem>
                        <SelectItem value="month">เดือนนี้</SelectItem>
                        <SelectItem value="year">ปีนี้</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทุกสถานะ</SelectItem>
                        <SelectItem value="completed">สำเร็จ</SelectItem>
                        <SelectItem value="pending">รอดำเนินการ</SelectItem>
                        <SelectItem value="processing">กำลังประมวลผล</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      ส่งออก
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสธุรกรรม</TableHead>
                      <TableHead>ร้านค้า</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>จำนวนเงิน</TableHead>
                      <TableHead>ค่าคอมมิชชั่น</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่/เวลา</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.shop}</TableCell>
                        <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                        <TableCell>
                          <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                            ฿{Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>฿{transaction.commission.toLocaleString()}</TableCell>
                        <TableCell>{getTransactionStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(transaction.date).toLocaleDateString('th-TH')}</div>
                            <div className="text-muted-foreground">{transaction.time}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>การจ่ายเงินค้างชำระ</CardTitle>
                    <CardDescription>รายการจ่ายเงินให้ร้านค้าที่ค้างชำระ</CardDescription>
                  </div>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    จ่ายเงินทั้งหมด
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสการจ่าย</TableHead>
                      <TableHead>ร้านค้า</TableHead>
                      <TableHead>จำนวนเงิน</TableHead>
                      <TableHead>กำหนดจ่าย</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.shop}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          ฿{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                        </TableCell>
                        <TableCell>
                          {payment.daysOverdue > 0 ? (
                            <Badge variant="destructive">
                              เกินกำหนด {payment.daysOverdue} วัน
                            </Badge>
                          ) : (
                            <Badge variant="secondary">ภายในกำหนด</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm">จ่ายเงิน</Button>
                            <Button variant="outline" size="sm">ดูรายละเอียด</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>แนวโน้มการเติบโต</CardTitle>
                  <CardDescription>การเติบโตของรายได้ในช่วง 6 เดือนที่ผ่านมา</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `฿${value.toLocaleString()}`, 
                          name === 'revenue' ? 'รายได้' : 'กำไร'
                        ]}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="รายได้" />
                      <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} name="กำไร" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>ข้อมูลเชิงลึก</CardTitle>
                  <CardDescription>สถิติและแนวโน้มที่สำคัญ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">การเติบโตที่แข็งแกร่ง</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      รายได้เพิ่มขึ้น 18.7% เมื่อเทียบกับเดือนที่แล้ว
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">ค่าคอมมิชชั่นเฉลี่ย</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      10% ของยอดขาย เป็นไปตามเป้าหมาย
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">ข้อควรระวัง</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      มีการชำระเงินค้างจ่าย ควรติดตามอย่างใกล้ชิด
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">เวลาชำระเงินเฉลี่ย</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      2.3 วัน ซึ่งอยู่ในเกณฑ์ที่ยอมรับได้
                    </p>
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