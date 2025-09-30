'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search,
  Filter,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface Payment {
  id: number;
  transactionId: string;
  restaurantId: number;
  restaurantName: string;
  restaurantImage: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'promptpay' | 'cash';
  orderDate: string;
  paymentDate?: string;
  settlementDate?: string;
  customerName: string;
  notes?: string;
  type: 'payment' | 'refund' | 'adjustment';
}

interface PaymentSummary {
  totalPending: number;
  totalProcessing: number;
  totalCompleted: number;
  totalFailed: number;
  totalRefunded: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  refundedCount: number;
}

interface BankAccount {
  id: number;
  restaurantId: number;
  restaurantName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
  isDefault: boolean;
}

export default function FinancePaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const payments: Payment[] = [
    {
      id: 1,
      transactionId: "TXN-20240915-001",
      restaurantId: 1,
      restaurantName: "ร้านอาหารไทยแท้",
      restaurantImage: "/restaurant1.jpg",
      amount: 580,
      commission: 29,
      netAmount: 551,
      status: "pending",
      paymentMethod: "credit_card",
      orderDate: "2024-09-15T14:30:00",
      customerName: "สมศรี ใจดี",
      type: "payment"
    },
    {
      id: 2,
      transactionId: "TXN-20240915-002",
      restaurantId: 2,
      restaurantName: "ก๋วยเตี๋ยวลุงสมชาย",
      restaurantImage: "/restaurant2.jpg",
      amount: 120,
      commission: 6,
      netAmount: 114,
      status: "completed",
      paymentMethod: "promptpay",
      orderDate: "2024-09-15T12:15:00",
      paymentDate: "2024-09-15T12:20:00",
      settlementDate: "2024-09-15T18:00:00",
      customerName: "วิชาญ ชาญณรงค์",
      type: "payment"
    },
    {
      id: 3,
      transactionId: "TXN-20240914-003",
      restaurantId: 3,
      restaurantName: "KFC สาขาเซ็นทรัล",
      restaurantImage: "/restaurant3.jpg",
      amount: 299,
      commission: 15,
      netAmount: 284,
      status: "failed",
      paymentMethod: "credit_card",
      orderDate: "2024-09-14T19:00:00",
      customerName: "นิรันดร์ สุขใจ",
      notes: "บัตรเครดิตหมดอายุ",
      type: "payment"
    },
    {
      id: 4,
      transactionId: "REF-20240914-001",
      restaurantId: 1,
      restaurantName: "ร้านอาหารไทยแท้",
      restaurantImage: "/restaurant1.jpg",
      amount: -150,
      commission: -7.5,
      netAmount: -142.5,
      status: "completed",
      paymentMethod: "credit_card",
      orderDate: "2024-09-14T16:20:00",
      paymentDate: "2024-09-14T17:00:00",
      customerName: "มานิตย์ เจริญผล",
      notes: "ยกเลิกออเดอร์ภายใน 15 นาที",
      type: "refund"
    },
    {
      id: 5,
      transactionId: "TXN-20240914-004",
      restaurantId: 4,
      restaurantName: "สเต็กบ้านป้าน้อย",
      restaurantImage: "/restaurant4.jpg",
      amount: 850,
      commission: 42.5,
      netAmount: 807.5,
      status: "processing",
      paymentMethod: "bank_transfer",
      orderDate: "2024-09-14T20:30:00",
      paymentDate: "2024-09-15T09:00:00",
      customerName: "ธนาคาร กสิกรไทย",
      type: "payment"
    }
  ];

  const summary: PaymentSummary = {
    totalPending: 25000,
    totalProcessing: 35000,
    totalCompleted: 2825000,
    totalFailed: 8500,
    totalRefunded: 15000,
    pendingCount: 45,
    processingCount: 28,
    completedCount: 1520,
    failedCount: 12,
    refundedCount: 35
  };

  const bankAccounts: BankAccount[] = [
    {
      id: 1,
      restaurantId: 1,
      restaurantName: "ร้านอาหารไทยแท้",
      bankName: "ธนาคารกสิกรไทย",
      accountNumber: "xxx-x-x0123-x",
      accountName: "บริษัท อาหารไทยแท้ จำกัด",
      isVerified: true,
      isDefault: true
    },
    {
      id: 2,
      restaurantId: 2,
      restaurantName: "ก๋วยเตี๋ยวลุงสมชาย",
      bankName: "ธนาคารไทยพาณิชย์",
      accountNumber: "xxx-x-x5678-x",
      accountName: "นายสมชาย เจริญทรัพย์",
      isVerified: true,
      isDefault: true
    },
    {
      id: 3,
      restaurantId: 5,
      restaurantName: "ขนมหวานมีนา",
      bankName: "ธนาคารกรุงเทพ",
      accountNumber: "xxx-x-x9012-x",
      accountName: "นางสาวมีนา หวานใจ",
      isVerified: false,
      isDefault: true
    }
  ];

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-purple-100 text-purple-800"
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: Payment['status']) => {
    const texts = {
      pending: "รอชำระ",
      processing: "กำลังประมวลผล",
      completed: "สำเร็จ",
      failed: "ล้มเหลว",
      refunded: "คืนเงินแล้ว"
    };
    return texts[status] || texts.pending;
  };

  const getStatusIcon = (status: Payment['status']) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <RefreshCw className="h-4 w-4 animate-spin" />,
      completed: <CheckCircle className="h-4 w-4" />,
      failed: <XCircle className="h-4 w-4" />,
      refunded: <ArrowDownRight className="h-4 w-4" />
    };
    return icons[status] || icons.pending;
  };

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    const icons = {
      credit_card: "💳",
      bank_transfer: "🏦",
      promptpay: "📱",
      cash: "💵"
    };
    return icons[method] || icons.credit_card;
  };

  const getPaymentMethodText = (method: Payment['paymentMethod']) => {
    const texts = {
      credit_card: "บัตรเครดิต",
      bank_transfer: "โอนธนาคาร",
      promptpay: "PromptPay",
      cash: "เงินสด"
    };
    return texts[method] || texts.credit_card;
  };

  const getTypeIcon = (type: Payment['type']) => {
    const icons = {
      payment: <ArrowUpRight className="h-4 w-4 text-green-600" />,
      refund: <ArrowDownRight className="h-4 w-4 text-red-600" />,
      adjustment: <RefreshCw className="h-4 w-4 text-blue-600" />
    };
    return icons[type] || icons.payment;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const selectedPayment = payments.find(p => p.id === selectedPaymentId);

  if (selectedPayment) {
    return (
      <DashboardLayout title="รายละเอียดการชำระเงิน">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedPaymentId(null)}>
              ← กลับ
            </Button>
            <Badge className={getStatusColor(selectedPayment.status)}>
              {getStatusIcon(selectedPayment.status)}
              <span className="ml-1">{getStatusText(selectedPayment.status)}</span>
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTypeIcon(selectedPayment.type)}
                <span>Transaction #{selectedPayment.transactionId}</span>
              </CardTitle>
              <CardDescription>
                {selectedPayment.type === 'refund' ? 'การคืนเงิน' : 'การชำระเงิน'} • {formatDate(selectedPayment.orderDate)}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดการชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>ยอดรวม:</span>
                  <span className="font-bold">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าคอมมิชชั่น (5%):</span>
                  <span>{formatCurrency(selectedPayment.commission)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>ยอดสุทธิ:</span>
                  <span>{formatCurrency(selectedPayment.netAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>วิธีการชำระ:</span>
                  <div className="flex items-center gap-1">
                    <span>{getPaymentMethodIcon(selectedPayment.paymentMethod)}</span>
                    <span>{getPaymentMethodText(selectedPayment.paymentMethod)}</span>
                  </div>
                </div>
                {selectedPayment.paymentDate && (
                  <div className="flex justify-between">
                    <span>วันที่ชำระ:</span>
                    <span>{formatDate(selectedPayment.paymentDate)}</span>
                  </div>
                )}
                {selectedPayment.settlementDate && (
                  <div className="flex justify-between">
                    <span>วันที่เคลียร์เงิน:</span>
                    <span>{formatDate(selectedPayment.settlementDate)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Restaurant Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลร้าน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedPayment.restaurantImage} alt={selectedPayment.restaurantName} />
                    <AvatarFallback>{selectedPayment.restaurantName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedPayment.restaurantName}</h3>
                    <p className="text-sm text-muted-foreground">ลูกค้า: {selectedPayment.customerName}</p>
                  </div>
                </div>
                {selectedPayment.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">หมายเหตุ:</p>
                    <p className="text-sm text-muted-foreground">{selectedPayment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {selectedPayment.status === 'pending' && (
              <>
                <Button>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  อนุมัติการชำระเงิน
                </Button>
                <Button variant="destructive">
                  <XCircle className="h-4 w-4 mr-1" />
                  ปฏิเสธ
                </Button>
              </>
            )}
            {selectedPayment.status === 'completed' && selectedPayment.type === 'payment' && (
              <Button variant="outline">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                ทำการคืนเงิน
              </Button>
            )}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" />
              ดาวน์โหลดใบเสร็จ
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="การชำระเงิน">
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาร้าน, เลขทรานแซคชั่น, หรือลูกค้า..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอชำระ</SelectItem>
                  <SelectItem value="processing">กำลังประมวลผล</SelectItem>
                  <SelectItem value="completed">สำเร็จ</SelectItem>
                  <SelectItem value="failed">ล้มเหลว</SelectItem>
                  <SelectItem value="refunded">คืนเงินแล้ว</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                ส่งออก
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รอชำระ</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalPending)}</div>
              <p className="text-xs text-muted-foreground">{summary.pendingCount} รายการ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ประมวลผล</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalProcessing)}</div>
              <p className="text-xs text-muted-foreground">{summary.processingCount} รายการ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">สำเร็จ</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalCompleted)}</div>
              <p className="text-xs text-muted-foreground">{summary.completedCount} รายการ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ล้มเหลว</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalFailed)}</div>
              <p className="text-xs text-muted-foreground">{summary.failedCount} รายการ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">คืนเงิน</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalRefunded)}</div>
              <p className="text-xs text-muted-foreground">{summary.refundedCount} รายการ</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">รายการทรานแซคชั่น</TabsTrigger>
            <TabsTrigger value="pending">รอดำเนินการ ({summary.pendingCount})</TabsTrigger>
            <TabsTrigger value="accounts">บัญชีธนาคาร</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={payment.restaurantImage} alt={payment.restaurantName} />
                        <AvatarFallback>{payment.restaurantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{payment.restaurantName}</h3>
                            <p className="text-sm text-muted-foreground">#{payment.transactionId}</p>
                            <p className="text-sm text-muted-foreground">ลูกค้า: {payment.customerName}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(payment.type)}
                              <Badge className={getStatusColor(payment.status)}>
                                {getStatusIcon(payment.status)}
                                <span className="ml-1">{getStatusText(payment.status)}</span>
                              </Badge>
                            </div>
                            <div className="text-lg font-bold">
                              {payment.amount >= 0 ? '+' : ''}{formatCurrency(payment.amount)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              สุทธิ: {formatCurrency(payment.netAmount)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                              <span>{getPaymentMethodText(payment.paymentMethod)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(payment.orderDate)}</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedPaymentId(payment.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            ดูรายละเอียด
                          </Button>
                        </div>
                        
                        {payment.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>หมายเหตุ:</strong> {payment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-4">
              {filteredPayments.filter(p => p.status === 'pending').map((payment) => (
                <Card key={payment.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={payment.restaurantImage} alt={payment.restaurantName} />
                          <AvatarFallback>{payment.restaurantName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{payment.restaurantName}</h3>
                          <p className="text-sm text-muted-foreground">#{payment.transactionId}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(payment.orderDate)}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-muted-foreground">สุทธิ: {formatCurrency(payment.netAmount)}</div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            ดู
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{account.restaurantName}</h3>
                          <p className="text-sm text-muted-foreground">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.accountNumber} • {account.accountName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={account.isVerified ? "default" : "secondary"}>
                          {account.isVerified ? "ยืนยันแล้ว" : "รอยืนยัน"}
                        </Badge>
                        {account.isDefault && (
                          <Badge variant="outline">ค่าเริ่มต้น</Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          ดู
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}