'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Store, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  Clock, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";

// Mock data for shop owner
const shopInfo = {
  name: "ร้านอาหารไทยแท้",
  rating: 4.5,
  totalReviews: 234,
  status: "active",
  joinDate: "2024-01-15"
};

const todayStats = [
  { label: "คำสั่งซื้อวันนี้", value: "23", change: "+12%", trend: "up", icon: ShoppingBag, color: "text-blue-600" },
  { label: "รายได้วันนี้", value: "฿4,500", change: "+8%", trend: "up", icon: DollarSign, color: "text-green-600" },
  { label: "เมนูยอดนิยม", value: "ผัดไทย", change: "15 จาน", trend: "up", icon: Star, color: "text-yellow-600" },
  { label: "เวลาเฉลี่ย", value: "12 นาที", change: "-2 นาที", trend: "down", icon: Clock, color: "text-purple-600" }
];

const salesData = [
  { day: 'จ.', orders: 18, revenue: 3600 },
  { day: 'อ.', orders: 22, revenue: 4400 },
  { day: 'พ.', orders: 25, revenue: 5000 },
  { day: 'พฤ.', orders: 19, revenue: 3800 },
  { day: 'ศ.', orders: 28, revenue: 5600 },
  { day: 'ส.', orders: 32, revenue: 6400 },
  { day: 'อา.', orders: 35, revenue: 7000 }
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "คุณสมชาย",
    items: ["ผัดไทย", "ต้มยำกุ้ง"],
    total: 280,
    status: "preparing",
    time: "5 นาทีที่แล้ว"
  },
  {
    id: "ORD-002", 
    customer: "คุณสมหญิง",
    items: ["แกงเขียวหวาน", "ข้าวผัด"],
    total: 320,
    status: "ready",
    time: "10 นาทีที่แล้ว"
  },
  {
    id: "ORD-003",
    customer: "คุณวิชัย",
    items: ["ส้มตำ", "ไก่ย่าง"],
    total: 180,
    status: "delivered",
    time: "15 นาทีที่แล้ว"
  }
];

const menuItems = [
  {
    id: 1,
    name: "ผัดไทย",
    category: "จานหลัก",
    price: 60,
    status: "available",
    orders: 45,
    revenue: 2700
  },
  {
    id: 2,
    name: "ต้มยำกุ้ง",
    category: "แกง/ต้ม",
    price: 120,
    status: "available", 
    orders: 32,
    revenue: 3840
  },
  {
    id: 3,
    name: "แกงเขียวหวาน",
    category: "แกง/ต้ม",
    price: 90,
    status: "out_of_stock",
    orders: 28,
    revenue: 2520
  },
  {
    id: 4,
    name: "ส้มตำ",
    category: "ยำ/สลัด",
    price: 50,
    status: "available",
    orders: 38,
    revenue: 1900
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "preparing":
      return <Badge variant="secondary">กำลังเตรียม</Badge>;
    case "ready":
      return <Badge variant="default">พร้อมส่ง</Badge>;
    case "delivered":
      return <Badge variant="outline">ส่งแล้ว</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getMenuStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return <Badge variant="default">พร้อมขาย</Badge>;
    case "out_of_stock":
      return <Badge variant="destructive">หมด</Badge>;
    case "disabled":
      return <Badge variant="secondary">ปิดการขาย</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ShopOwnerDashboard() {
  return (
    <DashboardLayout title={`Dashboard - ${shopInfo.name}`}>
      <div className="space-y-6">
        {/* Shop Info Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">{shopInfo.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{shopInfo.rating}</span>
                      <span className="text-sm text-muted-foreground">({shopInfo.totalReviews} รีวิว)</span>
                    </div>
                    <Badge variant="default">เปิดให้บริการ</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">แก้ไขข้อมูลร้าน</Button>
                <Button>เพิ่มเมนูใหม่</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayStats.map((stat) => {
            const IconComponent = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            const trendColor = stat.trend === 'up' ? 'text-green-500' : 'text-red-500';
            
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                        <span className={`text-xs ${trendColor}`}>{stat.change}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>ยอดขาย 7 วันย้อนหลัง</CardTitle>
              <CardDescription>คำสั่งซื้อและรายได้รายวัน</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#8884d8" name="คำสั่งซื้อ" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
              <CardDescription>รายการคำสั่งซื้อที่เข้ามาใหม่</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-card-foreground">{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.items.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">฿{order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed management */}
        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu">จัดการเมนู</TabsTrigger>
            <TabsTrigger value="orders">คำสั่งซื้อทั้งหมด</TabsTrigger>
            <TabsTrigger value="analytics">สถิติและการวิเคราะห์</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>จัดการเมนูอาหาร</CardTitle>
                    <CardDescription>เพิ่ม แก้ไข หรือปิดการขายเมนู</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มเมนูใหม่
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อเมนู</TableHead>
                        <TableHead>หมวดหมู่</TableHead>
                        <TableHead>ราคา</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>ยอดขาย</TableHead>
                        <TableHead>รายได้</TableHead>
                        <TableHead className="text-right">การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-card-foreground">{item.name}</TableCell>
                          <TableCell className="text-muted-foreground">{item.category}</TableCell>
                          <TableCell className="font-medium">฿{item.price}</TableCell>
                          <TableCell>{getMenuStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-muted-foreground">{item.orders} จาน</TableCell>
                          <TableCell className="font-medium text-green-600">฿{item.revenue.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>คำสั่งซื้อทั้งหมด</CardTitle>
                <CardDescription>ประวัติคำสั่งซื้อและการจัดการ</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    ฟีเจอร์นี้จะแสดงรายการคำสั่งซื้อทั้งหมดพร้อมฟิลเตอร์ตามสถานะและวันที่
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>สถิติและการวิเคราะห์</CardTitle>
                <CardDescription>ข้อมูลเชิงลึกเกี่ยวกับประสิทธิภาพร้านค้า</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">รายได้ 7 วันย้อนหลัง</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">เมนูยอดนิยม</h4>
                    <div className="space-y-3">
                      {menuItems.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                              {index + 1}
                            </span>
                            <span className="text-card-foreground">{item.name}</span>
                          </div>
                          <span className="text-muted-foreground">{item.orders} จาน</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}