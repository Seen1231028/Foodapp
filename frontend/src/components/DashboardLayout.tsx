'use client';

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Store, 
  FileBarChart, 
  CreditCard, 
  ShoppingBag, 
  Heart, 
  BarChart3, 
  Package, 
  TrendingUp,
  Settings,
  User,
  Home
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const adminNavItems = [
  { href: "/admin/dashboard", label: "หน้าแรก", icon: Home },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: Users },
  { href: "/admin/shops", label: "จัดการร้านค้า", icon: Store },
  { href: "/admin/finance", label: "จัดการการเงิน", icon: CreditCard },
  { href: "/admin/reports", label: "รายงาน", icon: FileBarChart },
];

const shopNavItems = [
  { href: "/shop/dashboard", label: "หน้าแรก", icon: Home },
  { href: "/shop/menu", label: "จัดการเมนู", icon: Package },
  { href: "/shop/orders", label: "คำสั่งซื้อ", icon: ShoppingBag },
  { href: "/shop/reports", label: "รายงานยอดขาย", icon: BarChart3 },
  { href: "/shop/profile", label: "ข้อมูลร้าน", icon: Store },
];

const customerNavItems = [
  { href: "/customer/dashboard", label: "หน้าแรก", icon: Home },
  { href: "/customer/orders", label: "คำสั่งซื้อ", icon: ShoppingBag },
  { href: "/customer/favorites", label: "ร้านโปรด", icon: Heart },
  { href: "/customer/profile", label: "ข้อมูลส่วนตัว", icon: User },
];

const financeNavItems = [
  { href: "/finance/reports", label: "รายงานการเงิน", icon: FileBarChart },
  { href: "/finance/payments", label: "จัดการการชำระเงิน", icon: CreditCard },
  { href: "/finance/sales", label: "วิเคราะห์ยอดขาย", icon: TrendingUp },
];

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const getNavItems = () => {
    if (pathname.startsWith('/admin')) return adminNavItems;
    if (pathname.startsWith('/shop')) return shopNavItems;
    if (pathname.startsWith('/customer')) return customerNavItems;
    if (pathname.startsWith('/finance')) return financeNavItems;
    return [];
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    if (pathname.startsWith('/admin')) return <Badge variant="destructive">Admin</Badge>;
    if (pathname.startsWith('/shop')) return <Badge variant="default">Shop Owner</Badge>;
    if (pathname.startsWith('/customer')) return <Badge variant="secondary">Customer</Badge>;
    if (pathname.startsWith('/finance')) return <Badge variant="outline">Finance</Badge>;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Secondary Navigation */}
      {navItems.length > 0 && (
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                {getRoleBadge()}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {title && (
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {title}
              </h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}