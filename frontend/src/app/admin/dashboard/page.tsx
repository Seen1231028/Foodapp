'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Store, DollarSign, ShoppingBag, TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

interface DashboardStats {
  users: {
    total: number;
    customers: number;
    shopOwners: number;
    admins: number;
    finance: number;
  };
  shops: {
    total: number;
  };
  revenue: {
    formatted: string;
  };
  orders: {
    today: number;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { 
    salesData, 
    orderData, 
    userTypeData, 
    revenueData, 
    loading: analyticsLoading, 
    error: analyticsError 
  } = useAnalytics();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token') || 'mock-token';
        const response = await fetch('http://localhost:4000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.data);
          }
        } else {
          console.error('API response not ok:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AppLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">ภาพรวมและการจัดการระบบ</p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats?.users.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">รวมผู้ใช้ในระบบ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ร้านค้าทั้งหมด</CardTitle>
                <Store className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats?.shops.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">เจ้าของร้านในระบบ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats?.revenue.formatted || '฿0'}
                </div>
                <p className="text-xs text-muted-foreground">ยอดขายทั้งหมด</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ออเดอร์วันนี้</CardTitle>
                <ShoppingBag className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats?.orders.today || 0}
                </div>
                <p className="text-xs text-muted-foreground">คำสั่งซื้อวันนี้</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  ยอดขายรายวัน
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
                  </div>
                ) : analyticsError ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-red-500">ข้อผิดพลาด: {analyticsError}</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`฿${value}`, 'ยอดขาย']} />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  จำนวนออเดอร์รายเดือน
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
                  </div>
                ) : analyticsError ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-red-500">ข้อผิดพลาด: {analyticsError}</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} ออเดอร์`, 'จำนวน']} />
                      <Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  สัดส่วนผู้ใช้งาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
                  </div>
                ) : analyticsError ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-red-500">ข้อผิดพลาด: {analyticsError}</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string, percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>การจัดการด่วน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Users className="w-6 h-6 mb-2" />
                      จัดการผู้ใช้
                    </Button>
                  </Link>
                  <Link href="/admin/shops">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Store className="w-6 h-6 mb-2" />
                      จัดการร้านค้า
                    </Button>
                  </Link>
                  <Link href="/admin/finance">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <DollarSign className="w-6 h-6 mb-2" />
                      การเงิน
                    </Button>
                  </Link>
                  <Link href="/admin/reports">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <ShoppingBag className="w-6 h-6 mb-2" />
                      รายงาน
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
