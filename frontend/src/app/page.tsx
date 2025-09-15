'use client';

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout, DashboardCards } from "@/components";
import Link from "next/link";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <DashboardLayout title="ยินดีต้อนรับสู่ ZeenZilla Food App">
        <DashboardCards userRole={user.role.name} />
      </DashboardLayout>
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
              <Link href="auth/login" className="w-full">
                <Button className="w-full" size="lg">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              
              <Link href="auth/register" className="w-full">
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
