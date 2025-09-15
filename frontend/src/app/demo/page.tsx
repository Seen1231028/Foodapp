'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Store, 
  User, 
  ArrowRight,
  Crown,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

const dashboardOptions = [
  {
    title: "Admin Dashboard",
    description: "จัดการระบบ ผู้ใช้ ร้านค้า และการเงิน",
    icon: Shield,
    href: "/admin/dashboard",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950",
    badge: "Administrator",
    badgeVariant: "destructive" as const,
    features: [
      "จัดการผู้ใช้งาน",
      "อนุมัติร้านค้า",
      "จัดการการเงิน",
      "รายงานและสถิติ"
    ]
  },
  {
    title: "Shop Owner Dashboard",
    description: "จัดการร้านอาหาร เมนู คำสั่งซื้อ และการวิเคราะห์",
    icon: Store,
    href: "/shop/dashboard",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    badge: "Shop Owner",
    badgeVariant: "default" as const,
    features: [
      "จัดการเมนูอาหาร",
      "ติดตามคำสั่งซื้อ",
      "วิเคราะห์ยอดขาย",
      "จัดการโปรโมชั่น"
    ]
  },
  {
    title: "Customer Dashboard",
    description: "สั่งอาหาร ติดตามคำสั่งซื้อ และจัดการข้อมูลส่วนตัว",
    icon: User,
    href: "/customer/dashboard",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
    badge: "Customer",
    badgeVariant: "secondary" as const,
    features: [
      "สั่งอาหารออนไลน์",
      "ติดตามการส่ง",
      "ร้านโปรด",
      "ประวัติการสั่งซื้อ"
    ]
  }
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">ZeenZilla</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Restaurant Management System Demo
          </p>
          <p className="text-muted-foreground">
            เลือก Dashboard ตามบทบาทที่ต้องการทดสอบ
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {dashboardOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.title} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${option.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${option.color}`} />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2 flex-wrap">
                    {option.title}
                    <Badge variant={option.badgeVariant}>{option.badge}</Badge>
                  </CardTitle>
                  <CardDescription className="text-center">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">ฟีเจอร์หลัก:</h4>
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={option.href} className="block">
                    <Button className="w-full group">
                      เข้าสู่ Dashboard
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Overview */}
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              ระบบจัดการร้านอาหารครบวงจร
            </CardTitle>
            <CardDescription>
              ระบบที่ครอบคลุมทุกด้านของการจัดการร้านอาหารและการสั่งอาหารออนไลน์
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-foreground mb-2">สำหรับผู้ดูแลระบบ</h4>
                <p className="text-sm text-muted-foreground">
                  จัดการผู้ใช้งาน อนุมัติร้านค้า ควบคุมการเงิน และสร้างรายงาน
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">สำหรับเจ้าของร้าน</h4>
                <p className="text-sm text-muted-foreground">
                  จัดการเมนู รับคำสั่งซื้อ วิเคราะห์ยอดขาย และจัดการโปรโมชั่น
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">สำหรับลูกค้า</h4>
                <p className="text-sm text-muted-foreground">
                  สั่งอาหารออนไลน์ ติดตามการส่ง จัดการร้านโปรด และดูประวัติ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack Info */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>สร้างด้วย Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui และ Recharts</p>
          <p className="mt-2">
            <Link href="/" className="text-primary hover:underline">
              ← กลับไปหน้าหลัก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}