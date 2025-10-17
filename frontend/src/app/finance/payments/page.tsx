'use client';

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
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
  ArrowDownRight,
  FileText,
  FileJson,
  Printer
} from "lucide-react";

interface Payment {
  id: number;
  transactionId: string;
  orderId?: number;
  orderNumber?: string;
  restaurantId?: number;
  restaurantName: string;
  restaurantImage?: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'paid';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'promptpay' | 'cash' | 'debit_card' | 'wallet';
  orderDate: string;
  paymentDate?: string;
  settlementDate?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  type?: 'payment' | 'refund' | 'adjustment';
}

interface PaymentSummary {
  totalPending: number;
  totalCompleted: number;
  totalFailed: number;
  totalRefunded: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  refundedCount: number;
}

interface PaymentData {
  payments: Payment[];
  summary: PaymentSummary;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function FinancePaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบ');
        return;
      }

      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        // Map frontend status to backend status
        let backendStatus = statusFilter;
        if (statusFilter === 'completed' || statusFilter === 'processing') {
          backendStatus = 'PAID';
        } else {
          backendStatus = statusFilter.toUpperCase();
        }
        params.append('status', backendStatus);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      console.log('Fetching payments with params:', params.toString());

      const response = await fetch(
        `http://localhost:4000/api/finance/payments?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลการชำระเงินได้');
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleSearch = () => {
    fetchPayments();
  };

  // Export functions
  const exportToCSV = () => {
    console.log('🔴 exportToCSV called');
    if (!data || !data.payments || data.payments.length === 0) {
      console.log('❌ No data available');
      alert('ไม่มีข้อมูลให้ส่งออก');
      return;
    }
    console.log('✅ Data available, generating CSV...');

    const { payments, summary } = data;

    // สร้าง CSV content
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    
    // Header
    csv += `รายงานการชำระเงิน\n`;
    csv += `สถานะ: ${statusFilter === 'all' ? 'ทั้งหมด' : getStatusText(statusFilter as Payment['status'])}\n`;
    csv += `วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    // Summary
    csv += `สรุปภาพรวม\n`;
    csv += `สถานะ,จำนวนเงิน,จำนวนรายการ\n`;
    csv += `รอชำระ,${summary.totalPending.toFixed(2)},${summary.pendingCount}\n`;
    csv += `ชำระแล้ว,${summary.totalCompleted.toFixed(2)},${summary.completedCount}\n`;
    csv += `ล้มเหลว,${summary.totalFailed.toFixed(2)},${summary.failedCount}\n`;
    csv += `คืนเงินแล้ว,${summary.totalRefunded.toFixed(2)},${summary.refundedCount}\n\n`;

    // Payment details
    csv += `รายการทรานแซคชั่น\n`;
    csv += `เลขทรานแซคชั่น,ร้านอาหาร,ลูกค้า,จำนวนเงิน,ค่าคอมมิชชั่น,ยอดสุทธิ,สถานะ,วิธีชำระ,วันที่\n`;
    payments.forEach(payment => {
      csv += `${payment.transactionId},${payment.restaurantName},${payment.customerName},${payment.amount.toFixed(2)},${payment.commission.toFixed(2)},${payment.netAmount.toFixed(2)},${getStatusText(payment.status)},${getPaymentMethodText(payment.paymentMethod)},${formatDate(payment.orderDate)}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    console.log('Blob created, size:', blob.size);
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `การชำระเงิน_${statusFilter}_${Date.now()}.csv`;
    
    console.log('Downloading as:', filename);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    console.log('Link clicked');
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('✅ CSV export completed');
    alert('ดาวน์โหลด CSV สำเร็จ: ' + filename);
  };

  const exportToJSON = () => {
    console.log('🔴 exportToJSON called');
    if (!data || !data.payments || data.payments.length === 0) {
      console.log('❌ No data available');
      alert('ไม่มีข้อมูลให้ส่งออก');
      return;
    }
    console.log('✅ Data available, generating JSON...');

    const exportData = {
      reportInfo: {
        filter: statusFilter,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Finance System',
        totalRecords: data.payments.length
      },
      summary: data.summary,
      payments: data.payments,
      pagination: data.pagination
    };

    const json = JSON.stringify(exportData, null, 2);
    console.log('JSON generated, length:', json.length);
    
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `payments_${statusFilter}_${Date.now()}.json`;
    
    console.log('Downloading as:', filename);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    console.log('Link clicked');
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('✅ JSON export completed');
    alert('ดาวน์โหลด JSON สำเร็จ: ' + filename);
  };

  const printReport = () => {
    console.log('🔴 printReport called');
    window.print();
    console.log('✅ Print dialog opened');
  };

  // Download receipt for payment
  const downloadPaymentReceipt = (payment: Payment) => {
    console.log('🔴 downloadPaymentReceipt called for:', payment.transactionId);
    
    try {
      const receiptText = `
╔════════════════════════════════════╗
║          ใบเสร็จรับเงิน           ║
║         PAYMENT RECEIPT           ║
╚════════════════════════════════════╝

เลขที่ทรานแซคชั่น: ${payment.transactionId}
วันที่: ${new Date(payment.orderDate).toLocaleString('th-TH', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

────────────────────────────────────
ข้อมูลร้านอาหาร
────────────────────────────────────
ร้าน: ${payment.restaurantName}
${payment.restaurantId ? `รหัสร้าน: ${payment.restaurantId}` : ''}

────────────────────────────────────
ข้อมูลลูกค้า
────────────────────────────────────
ชื่อ: ${payment.customerName}
${payment.customerEmail ? `อีเมล: ${payment.customerEmail}` : ''}
${payment.customerPhone ? `โทร: ${payment.customerPhone}` : ''}

────────────────────────────────────
รายละเอียดการชำระเงิน
────────────────────────────────────
จำนวนเงิน: ฿${payment.amount.toFixed(2)}
ค่าคอมมิชชั่น (5%): -฿${payment.commission.toFixed(2)}
ยอดสุทธิ: ฿${payment.netAmount.toFixed(2)}

วิธีการชำระ: ${getPaymentMethodText(payment.paymentMethod)}
สถานะ: ${getStatusText(payment.status)}

${payment.paymentDate ? `วันที่ชำระเงิน: ${new Date(payment.paymentDate).toLocaleString('th-TH')}` : ''}
${payment.settlementDate ? `วันที่เคลียร์เงิน: ${new Date(payment.settlementDate).toLocaleString('th-TH')}` : ''}

${payment.notes ? `หมายเหตุ: ${payment.notes}` : ''}

────────────────────────────────────
        ขอบคุณที่ใช้บริการ
────────────────────────────────────
`;

      console.log('Receipt text generated, length:', receiptText.length);

      // Create blob with UTF-8 BOM
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + receiptText], { type: 'text/plain;charset=utf-8' });
      console.log('Blob created, size:', blob.size);
      
      const url = URL.createObjectURL(blob);
      console.log('Object URL created:', url);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      const filename = `receipt_${payment.transactionId}_${new Date().getTime()}.txt`;
      link.download = filename;
      console.log('Downloading as:', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      console.log('Link clicked');
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Cleanup completed');
      }, 100);
      
      console.log('✅ Receipt downloaded successfully');
      alert('ดาวน์โหลดใบเสร็จสำเร็จ: ' + filename);
    } catch (error) {
      console.error('❌ Error downloading receipt:', error);
      alert('เกิดข้อผิดพลาดในการดาวน์โหลดใบเสร็จ: ' + error);
    }
  };

  // Approve payment
  const handleApprovePayment = async (paymentId: number) => {
    console.log('🔴 Approving payment:', paymentId);
    
    if (!confirm('คุณต้องการอนุมัติการชำระเงินนี้หรือไม่?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('กรุณาเข้าสู่ระบบ');
        return;
      }

      // TODO: เรียก API เพื่ออนุมัติการชำระเงิน
      // const response = await fetch(`http://localhost:4000/api/finance/payments/${paymentId}/approve`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      console.log('✅ Payment approved (mock)');
      alert('อนุมัติการชำระเงินสำเร็จ');
      
      // Refresh data
      await fetchPayments();
    } catch (error) {
      console.error('❌ Error approving payment:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติการชำระเงิน');
    }
  };

  // Reject payment
  const handleRejectPayment = async (paymentId: number) => {
    console.log('🔴 Rejecting payment:', paymentId);
    
    const reason = prompt('กรุณาระบุเหตุผลในการปฏิเสธ:');
    if (!reason) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('กรุณาเข้าสู่ระบบ');
        return;
      }

      // TODO: เรียก API เพื่อปฏิเสธการชำระเงิน
      // const response = await fetch(`http://localhost:4000/api/finance/payments/${paymentId}/reject`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ reason })
      // });

      console.log('✅ Payment rejected (mock):', reason);
      alert('ปฏิเสธการชำระเงินสำเร็จ');
      
      // Refresh data
      await fetchPayments();
    } catch (error) {
      console.error('❌ Error rejecting payment:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธการชำระเงิน');
    }
  };

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const payments: Payment[] = data?.payments || [];
  
  const summary: PaymentSummary = data?.summary || {
    totalPending: 0,
    totalCompleted: 0,
    totalFailed: 0,
    totalRefunded: 0,
    pendingCount: 0,
    completedCount: 0,
    failedCount: 0,
    refundedCount: 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      paid: "bg-green-100 text-green-800",
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
      paid: "ชำระแล้ว",
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
      paid: <CheckCircle className="h-4 w-4" />,
      failed: <XCircle className="h-4 w-4" />,
      refunded: <ArrowDownRight className="h-4 w-4" />
    };
    return icons[status] || icons.pending;
  };

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    const icons = {
      credit_card: "💳",
      debit_card: "💳",
      bank_transfer: "🏦",
      promptpay: "📱",
      cash: "💵",
      wallet: "👛"
    };
    return icons[method] || icons.credit_card;
  };

  const getPaymentMethodText = (method: Payment['paymentMethod']) => {
    const texts = {
      credit_card: "บัตรเครดิต",
      debit_card: "บัตรเดบิต",
      bank_transfer: "โอนธนาคาร",
      promptpay: "PromptPay",
      cash: "เงินสด",
      wallet: "กระเป๋าเงิน"
    };
    return texts[method] || texts.credit_card;
  };

  const getTypeIcon = (type?: Payment['type']) => {
    if (!type) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    const icons = {
      payment: <ArrowUpRight className="h-4 w-4 text-green-600" />,
      refund: <ArrowDownRight className="h-4 w-4 text-red-600" />,
      adjustment: <RefreshCw className="h-4 w-4 text-blue-600" />
    };
    return icons[type] || icons.payment;
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

  if (loading) {
    return (
      <DashboardLayout title="การชำระเงิน">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="การชำระเงิน">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

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
            <Button 
              variant="outline"
              onClick={() => {
                console.log('🔴 Download receipt button clicked!');
                downloadPaymentReceipt(selectedPayment);
              }}
            >
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
                  <SelectValue placeholder="สถานะทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอชำระ</SelectItem>
                  <SelectItem value="completed">ชำระแล้ว</SelectItem>
                  <SelectItem value="failed">ล้มเหลว</SelectItem>
                  <SelectItem value="refunded">คืนเงินแล้ว</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button disabled={!data || !data.payments || data.payments.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    ส่งออก
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>เลือกรูปแบบ</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileText className="h-4 w-4 mr-2" />
                    ส่งออกเป็น CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToJSON}>
                    <FileJson className="h-4 w-4 mr-2" />
                    ส่งออกเป็น JSON
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={printReport}>
                    <Printer className="h-4 w-4 mr-2" />
                    พิมพ์รายงาน
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium">ชำระแล้ว</CardTitle>
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
                          <Button 
                            size="sm"
                            onClick={() => handleApprovePayment(payment.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectPayment(payment.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            ปฏิเสธ
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedPaymentId(payment.id)}
                          >
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

          {/* Bank Accounts Tab - Coming Soon */}
          <TabsContent value="accounts" className="space-y-4">
            <Alert>
              <AlertDescription>
                ฟีเจอร์การจัดการบัญชีธนาคารกำลังพัฒนา
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}