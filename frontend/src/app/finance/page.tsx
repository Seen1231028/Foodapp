'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileBarChart, CreditCard, TrendingUp, DollarSign, 
  ShoppingCart, Users, Calendar, ArrowRight, Loader2
} from 'lucide-react'
import Link from 'next/link'

interface FinanceData {
  todaySales: string;
  salesChange: string;
  todayOrders: number;
  ordersChange: string;
  newCustomers: number;
  customersChange: string;
  monthlySales: string;
  monthlyGrowth: string;
  pendingPayments: number;
  topShopName: string;
}

export default function FinancePage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบ');
        return;
      }

      const response = await fetch('http://localhost:4000/api/finance/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data.overview);
      } else {
        setError(result.error || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Fetch finance error:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-4 rounded-lg">
          ไม่พบข้อมูล
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">ระบบจัดการการเงิน</h1>
          <p className="text-muted-foreground">
            จัดการรายงานการเงิน การชำระเงิน และวิเคราะห์ยอดขายของทั้งระบบ
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Finance Dashboard
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ยอดขายรวมวันนี้</p>
                <p className="text-2xl font-bold">฿{parseFloat(data.todaySales).toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                <p className={`text-xs ${parseFloat(data.salesChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(data.salesChange) >= 0 ? '+' : ''}{data.salesChange}% จากเมื่อวาน
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">คำสั่งซื้อวันนี้</p>
                <p className="text-2xl font-bold">{data.todayOrders.toLocaleString()}</p>
                <p className={`text-xs ${parseFloat(data.ordersChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(data.ordersChange) >= 0 ? '+' : ''}{data.ordersChange}% จากเมื่อวาน
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ลูกค้าใหม่วันนี้</p>
                <p className="text-2xl font-bold">{data.newCustomers}</p>
                <p className={`text-xs ${parseFloat(data.customersChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(data.customersChange) >= 0 ? '+' : ''}{data.customersChange}% จากเมื่อวาน
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">อัตราการเติบโต</p>
                <p className="text-2xl font-bold">{data.monthlyGrowth}%</p>
                <p className="text-xs text-green-600">เดือนนี้</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reports Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileBarChart className="w-6 h-6 text-blue-600" />
              </div>
              รายงานการเงิน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              ดูรายงานการเงินแบบละเอียด วิเคราะห์รายได้ และติดตามประสิทธิภาพทางการเงิน
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>รายงานรายได้รายเดือน</span>
                <span className="text-green-600">฿{parseFloat(data.monthlySales).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between">
                <span>การเติบโตของรายได้</span>
                <span className={parseFloat(data.monthlyGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {parseFloat(data.monthlyGrowth) >= 0 ? '+' : ''}{data.monthlyGrowth}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>ร้านค้าที่ขายดีที่สุด</span>
                <span className="text-blue-600">{data.topShopName}</span>
              </div>
            </div>
            <Link href="/finance/reports" className="block">
              <Button className="w-full">
                ดูรายงานการเงิน
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Payments Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              จัดการการชำระเงิน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              จัดการธุรกรรมการชำระเงิน อนุมัติการโอนเงิน และติดตามสถานะการชำระ
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>รอการอนุมัติ</span>
                <span className="text-orange-600">{data.pendingPayments} รายการ</span>
              </div>
              <div className="flex justify-between">
                <span>สำเร็จแล้ววันนี้</span>
                <span className="text-green-600">฿{parseFloat(data.todaySales).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between">
                <span>คำสั่งซื้อวันนี้</span>
                <span className="text-blue-600">{data.todayOrders} รายการ</span>
              </div>
            </div>
            <Link href="/finance/payments" className="block">
              <Button className="w-full">
                จัดการการชำระเงิน
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sales Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              วิเคราะห์ยอดขาย
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              วิเคราะห์ยอดขายแบบละเอียด ติดตามประสิทธิภาพ และเปรียบเทียบผลงาน
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ยอดขายรวมเดือนนี้</span>
                <span className="text-green-600">฿{parseFloat(data.monthlySales).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between">
                <span>ร้านที่ขายดีที่สุด</span>
                <span className="text-blue-600">{data.topShopName}</span>
              </div>
              <div className="flex justify-between">
                <span>การเติบโต</span>
                <span className={parseFloat(data.monthlyGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {parseFloat(data.monthlyGrowth) >= 0 ? '+' : ''}{data.monthlyGrowth}%
                </span>
              </div>
            </div>
            <Link href="/finance/sales" className="block">
              <Button className="w-full">
                วิเคราะห์ยอดขาย
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            กิจกรรมล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">การชำระเงินสำเร็จ</p>
                  <p className="text-sm text-muted-foreground">Golden Thai Kitchen - ₿2,450</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 นาทีที่แล้ว</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">รายงานรายเดือนสร้างเสร็จ</p>
                  <p className="text-sm text-muted-foreground">รายงานเดือนมิถุนายน 2025</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">15 นาทีที่แล้ว</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">การชำระเงินรอการอนุมัติ</p>
                  <p className="text-sm text-muted-foreground">Sakura Sushi Bar - ₿1,890</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">1 ชั่วโมงที่แล้ว</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}