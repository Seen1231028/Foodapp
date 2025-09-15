'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Store, Plus, Search, MapPin, Star, Clock, MoreHorizontal, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Mock data
const mockShops = [
  {
    id: 1,
    name: "ร้านอาหารไทยแท้",
    owner: "คุณสมชาย ใจดี",
    email: "somchai@restaurant.com",
    phone: "02-123-4567",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ",
    status: "active",
    rating: 4.5,
    totalOrders: 1250,
    revenue: 125000,
    createdAt: "2024-01-15",
    lastActive: "2024-03-15"
  },
  {
    id: 2,
    name: "Pizza Corner",
    owner: "คุณจอห์น สมิธ",
    email: "john@pizzacorner.com",
    phone: "02-234-5678",
    address: "456 ถนนสีลม กรุงเทพฯ",
    status: "active",
    rating: 4.2,
    totalOrders: 890,
    revenue: 89000,
    createdAt: "2024-02-10",
    lastActive: "2024-03-14"
  },
  {
    id: 3,
    name: "ก๋วยเตี๋ยวเรือ",
    owner: "คุณสมหญิง รักเรียน",
    email: "somying@noodleshop.com",
    phone: "02-345-6789",
    address: "789 ถนนพระราม 4 กรุงเทพฯ",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    revenue: 0,
    createdAt: "2024-03-01",
    lastActive: "2024-03-01"
  },
  {
    id: 4,
    name: "Burger House",
    owner: "คุณวิชัย สู้ไฟ",
    email: "wichai@burgerhouse.com",
    phone: "02-456-7890",
    address: "321 ถนนเพชรบุรี กรุงเทพฯ",
    status: "suspended",
    rating: 3.8,
    totalOrders: 450,
    revenue: 45000,
    createdAt: "2024-01-20",
    lastActive: "2024-03-10"
  }
];

const shopStats = [
  { label: "ร้านค้าทั้งหมด", value: 4, icon: Store, color: "bg-blue-500" },
  { label: "ร้านค้าที่ใช้งาน", value: 2, icon: CheckCircle, color: "bg-green-500" },
  { label: "รอการอนุมัติ", value: 1, icon: Clock, color: "bg-orange-500" },
  { label: "ร้านค้าที่ระงับ", value: 1, icon: XCircle, color: "bg-red-500" }
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "active": return "default";
    case "pending": return "secondary";
    case "suspended": return "destructive";
    default: return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return CheckCircle;
    case "pending": return Clock;
    case "suspended": return XCircle;
    default: return AlertCircle;
  }
};

const statusLabels = {
  active: "ใช้งาน",
  pending: "รอการอนุมัติ",
  suspended: "ระงับ"
};

export default function AdminShopsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredShops = mockShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || shop.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="จัดการร้านค้า">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shopStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${stat.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Shops Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  รายการร้านค้า ({filteredShops.length})
                </CardTitle>
                <CardDescription>
                  จัดการร้านค้าในระบบ อนุมัติ ระงับ หรือดูรายละเอียด
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มร้านค้าใหม่
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ค้นหาชื่อร้าน เจ้าของ หรืออีเมล..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="กรองตามสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="pending">รอการอนุมัติ</SelectItem>
                  <SelectItem value="suspended">ระงับ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {filteredShops.length === 0 ? (
              <Alert>
                <AlertDescription>
                  ไม่พบร้านค้าที่ตรงกับเงื่อนไขการค้นหา
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ร้านค้า</TableHead>
                      <TableHead>เจ้าของ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>คะแนน</TableHead>
                      <TableHead>ยอดขาย</TableHead>
                      <TableHead>คำสั่งซื้อ</TableHead>
                      <TableHead>วันที่สมัคร</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShops.map((shop) => {
                      const StatusIcon = getStatusIcon(shop.status);
                      return (
                        <TableRow key={shop.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-card-foreground">{shop.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {shop.address}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-card-foreground">{shop.owner}</div>
                              <div className="text-sm text-muted-foreground">{shop.email}</div>
                              <div className="text-sm text-muted-foreground">{shop.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(shop.status)} className="flex items-center gap-1 w-fit">
                              <StatusIcon className="h-3 w-3" />
                              {statusLabels[shop.status as keyof typeof statusLabels]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {shop.rating > 0 ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{shop.rating}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ฿{shop.revenue.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {shop.totalOrders.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(shop.createdAt).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals Alert */}
        {mockShops.filter(shop => shop.status === 'pending').length > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              มีร้านค้า {mockShops.filter(shop => shop.status === 'pending').length} ร้าน ที่รอการอนุมัติ กรุณาตรวจสอบและดำเนินการ
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}