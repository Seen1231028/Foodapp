'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import apiService from '@/lib/api';
import { Order } from '@/lib/types';

const getStatusText = (status: string) => {
  const statusMap = {
    'PENDING': 'รอดำเนินการ',
    'CONFIRMED': 'ยืนยันแล้ว',
    'PREPARING': 'กำลังเตรียม',
    'READY': 'พร้อมเสิร์ฟ',
    'COMPLETED': 'เสร็จสิ้น',
    'CANCELLED': 'ยกเลิก'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'orange';
    case 'CONFIRMED': return 'blue';
    case 'PREPARING': return 'yellow';
    case 'READY': return 'purple';
    case 'COMPLETED': return 'green';
    case 'CANCELLED': return 'red';
    default: return 'gray';
  }
};

const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `฿${num.toLocaleString()}`;
};

const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'เมื่อกี้นี้';
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  return `${diffDays} วันที่แล้ว`;
};

export default function ShopOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getOrders();
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        throw new Error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">จัดการออร์เดอร์</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  const preparingOrders = orders.filter(order => order.status === 'PREPARING');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">จัดการออร์เดอร์</h1>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          รีเฟรช
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">กำลังเตรียม</p>
              <p className="text-2xl font-bold text-blue-600">{preparingOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีออร์เดอร์</h3>
          <p className="mt-1 text-sm text-gray-500">ยังไม่มีลูกค้าสั่งซื้อ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">ออร์เดอร์ #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {getTimeAgo(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant="outline" style={{ color: getStatusColor(order.status) }}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">รายการสั่งซื้อ:</h4>
                    <div className="space-y-1">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.menu?.name} x {item.quantity}</span>
                          <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                        </div>
                      )) || <p className="text-sm text-gray-500">ไม่มีรายการ</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">รายละเอียด:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>ยอดรวม:</span>
                        <span className="font-bold">{formatCurrency(Number(order.totalAmount))}</span>
                      </div>
                      {order.notes && (
                        <div>
                          <span className="text-gray-600">หมายเหตุ:</span>
                          <p className="text-gray-800">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}