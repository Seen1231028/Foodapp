'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getOrders } from "@/utils/orderApi";
import { 
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Download,
  FileText,
  ArrowLeft
} from "lucide-react";

// Types from API
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

interface OrderItemData {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  image?: string;
}

interface OrderData {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  total: number;  // Backend ส่งเป็น 'total' ไม่ใช่ 'totalAmount'
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
  user: {
    id: number;
    username: string;
    fullName: string;
    phone?: string;
  };
  payments?: Array<{
    id: number;
    amount: number;
    method: string;
    status: string;
  }>;
}

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getOrders();
      
      if (result.success && result.orders) {
        setOrders(result.orders);
      } else {
        setError(result.error || 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getStatusColor = (status: OrderStatus) => {
    const statusUpper = status.toUpperCase() as OrderStatus;
    const colors: Record<OrderStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PREPARING: "bg-orange-100 text-orange-800",
      READY: "bg-purple-100 text-purple-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    return colors[statusUpper] || colors.PENDING;
  };

  const getStatusText = (status: OrderStatus) => {
    const statusUpper = status.toUpperCase() as OrderStatus;
    const texts: Record<OrderStatus, string> = {
      PENDING: "รอยืนยัน",
      CONFIRMED: "ยืนยันแล้ว",
      PREPARING: "กำลังเตรียม",
      READY: "พร้อมรับ",
      COMPLETED: "เสร็จสิ้น",
      CANCELLED: "ยกเลิก"
    };
    return texts[statusUpper] || texts.PENDING;
  };

  const getStatusIcon = (status: OrderStatus) => {
    const statusUpper = status.toUpperCase() as OrderStatus;
    const icons: Record<OrderStatus, React.ReactNode> = {
      PENDING: <Clock className="h-4 w-4" />,
      CONFIRMED: <CheckCircle className="h-4 w-4" />,
      PREPARING: <Package className="h-4 w-4" />,
      READY: <Package className="h-4 w-4" />,
      COMPLETED: <CheckCircle className="h-4 w-4" />,
      CANCELLED: <XCircle className="h-4 w-4" />
    };
    return icons[statusUpper] || icons.PENDING;
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

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      CASH: 'เงินสด',
      CREDIT_CARD: 'บัตรเครดิต',
      DEBIT_CARD: 'บัตรเดบิต',
      BANK_TRANSFER: 'โอนเงิน',
      WALLET: 'กระเป๋าเงิน',
    };
    return methods[method] || method;
  };

  // Download receipt function
  const downloadReceipt = (order: OrderData) => {
    const receiptText = `
╔═══════════════════════════════════╗
║           FOODFLOW APP            ║
╚═══════════════════════════════════╝

หมายเลขออเดอร์: ${order.orderNumber}
วันที่: ${new Date(order.createdAt).toLocaleString('th-TH')}
ลูกค้า: ${order.user.fullName}
โทร: ${order.user.phone || '-'}

────────────────────────────────────
รายการสั่งซื้อ
────────────────────────────────────
${order.items.map(item => `${item.name}
  จำนวน: ${item.quantity} x ฿${item.price}
  รวม: ฿${(item.quantity * item.price).toFixed(2)}
${item.notes ? `  หมายเหตุ: ${item.notes}` : ''}`).join('\n\n')}

────────────────────────────────────
ยอดรวมทั้งหมด: ฿${order.total.toFixed(2)}
────────────────────────────────────

${order.payments && order.payments.length > 0 ? `
วิธีการชำระเงิน: ${getPaymentMethodText(order.payments[0].method)}
สถานะการชำระ: ${order.payments[0].status === 'PAID' ? 'ชำระแล้ว' : 'รอชำระ'}
` : ''}

${order.notes ? `หมายเหตุ: ${order.notes}` : ''}

สถานะ: ${getStatusText(order.status as OrderStatus)}

────────────────────────────────────
        ขอบคุณที่ใช้บริการ
────────────────────────────────────
    `;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `receipt_${order.orderNumber}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders (backend ส่ง status เป็น lowercase)
  const currentOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status.toLowerCase())
  );
  
  const pastOrders = orders.filter(order => 
    ['completed', 'cancelled'].includes(order.status.toLowerCase())
  );

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  // Loading state
  if (loading) {
    return (
      <AppLayout userRole="customer">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout userRole="customer">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={fetchOrdersData}>ลองอีกครั้ง</Button>
        </div>
      </AppLayout>
    );
  }

  // Order Detail View
  if (selectedOrder) {
    return (
      <AppLayout userRole="customer">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">รายละเอียดออเดอร์</h1>
            <Badge className={getStatusColor(selectedOrder.status)}>
              {getStatusIcon(selectedOrder.status)}
              <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
            </Badge>
          </div>

          <Button variant="outline" onClick={() => setSelectedOrderId(null)}>
            ← กลับ
          </Button>

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>ออเดอร์ #{selectedOrder.orderNumber}</CardTitle>
              <CardDescription>
                สั่งเมื่อ {formatDate(selectedOrder.createdAt)}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลลูกค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.user.fullName}</span>
                </div>
                {selectedOrder.user.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>โทร: {selectedOrder.user.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>รายการอาหาร ({selectedOrder.items.length} รายการ)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={item.image || undefined} alt={item.name} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">หมายเหตุ:</span> {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">x{item.quantity}</div>
                      <div className="text-sm text-muted-foreground">฿{Number(item.price).toFixed(2)}</div>
                    </div>
                    <div className="font-bold min-w-[80px] text-right">
                      ฿{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
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
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>รวมทั้งสิ้น</span>
                <span>฿{Number(selectedOrder.total).toFixed(2)}</span>
              </div>
              {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">วิธีชำระเงิน:</span>
                    <span>{getPaymentMethodText(selectedOrder.payments[0].method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">สถานะการชำระ:</span>
                    <Badge variant={selectedOrder.payments[0].status === 'PAID' ? 'default' : 'secondary'}>
                      {selectedOrder.payments[0].status === 'PAID' ? 'ชำระแล้ว' : 'รอชำระ'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {selectedOrder.notes && (
            <Card>
              <CardHeader>
                <CardTitle>หมายเหตุ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedOrder.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedOrderId(null)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
            
            {['completed', 'cancelled'].includes(selectedOrder.status.toLowerCase()) && (
              <Button 
                variant="default" 
                onClick={() => downloadReceipt(selectedOrder)}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลดใบเสร็จ
              </Button>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Order List View
  return (
    <AppLayout userRole="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ประวัติการสั่งซื้อ</h1>
        
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
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">ออเดอร์ #{order.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </div>
                          
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">รายการ: </span>
                            {order.items.map((item, idx) => (
                              <span key={item.id}>
                                {item.name} x{item.quantity}
                                {idx < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <div className="text-lg font-bold">
                            ฿{Number(order.total).toFixed(2)}
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          ดูรายละเอียด
                        </Button>
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
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">ออเดอร์ #{order.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </div>
                          
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">รายการ: </span>
                            {order.items.map((item, idx) => (
                              <span key={item.id}>
                                {item.name} x{item.quantity}
                                {idx < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <div className="text-lg font-bold">
                            ฿{Number(order.total).toFixed(2)}
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
