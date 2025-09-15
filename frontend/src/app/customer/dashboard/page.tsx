'use client';

import { DashboardLayout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShoppingBag, 
  Clock, 
  Star, 
  Heart, 
  MapPin, 
  Phone,
  Mail,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit
} from "lucide-react";

// Mock data for customer
const customerInfo = {
  name: "คุณสมชาย ใจดี",
  email: "somchai@email.com",
  phone: "02-123-4567",
  address: "123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110",
  joinDate: "2024-01-15",
  totalOrders: 45,
  totalSpent: 12500
};

const quickStats = [
  { label: "คำสั่งซื้อทั้งหมด", value: "45", icon: ShoppingBag, color: "text-blue-600" },
  { label: "ยอดใช้จ่ายรวม", value: "฿12,500", icon: CreditCard, color: "text-green-600" },
  { label: "ร้านโปรด", value: "8", icon: Heart, color: "text-red-600" },
  { label: "คะแนนเฉลี่ย", value: "4.5", icon: Star, color: "text-yellow-600" }
];

const recentOrders = [
  {
    id: "ORD-2024-001",
    restaurant: "ร้านอาหารไทยแท้",
    items: ["ผัดไทย", "ต้มยำกุ้ง", "มะม่วงข้าวเหนียว"],
    total: 380,
    status: "delivered",
    orderDate: "2024-03-15",
    deliveryTime: "25 นาที",
    rating: 5
  },
  {
    id: "ORD-2024-002",
    restaurant: "Pizza Corner",
    items: ["Pizza Margherita", "Coca Cola"],
    total: 420,
    status: "delivered",
    orderDate: "2024-03-12",
    deliveryTime: "30 นาที",
    rating: 4
  },
  {
    id: "ORD-2024-003",
    restaurant: "ก๋วยเตี๋ยวเรือ",
    items: ["ก๋วยเตี๋ยวเรือ", "น้ำไทยชาเย็น"],
    total: 120,
    status: "preparing",
    orderDate: "2024-03-16",
    deliveryTime: "กำลังเตรียม",
    rating: null
  }
];

const favoriteRestaurants = [
  {
    id: 1,
    name: "ร้านอาหารไทยแท้",
    cuisine: "อาหารไทย",
    rating: 4.8,
    orders: 12,
    image: "/placeholder-restaurant.jpg",
    lastOrder: "3 วันที่แล้ว"
  },
  {
    id: 2,
    name: "Pizza Corner",
    cuisine: "อาหารฝรั่ง",
    rating: 4.5,
    orders: 8,
    image: "/placeholder-restaurant.jpg",
    lastOrder: "1 สัปดาห์ที่แล้ว"
  },
  {
    id: 3,
    name: "ก๋วยเตี๋ยวเรือ",
    cuisine: "ก๋วยเตี๋ยว",
    rating: 4.3,
    orders: 6,
    image: "/placeholder-restaurant.jpg",
    lastOrder: "2 สัปดาห์ที่แล้ว"
  }
];

const addresses = [
  {
    id: 1,
    label: "บ้าน",
    address: "123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110",
    isDefault: true
  },
  {
    id: 2,
    label: "ที่ทำงาน",
    address: "456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500",
    isDefault: false
  }
];

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case "preparing":
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        กำลังเตรียม
      </Badge>;
    case "delivering":
      return <Badge variant="default" className="flex items-center gap-1">
        <Truck className="h-3 w-3" />
        กำลังส่ง
      </Badge>;
    case "delivered":
      return <Badge variant="outline" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        ส่งแล้ว
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

const renderStars = (rating: number | null) => {
  if (!rating) return <span className="text-muted-foreground">ยังไม่ได้ให้คะแนน</span>;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
    </div>
  );
};

export default function CustomerDashboard() {
  return (
    <DashboardLayout title="ยินดีต้อนรับ">
      <div className="space-y-6">
        {/* Customer Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-xl">
                  {customerInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-card-foreground">{customerInfo.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {customerInfo.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {customerInfo.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    สมาชิกตั้งแต่ {new Date(customerInfo.joinDate).toLocaleDateString('th-TH')}
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                แก้ไขโปรไฟล์
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">คำสั่งซื้อล่าสุด</TabsTrigger>
            <TabsTrigger value="favorites">ร้านโปรด</TabsTrigger>
            <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
                <CardDescription>ประวัติการสั่งอาหารของคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-card-foreground">{order.id}</span>
                              {getOrderStatusBadge(order.status)}
                            </div>
                            <h4 className="font-medium text-card-foreground">{order.restaurant}</h4>
                            <p className="text-sm text-muted-foreground">{order.items.join(", ")}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>{new Date(order.orderDate).toLocaleDateString('th-TH')}</span>
                              <span>เวลาส่ง: {order.deliveryTime}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">฿{order.total}</p>
                            {order.rating ? (
                              renderStars(order.rating)
                            ) : (
                              <Button variant="outline" size="sm" className="mt-2">
                                ให้คะแนน
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>ร้านโปรด</CardTitle>
                <CardDescription>ร้านอาหารที่คุณชื่นชอบ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRestaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="border border-border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={restaurant.image} />
                            <AvatarFallback>
                              {restaurant.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-card-foreground">{restaurant.name}</h4>
                            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                          </div>
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{restaurant.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{restaurant.orders} คำสั่งซื้อ</span>
                          </div>
                          <p className="text-xs text-muted-foreground">สั่งล่าสุด: {restaurant.lastOrder}</p>
                          <Button className="w-full" size="sm">
                            สั่งอาหาร
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>ข้อมูลติดต่อ</CardTitle>
                  <CardDescription>จัดการข้อมูลส่วนตัวของคุณ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground">ชื่อ-นามสกุล</label>
                    <p className="text-muted-foreground">{customerInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">อีเมล</label>
                    <p className="text-muted-foreground">{customerInfo.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">เบอร์โทรศัพท์</label>
                    <p className="text-muted-foreground">{customerInfo.phone}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    แก้ไขข้อมูล
                  </Button>
                </CardContent>
              </Card>

              {/* Delivery Addresses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>ที่อยู่จัดส่ง</CardTitle>
                      <CardDescription>จัดการที่อยู่สำหรับการจัดส่ง</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มที่อยู่
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-card-foreground">{addr.label}</span>
                          {addr.isDefault && <Badge variant="default" className="text-xs">ค่าเริ่มต้น</Badge>}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{addr.address}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendation Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ขณะนี้มีโปรโมชันพิเศษจากร้านโปรดของคุณ! ลดราคา 20% สำหรับคำสั่งซื้อมากกว่า ฿300
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}