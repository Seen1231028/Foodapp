'use client';

import { DashboardLayout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Search,
  Eye,
  AlertTriangle,
  Package,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

// Mock data for orders
const orders = [
  {
    id: "ORD-2024-001",
    customerName: "คุณสมชาย ใจดี",
    phone: "02-123-4567",
    items: [
      { name: "ผัดไทย", quantity: 2, price: 80 },
      { name: "ต้มยำกุ้ง", quantity: 1, price: 120 }
    ],
    total: 280,
    status: "pending",
    orderTime: "2024-03-16T14:30:00",
    deliveryAddress: "123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ",
    paymentMethod: "เงินสด",
    notes: "ไม่ใส่ผักชี"
  },
  {
    id: "ORD-2024-002",
    customerName: "คุณวิภา สวยงาม",
    phone: "02-987-6543",
    items: [
      { name: "แกงเขียวหวานไก่", quantity: 1, price: 100 },
      { name: "ข้าวผัดปู", quantity: 1, price: 150 }
    ],
    total: 250,
    status: "preparing",
    orderTime: "2024-03-16T13:45:00",
    deliveryAddress: "456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ",
    paymentMethod: "โอนเงิน",
    notes: "เผ็ดน้อย"
  },
  {
    id: "ORD-2024-003",
    customerName: "คุณอรุณ เช้าใส",
    phone: "02-555-1234",
    items: [
      { name: "มะม่วงข้าวเหนียว", quantity: 2, price: 60 }
    ],
    total: 120,
    status: "ready",
    orderTime: "2024-03-16T12:20:00",
    deliveryAddress: "789 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ",
    paymentMethod: "บัตรเครดิต",
    notes: ""
  },
  {
    id: "ORD-2024-004",
    customerName: "คุณมาลี ดอกไม้",
    phone: "02-777-8888",
    items: [
      { name: "ผัดไทย", quantity: 1, price: 80 },
      { name: "ต้มยำกุ้ง", quantity: 1, price: 120 },
      { name: "มะม่วงข้าวเหนียว", quantity: 1, price: 60 }
    ],
    total: 260,
    status: "delivering",
    orderTime: "2024-03-16T11:15:00",
    deliveryAddress: "321 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ",
    paymentMethod: "เงินสด",
    notes: "โทรก่อนถึง"
  },
  {
    id: "ORD-2024-005",
    customerName: "คุณประเสริฐ ดีเด่น",
    phone: "02-999-0000",
    items: [
      { name: "ข้าวผัดปู", quantity: 2, price: 150 }
    ],
    total: 300,
    status: "completed",
    orderTime: "2024-03-16T10:30:00",
    deliveryAddress: "654 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพฯ",
    paymentMethod: "โอนเงิน",
    notes: "ห่อแยก"
  }
];

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        รอยืนยัน
      </Badge>;
    case "preparing":
      return <Badge variant="default" className="flex items-center gap-1">
        <Package className="h-3 w-3" />
        กำลังเตรียม
      </Badge>;
    case "ready":
      return <Badge variant="outline" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        พร้อมส่ง
      </Badge>;
    case "delivering":
      return <Badge className="flex items-center gap-1">
        <Truck className="h-3 w-3" />
        กำลังส่ง
      </Badge>;
    case "completed":
      return <Badge variant="outline" className="flex items-center gap-1 text-green-600">
        <CheckCircle className="h-3 w-3" />
        เสร็จสิ้น
      </Badge>;
    case "cancelled":
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        ยกเลิก
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusAction = (status: string, orderId: string) => {
  switch (status) {
    case "pending":
      return (
        <div className="flex items-center gap-2">
          <Button size="sm">ยืนยัน</Button>
          <Button variant="outline" size="sm">ปฏิเสธ</Button>
        </div>
      );
    case "preparing":
      return <Button size="sm">พร้อมส่ง</Button>;
    case "ready":
      return <Button size="sm">เริ่มส่ง</Button>;
    case "delivering":
      return <Button size="sm" variant="outline">ส่งเสร็จ</Button>;
    default:
      return <Button variant="outline" size="sm">
        <Eye className="h-4 w-4" />
      </Button>;
  }
};

export default function ShopOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ทั้งหมด" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const preparingOrders = orders.filter(order => order.status === "preparing").length;
  const deliveringOrders = orders.filter(order => order.status === "delivering").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <DashboardLayout title="จัดการคำสั่งซื้อ">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">คำสั่งทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">รอยืนยัน</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">กำลังเตรียม</p>
                  <p className="text-2xl font-bold text-yellow-600">{preparingOrders}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">กำลังส่ง</p>
                  <p className="text-2xl font-bold text-purple-600">{deliveringOrders}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">รายได้วันนี้</p>
                  <p className="text-2xl font-bold text-green-600">฿{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for urgent orders */}
        {pendingOrders > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              มี {pendingOrders} คำสั่งซื้อรอการยืนยัน โปรดตรวจสอบและดำเนินการ
            </AlertDescription>
          </Alert>
        )}

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>รายการคำสั่งซื้อ</CardTitle>
                <CardDescription>จัดการคำสั่งซื้อของร้านคุณ</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="ค้นหาเลขคำสั่งซื้อหรือชื่อลูกค้า..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอยืนยัน</SelectItem>
                  <SelectItem value="preparing">กำลังเตรียม</SelectItem>
                  <SelectItem value="ready">พร้อมส่ง</SelectItem>
                  <SelectItem value="delivering">กำลังส่ง</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  <SelectItem value="cancelled">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขคำสั่งซื้อ</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>รายการอาหาร</TableHead>
                  <TableHead>ยอดรวม</TableHead>
                  <TableHead>เวลา</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">฿{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.orderTime).toLocaleDateString('th-TH')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.orderTime).toLocaleTimeString('th-TH')}
                      </div>
                    </TableCell>
                    <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                    <TableCell>{getStatusAction(order.status, order.id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}