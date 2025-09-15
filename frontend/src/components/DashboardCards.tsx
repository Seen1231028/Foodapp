'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface DashboardCard {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

interface DashboardCardsProps {
  userRole: string;
}

const cardConfigs: Record<string, DashboardCard[]> = {
  admin: [
    {
      title: "จัดการผู้ใช้",
      description: "จัดการข้อมูลผู้ใช้ในระบบ",
      href: "/admin/users",
      buttonText: "เข้าสู่หน้าจัดการ"
    },
    {
      title: "จัดการร้านค้า",
      description: "จัดการข้อมูลร้านค้าทั้งหมด",
      href: "/admin/shops",
      buttonText: "เข้าสู่หน้าจัดการ"
    },
    {
      title: "รายงาน",
      description: "ดูรายงานการใช้งานระบบ",
      href: "/admin/reports",
      buttonText: "ดูรายงาน"
    }
  ],
  shop_owner: [
    {
      title: "Dashboard",
      description: "ภาพรวมร้านค้าและสถิติการขาย",
      href: "/shop/dashboard",
      buttonText: "ดู Dashboard"
    },
    {
      title: "จัดการเมนู",
      description: "เพิ่ม แก้ไข หรือลบเมนูอาหาร",
      href: "/shop/menu",
      buttonText: "จัดการเมนู"
    },
    {
      title: "คำสั่งซื้อ",
      description: "ดูและจัดการคำสั่งซื้อที่เข้ามา",
      href: "/shop/orders",
      buttonText: "ดูคำสั่งซื้อ"
    },
    {
      title: "รายงานยอดขาย",
      description: "ดูสถิติและรายงานยอดขาย",
      href: "/shop/reports",
      buttonText: "ดูรายงาน"
    },
    {
      title: "ข้อมูลร้าน",
      description: "จัดการข้อมูลร้านและการตั้งค่า",
      href: "/shop/profile",
      buttonText: "จัดการข้อมูล"
    }
  ],
  customer: [
    {
      title: "เมนูอาหาร",
      description: "ดูเมนูอาหารและสั่งซื้อ",
      href: "/menu",
      buttonText: "ดูเมนู"
    },
    {
      title: "ประวัติการสั่งซื้อ",
      description: "ดูประวัติการสั่งซื้อของคุณ",
      href: "/orders",
      buttonText: "ดูประวัติ"
    },
    {
      title: "โปรไฟล์",
      description: "จัดการข้อมูลส่วนตัว",
      href: "/profile",
      buttonText: "แก้ไขโปรไฟล์"
    }
  ],
  finance: [
    {
      title: "รายงานการเงิน",
      description: "ดูรายงานการเงินทั้งหมด",
      href: "/finance/reports",
      buttonText: "ดูรายงาน"
    },
    {
      title: "การชำระเงิน",
      description: "จัดการการชำระเงินและเคลียร์เงิน",
      href: "/finance/payments",
      buttonText: "จัดการการชำระเงิน"
    },
    {
      title: "ยอดขายรวม",
      description: "ดูยอดขายรวมของระบบ",
      href: "/finance/sales",
      buttonText: "ดูยอดขาย"
    }
  ]
};

export function DashboardCards({ userRole }: DashboardCardsProps) {
  const cards = cardConfigs[userRole] || [];

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">ไม่พบข้อมูลสำหรับบทบาทนี้</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">{card.title}</h3>
          <p className="text-muted-foreground mb-4">{card.description}</p>
          <Link href={card.href}>
            <Button>{card.buttonText}</Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}