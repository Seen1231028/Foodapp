'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileBarChart, CreditCard, TrendingUp, DollarSign, 
  ShoppingCart, Users, Calendar, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function FinancePage() {
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
                <p className="text-2xl font-bold">₿75,420</p>
                <p className="text-xs text-green-600">+12.5% จากเมื่อวาน</p>
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
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-xs text-green-600">+8.2% จากเมื่อวาน</p>
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
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-green-600">+15.3% จากเมื่อวาน</p>
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
                <p className="text-2xl font-bold">12.5%</p>
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
                <span className="text-green-600">₿1.2M</span>
              </div>
              <div className="flex justify-between">
                <span>การเติบโตของรายได้</span>
                <span className="text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between">
                <span>ร้านค้าที่มีผลงานดี</span>
                <span className="text-blue-600">25 ร้าน</span>
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
                <span className="text-orange-600">12 รายการ</span>
              </div>
              <div className="flex justify-between">
                <span>สำเร็จแล้ววันนี้</span>
                <span className="text-green-600">₿45,200</span>
              </div>
              <div className="flex justify-between">
                <span>บัญชีธนาคารที่เชื่อมต่อ</span>
                <span className="text-blue-600">8 บัญชี</span>
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
                <span className="text-green-600">₿1.89M</span>
              </div>
              <div className="flex justify-between">
                <span>ร้านที่ขายดีที่สุด</span>
                <span className="text-blue-600">Golden Thai</span>
              </div>
              <div className="flex justify-between">
                <span>เวลาขายดีสุด</span>
                <span className="text-purple-600">12-14 น.</span>
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