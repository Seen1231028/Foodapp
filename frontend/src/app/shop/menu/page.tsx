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
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  DollarSign,
  Package,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

// Mock data for menu items
const menuItems = [
  {
    id: 1,
    name: "ผัดไทย",
    category: "อาหารจานเดียว",
    price: 80,
    cost: 45,
    description: "ผัดไทยแท้รสชาติเข้มข้น เส้นเหนียวนุ่ม",
    image: "/placeholder-food.jpg",
    isAvailable: true,
    rating: 4.5,
    orders: 145,
    profit: 35
  },
  {
    id: 2,
    name: "ต้มยำกุ้ง",
    category: "ซุป",
    price: 120,
    cost: 65,
    description: "ต้มยำกุ้งน้ำใส รสเผ็ดเปรี้ยว",
    image: "/placeholder-food.jpg",
    isAvailable: true,
    rating: 4.8,
    orders: 98,
    profit: 55
  },
  {
    id: 3,
    name: "แกงเขียวหวานไก่",
    category: "แกง",
    price: 100,
    cost: 55,
    description: "แกงเขียวหวานไก่ เข้มข้น หอมกะทิ",
    image: "/placeholder-food.jpg",
    isAvailable: false,
    rating: 4.3,
    orders: 76,
    profit: 45
  },
  {
    id: 4,
    name: "ข้าวผัดปู",
    category: "อาหารจานเดียว",
    price: 150,
    cost: 85,
    description: "ข้าวผัดปูเนื้อแน่น รสชาติกลมกล่อม",
    image: "/placeholder-food.jpg",
    isAvailable: true,
    rating: 4.6,
    orders: 67,
    profit: 65
  },
  {
    id: 5,
    name: "มะม่วงข้าวเหนียว",
    category: "ของหวาน",
    price: 60,
    cost: 25,
    description: "มะม่วงสุก ข้าวเหนียวหอม กะทิข้น",
    image: "/placeholder-food.jpg",
    isAvailable: true,
    rating: 4.7,
    orders: 89,
    profit: 35
  }
];

const categories = ["ทั้งหมด", "อาหารจานเดียว", "แกง", "ซุป", "ของหวาน"];

const getAvailabilityBadge = (isAvailable: boolean) => {
  return isAvailable ? (
    <Badge variant="outline" className="flex items-center gap-1">
      <Eye className="h-3 w-3" />
      พร้อมขาย
    </Badge>
  ) : (
    <Badge variant="secondary" className="flex items-center gap-1">
      <EyeOff className="h-3 w-3" />
      ไม่พร้อมขาย
    </Badge>
  );
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
    </div>
  );
};

export default function ShopMenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ทั้งหมด" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "ทั้งหมด" || 
                         (statusFilter === "พร้อมขาย" && item.isAvailable) ||
                         (statusFilter === "ไม่พร้อมขาย" && !item.isAvailable);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.isAvailable).length;
  const totalRevenue = menuItems.reduce((sum, item) => sum + (item.price * item.orders), 0);
  const totalProfit = menuItems.reduce((sum, item) => sum + (item.profit * item.orders), 0);

  return (
    <DashboardLayout title="จัดการเมนูอาหาร">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">เมนูทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">พร้อมขาย</p>
                  <p className="text-2xl font-bold text-green-600">{availableItems}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">รายได้รวม</p>
                  <p className="text-2xl font-bold text-orange-600">฿{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">กำไรรวม</p>
                  <p className="text-2xl font-bold text-purple-600">฿{totalProfit.toLocaleString()}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            มี {menuItems.filter(item => !item.isAvailable).length} เมนูที่ไม่พร้อมขาย โปรดตรวจสอบและอัปเดตสถานะ
          </AlertDescription>
        </Alert>

        {/* Menu Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>รายการเมนูอาหาร</CardTitle>
                <CardDescription>จัดการเมนูอาหารของร้านคุณ</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มเมนูใหม่
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="ค้นหาเมนู..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                  <SelectItem value="พร้อมขาย">พร้อมขาย</SelectItem>
                  <SelectItem value="ไม่พร้อมขาย">ไม่พร้อมขาย</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Menu Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เมนู</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>ต้นทุน</TableHead>
                  <TableHead>กำไร</TableHead>
                  <TableHead>คะแนน</TableHead>
                  <TableHead>คำสั่งซื้อ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">฿{item.price}</TableCell>
                    <TableCell className="text-muted-foreground">฿{item.cost}</TableCell>
                    <TableCell className="font-medium text-green-600">฿{item.profit}</TableCell>
                    <TableCell>{renderStars(item.rating)}</TableCell>
                    <TableCell>{item.orders} ครั้ง</TableCell>
                    <TableCell>{getAvailabilityBadge(item.isAvailable)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">ไม่พบเมนูที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}