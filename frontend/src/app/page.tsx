'use client';

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary">ZeenZilla</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">สวัสดี, {user.fullName}</span>
                <Button variant="outline" onClick={logout}>
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ยินดีต้อนรับสู่ ZeenZilla Food App
            </h2>
            
            {user.role.name === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">จัดการผู้ใช้</h3>
                  <p className="text-gray-600 mb-4">จัดการข้อมูลผู้ใช้ในระบบ</p>
                  <Link href="/admin/users">
                    <Button>เข้าสู่หน้าจัดการ</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">จัดการร้านค้า</h3>
                  <p className="text-gray-600 mb-4">จัดการข้อมูลร้านค้าทั้งหมด</p>
                  <Link href="/admin/shops">
                    <Button>เข้าสู่หน้าจัดการ</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">รายงาน</h3>
                  <p className="text-gray-600 mb-4">ดูรายงานการใช้งานระบบ</p>
                  <Link href="/admin/reports">
                    <Button>ดูรายงาน</Button>
                  </Link>
                </Card>
              </div>
            )}

            {user.role.name === 'shop_owner' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">จัดการเมนู</h3>
                  <p className="text-gray-600 mb-4">เพิ่ม แก้ไข หรือลบเมนูอาหาร</p>
                  <Link href="/shop/menu">
                    <Button>จัดการเมนู</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">คำสั่งซื้อ</h3>
                  <p className="text-gray-600 mb-4">ดูและจัดการคำสั่งซื้อที่เข้ามา</p>
                  <Link href="/shop/orders">
                    <Button>ดูคำสั่งซื้อ</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">รายงานยอดขาย</h3>
                  <p className="text-gray-600 mb-4">ดูสถิติและรายงานยอดขาย</p>
                  <Link href="/shop/reports">
                    <Button>ดูรายงาน</Button>
                  </Link>
                </Card>
              </div>
            )}

            {user.role.name === 'customer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">เมนูอาหาร</h3>
                  <p className="text-gray-600 mb-4">ดูเมนูอาหารและสั่งซื้อ</p>
                  <Link href="/menu">
                    <Button>ดูเมนู</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">ประวัติการสั่งซื้อ</h3>
                  <p className="text-gray-600 mb-4">ดูประวัติการสั่งซื้อของคุณ</p>
                  <Link href="/orders">
                    <Button>ดูประวัติ</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">โปรไฟล์</h3>
                  <p className="text-gray-600 mb-4">จัดการข้อมูลส่วนตัว</p>
                  <Link href="/profile">
                    <Button>แก้ไขโปรไฟล์</Button>
                  </Link>
                </Card>
              </div>
            )}

            {user.role.name === 'finance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">รายงานการเงิน</h3>
                  <p className="text-gray-600 mb-4">ดูรายงานการเงินทั้งหมด</p>
                  <Link href="/finance/reports">
                    <Button>ดูรายงาน</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">การชำระเงิน</h3>
                  <p className="text-gray-600 mb-4">จัดการการชำระเงินและเคลียร์เงิน</p>
                  <Link href="/finance/payments">
                    <Button>จัดการการชำระเงิน</Button>
                  </Link>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">ยอดขายรวม</h3>
                  <p className="text-gray-600 mb-4">ดูยอดขายรวมของระบบ</p>
                  <Link href="/finance/sales">
                    <Button>ดูยอดขาย</Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ZeenZilla</h1>
          <p className="text-gray-600 mb-8">ระบบสั่งอาหารออนไลน์</p>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                ยินดีต้อนรับ
              </h2>
              <p className="text-gray-600">
                เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเริ่มใช้งาน
              </p>
            </div>
            
            <div className="space-y-4">
              <Link href="/auth/login" className="w-full">
                <Button className="w-full" size="lg">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              
              <Link href="/auth/register" className="w-full">
                <Button variant="outline" className="w-full" size="lg">
                  สมัครสมาชิก
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
