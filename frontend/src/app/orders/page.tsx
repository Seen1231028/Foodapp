'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock,
  MapPin,
  Phone,
  Star,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  MessageCircle
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantPhone: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  specialInstructions?: string;
  rating?: number;
  review?: string;
  driverName?: string;
  driverPhone?: string;
}

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const orders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-20240915-001",
      restaurantName: "ร้านอาหารไทยแท้",
      restaurantImage: "/restaurant1.jpg",
      restaurantPhone: "02-123-4567",
      status: "delivering",
      orderDate: "2024-09-15T18:30:00",
      estimatedDeliveryTime: "2024-09-15T19:15:00",
      deliveryAddress: "123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110",
      items: [
        {
          id: 1,
          name: "ผัดไทยกุ้ง",
          price: 120,
          quantity: 2,
          image: "/food1.jpg",
          specialInstructions: "ไม่ใส่ถั่วงอก"
        },
        {
          id: 2,
          name: "ต้มยำกุ้ง",
          price: 150,
          quantity: 1,
          image: "/food2.jpg"
        }
      ],
      subtotal: 390,
      deliveryFee: 25,
      total: 415,
      paymentMethod: "บัตรเครดิต",
      specialInstructions: "ส่งมาห้อง 1205",
      driverName: "คุณสมชาย",
      driverPhone: "081-234-5678"
    },
    {
      id: 2,
      orderNumber: "ORD-20240914-002",
      restaurantName: "ก๋วยเตี๋ยวลุงสมชาย",
      restaurantImage: "/restaurant2.jpg",
      restaurantPhone: "02-456-7890",
      status: "delivered",
      orderDate: "2024-09-14T12:15:00",
      estimatedDeliveryTime: "2024-09-14T12:45:00",
      deliveryAddress: "123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110",
      items: [
        {
          id: 3,
          name: "ก๋วยเตี๋ยวต้มยำ",
          price: 60,
          quantity: 2,
          image: "/food3.jpg"
        }
      ],
      subtotal: 120,
      deliveryFee: 20,
      total: 140,
      paymentMethod: "เงินสด",
      rating: 5,
      review: "อร่อยมาก ส่งเร็ว"
    },
    {
      id: 3,
      orderNumber: "ORD-20240913-003",
      restaurantName: "KFC สาขาเซ็นทรัล",
      restaurantImage: "/restaurant3.jpg",
      restaurantPhone: "02-789-0123",
      status: "cancelled",
      orderDate: "2024-09-13T19:00:00",
      estimatedDeliveryTime: "2024-09-13T19:45:00",
      deliveryAddress: "123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110",
      items: [
        {
          id: 4,
          name: "ไก่ทอดเก้าชิ้น",
          price: 299,
          quantity: 1,
          image: "/food4.jpg"
        }
      ],
      subtotal: 299,
      deliveryFee: 30,
      total: 329,
      paymentMethod: "บัตรเครดิต"
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-purple-100 text-purple-800",
      delivering: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: "รอยืนยัน",
      confirmed: "ยืนยันแล้ว",
      preparing: "กำลังเตรียม",
      ready: "พร้อมส่ง",
      delivering: "กำลังส่ง",
      delivered: "ส่งแล้ว",
      cancelled: "ยกเลิก"
    };
    return texts[status] || texts.pending;
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      preparing: <Package className="h-4 w-4" />,
      ready: <Package className="h-4 w-4" />,
      delivering: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };
    return icons[status] || icons.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(order.status)
  );
  
  const pastOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  if (selectedOrder) {
    return (
      <DashboardLayout title="รายละเอียดออเดอร์">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedOrderId(null)}>
              ← กลับ
            </Button>
            <Badge className={getStatusColor(selectedOrder.status)}>
              {getStatusIcon(selectedOrder.status)}
              <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>ออเดอร์ #{selectedOrder.orderNumber}</span>
              </CardTitle>
              <CardDescription>
                สั่งเมื่อ {formatDate(selectedOrder.orderDate)}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลร้าน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedOrder.restaurantImage} alt={selectedOrder.restaurantName} />
                  <AvatarFallback>{selectedOrder.restaurantName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedOrder.restaurantName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{selectedOrder.restaurantPhone}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  ติดต่อร้าน
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Driver Info */}
          {selectedOrder.status === 'delivering' && selectedOrder.driverName && (
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลผู้ส่ง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{selectedOrder.driverName.charAt(2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedOrder.driverName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{selectedOrder.driverPhone}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    ติดต่อผู้ส่ง
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>รายการอาหาร</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.specialInstructions && (
                        <p className="text-sm text-muted-foreground">หมายเหตุ: {item.specialInstructions}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">x{item.quantity}</div>
                      <div className="text-sm text-muted-foreground">฿{item.price}</div>
                    </div>
                    <div className="font-bold">฿{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>ยอดรวม</span>
                <span>฿{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าส่ง</span>
                <span>฿{selectedOrder.deliveryFee}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>รวมทั้งสิ้น</span>
                <span>฿{selectedOrder.total}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ชำระด้วย: {selectedOrder.paymentMethod}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลการจัดส่ง</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>{selectedOrder.deliveryAddress}</span>
              </div>
              {selectedOrder.specialInstructions && (
                <div>
                  <span className="text-sm font-medium">หมายเหตุพิเศษ:</span>
                  <p className="text-sm text-muted-foreground">{selectedOrder.specialInstructions}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>เวลาที่คาดหวัง: {formatDate(selectedOrder.estimatedDeliveryTime)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          {selectedOrder.status === 'delivered' && selectedOrder.rating && (
            <Card>
              <CardHeader>
                <CardTitle>รีวิวของคุณ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < selectedOrder.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2">{selectedOrder.rating} ดาว</span>
                </div>
                {selectedOrder.review && (
                  <p className="text-sm">{selectedOrder.review}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {selectedOrder.status === 'delivered' && !selectedOrder.rating && (
              <Button>
                <Star className="h-4 w-4 mr-1" />
                ให้คะแนน
              </Button>
            )}
            {['pending', 'confirmed'].includes(selectedOrder.status) && (
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-1" />
                ยกเลิกออเดอร์
              </Button>
            )}
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              สั่งซ้ำ
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="ประวัติการสั่งซื้อ">
      <div className="space-y-6">
        <Tabs defaultValue="current" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">ออเดอร์ปัจจุบัน ({currentOrders.length})</TabsTrigger>
            <TabsTrigger value="past">ประวัติ ({pastOrders.length})</TabsTrigger>
          </TabsList>

          {/* Current Orders */}
          <TabsContent value="current" className="space-y-4">
            {currentOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ไม่มีออเดอร์ปัจจุบัน</p>
                </CardContent>
              </Card>
            ) : (
              currentOrders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={order.restaurantImage} alt={order.restaurantName} />
                        <AvatarFallback>{order.restaurantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{order.restaurantName}</h3>
                            <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
                          </div>
                          
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{getStatusText(order.status)}</span>
                            </Badge>
                            <div className="text-lg font-bold mt-1">฿{order.total}</div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} รายการ • คาดหวัง {formatDate(order.estimatedDeliveryTime)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedOrderId(order.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              ดูรายละเอียด
                            </Button>
                            {order.status === 'delivering' && (
                              <Button variant="outline" size="sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                ติดตามออเดอร์
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Past Orders */}
          <TabsContent value="past" className="space-y-4">
            {pastOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ไม่มีประวัติการสั่งซื้อ</p>
                </CardContent>
              </Card>
            ) : (
              pastOrders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={order.restaurantImage} alt={order.restaurantName} />
                        <AvatarFallback>{order.restaurantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{order.restaurantName}</h3>
                            <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
                            {order.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{order.rating} ดาว</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{getStatusText(order.status)}</span>
                            </Badge>
                            <div className="text-lg font-bold mt-1">฿{order.total}</div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} รายการ
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedOrderId(order.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              ดูรายละเอียด
                            </Button>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              สั่งซ้ำ
                            </Button>
                            {order.status === 'delivered' && !order.rating && (
                              <Button variant="outline" size="sm">
                                <Star className="h-3 w-3 mr-1" />
                                ให้คะแนน
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}