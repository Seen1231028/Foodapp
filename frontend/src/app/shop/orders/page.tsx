'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Clock, CheckCircle, RefreshCw, Search, Loader2, ArrowRight } from 'lucide-react';
import apiService from '@/lib/api';
// NOTE: Backend /orders route returns a formatted shape differing from prisma Order model.
// Define a local interface matching that response.
interface UIOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  image?: string;
}

interface UIOrderPayment {
  id: number;
  method: string;
  status: string; // PAID, PENDING, etc.
  amount: number;
  paidAt?: string;
}

interface UIOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: UIOrderItem[];
  total: number;
  status: string; // lowercase per backend formatting
  notes?: string;
  createdAt: string;
  updatedAt: string;
  payments?: UIOrderPayment[];
}
import { toast } from 'react-hot-toast';

// Status metadata centralization
const STATUS_META: Record<string, { label: string; color: string; next?: string }> = {
  pending:    { label: 'รอดำเนินการ', color: 'bg-orange-100 text-orange-700 border border-orange-200', next: 'CONFIRMED' },
  confirmed:  { label: 'ยืนยันแล้ว',   color: 'bg-blue-100 text-blue-700 border border-blue-200',   next: 'PREPARING' },
  preparing:  { label: 'กำลังเตรียม',  color: 'bg-yellow-100 text-yellow-700 border border-yellow-300', next: 'READY' },
  ready:      { label: 'พร้อมเสิร์ฟ',  color: 'bg-purple-100 text-purple-700 border border-purple-200', next: 'COMPLETED' },
  completed:  { label: 'เสร็จสิ้น',    color: 'bg-green-100 text-green-700 border border-green-200' },
  cancelled:  { label: 'ยกเลิก',       color: 'bg-red-100 text-red-700 border border-red-200' }
};

const VALID_STATUS_ORDER = ['pending','confirmed','preparing','ready','completed','cancelled'];

const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `฿${num.toLocaleString()}`;
};

const timeAgo = (dateStr: string) => {
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
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const normalizeStatus = (s: string) => s?.toLowerCase();

  const fetchOrders = useCallback(async () => {
    try {
      setRefreshing(true);
      setIsLoading(prev => prev && orders.length === 0);
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${base}/orders`, {
        headers: {
          'Authorization': `Bearer ${apiService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
      const normalized = (json.data || []).map((o: any) => ({ ...o, status: normalizeStatus(o.status) }));
      setOrders(normalized);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [orders.length]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (activeStatusFilter !== 'all') {
      list = list.filter(o => o.status === activeStatusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o => o.orderNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q));
    }
    return list;
  }, [orders, activeStatusFilter, search]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { pending:0, confirmed:0, preparing:0, ready:0, completed:0, cancelled:0 };
    let totalRevenue = 0;
    for (const o of orders) {
      if (counts[o.status] !== undefined) counts[o.status]++;
      if (o.status === 'completed') totalRevenue += Number(o.total ?? 0);
    }
    return { counts, totalRevenue };
  }, [orders]);

  const updateStatus = async (orderId: number, next: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`
        },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'อัพเดทสถานะไม่สำเร็จ');
      }
      const json = await res.json();
      toast.success('อัพเดทสถานะเรียบร้อย');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: json.data.status } : o));
    } catch (e:any) {
      console.error(e);
      toast.error(e.message || 'เกิดข้อผิดพลาด');
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">จัดการออร์เดอร์</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 space-y-3">
                <div className="h-6 w-24 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_,i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-40 bg-muted rounded mb-2" />
                <div className="h-3 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-3 w-full bg-muted rounded mb-2" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">จัดการออร์เดอร์</h1>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4 mr-2" /> ลองใหม่
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">จัดการออร์เดอร์</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
            <Input placeholder="ค้นหาเลขออร์เดอร์หรือชื่อลูกค้า" className="pl-8 w-64" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" onClick={fetchOrders} disabled={refreshing}>
            {refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-5">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-orange-600">{stats.counts.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-5">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยืนยัน/เตรียม/พร้อม</p>
              <p className="text-2xl font-bold text-blue-600">{stats.counts.confirmed + stats.counts.preparing + stats.counts.ready}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-5">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-green-600">{stats.counts.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-5">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">฿</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รายได้ (สำเร็จ)</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">ออร์เดอร์ทั้งหมด ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeStatusFilter} onValueChange={setActiveStatusFilter} className="w-full">
            <TabsList className="flex flex-wrap gap-1 mb-4">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              {VALID_STATUS_ORDER.map(s => (
                <TabsTrigger key={s} value={s}>{STATUS_META[s].label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Separator className="mb-4" />
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-muted-foreground">ไม่มีออร์เดอร์ในกลุ่มนี้</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const meta = STATUS_META[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' };
                const nextCode = meta.next?.toLowerCase();
                const nextMeta = nextCode ? STATUS_META[nextCode] : undefined;
                return (
                  <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <CardTitle className="text-base font-semibold">ออร์เดอร์ #{order.orderNumber}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{timeAgo(order.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">ลูกค้า: {order.customerName || '-'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${meta.color}`}>{meta.label}</span>
                          {nextMeta && (
                            <Button size="sm" variant="outline" disabled={updatingId === order.id} onClick={() => updateStatus(order.id, meta.next!)}>
                              {updatingId === order.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <ArrowRight className="w-4 h-4 mr-1" />
                              )}
                              {nextMeta.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-sm">รายการสั่งซื้อ</h4>
                          <div className="space-y-1">
                            {order.items?.length ? order.items.map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span>{it.name} x {it.quantity}</span>
                                <span>{formatCurrency(it.price * it.quantity)}</span>
                              </div>
                            )) : <p className="text-xs text-muted-foreground">ไม่มีรายการ</p>}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-xs">
                            <span>ยอดรวม:</span>
                            <span className="font-semibold">{formatCurrency(order.total || 0)}</span>
                          </div>
                          {order.notes && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">หมายเหตุ:</span>
                              <p className="text-foreground">{order.notes}</p>
                            </div>
                          )}
                          {order.payments?.length ? (
                            <div className="text-xs mt-2">
                              <span className="text-muted-foreground">การชำระเงิน:</span>
                              <ul className="mt-1 space-y-1">
                                {order.payments.map((p: any) => (
                                  <li key={p.id} className="flex justify-between">
                                    <span>{p.method}</span>
                                    <span className={p.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>{p.status}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}