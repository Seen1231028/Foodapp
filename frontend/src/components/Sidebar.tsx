'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home as HomeIcon,
  Users,
  Store,
  FileBarChart,
  CreditCard,
  Package,
  BarChart3,
  User,
  ShoppingCart,
  Heart,
  TrendingUp
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface SidebarProps {
  userRole: string;
}

const sidebarItems = {
  admin: [
    { id: 'dashboard', label: 'หน้าแรก', icon: HomeIcon, href: '/admin/dashboard' },
    { id: 'users', label: 'จัดการผู้ใช้', icon: Users, href: '/admin/users' },
    { id: 'shops', label: 'จัดการร้านค้า', icon: Store, href: '/admin/shops' },
    { id: 'finance', label: 'จัดการการเงิน', icon: CreditCard, href: '/admin/finance' },
    { id: 'reports', label: 'รายงาน', icon: FileBarChart, href: '/admin/reports' },
  ],
  shop_owner: [
    { id: 'dashboard', label: 'หน้าแรก', icon: HomeIcon, href: '/shop/dashboard' },
    { id: 'menu', label: 'จัดการเมนู', icon: Package, href: '/shop/menu' },
    { id: 'orders', label: 'คำสั่งซื้อ', icon: ShoppingCart, href: '/shop/orders' },
    { id: 'reports', label: 'รายงานยอดขาย', icon: BarChart3, href: '/shop/reports' },
    { id: 'profile', label: 'ข้อมูลร้าน', icon: Store, href: '/shop/profile' },
  ],
  customer: [
    { id: 'menu', label: 'เมนูอาหาร', icon: Package, href: '/' },
    { id: 'orders', label: 'คำสั่งซื้อของฉัน', icon: ShoppingCart, href: '/orders' },
    { id: 'favorites', label: 'ร้านโปรด', icon: Heart, href: '/favorites' },
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: User, href: '/profile' },
  ],
  finance: [
    { id: 'reports', label: 'รายงานการเงิน', icon: FileBarChart, href: '/finance/reports' },
    { id: 'payments', label: 'จัดการการชำระเงิน', icon: CreditCard, href: '/finance/payments' },
    { id: 'sales', label: 'วิเคราะห์ยอดขาย', icon: TrendingUp, href: '/finance/sales' },
  ]
};

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const currentSidebarItems = sidebarItems[userRole as keyof typeof sidebarItems] || [];

  return (
    <div className="fixed left-0 top-16 w-64 bg-card border-r h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">เมนูหลัก</h2>
        <nav className="space-y-2">
          {currentSidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href || 
                           (item.href === '/' && pathname === '/') ||
                           (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}