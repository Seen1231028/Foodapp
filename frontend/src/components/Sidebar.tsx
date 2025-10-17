'use client';

import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  LayoutDashboard,
  Menu,
  X,
  Activity
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface SidebarProps {
  userRole: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarItems = {
  admin: [
    { id: 'home', label: 'หน้าแรก', icon: HomeIcon, href: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'users', label: 'จัดการผู้ใช้', icon: Users, href: '/admin/users' },
    { id: 'shops', label: 'จัดการร้านค้า', icon: Store, href: '/admin/shops' },
    { id: 'finance', label: 'จัดการการเงิน', icon: CreditCard, href: '/admin/finance' },
    { id: 'reports', label: 'รายงาน', icon: FileBarChart, href: '/admin/reports' },
    { id: 'logs', label: 'Activity Logs', icon: Activity, href: '/admin/logs' },
  ],
  shop_owner: [
    { id: 'home', label: 'หน้าแรก', icon: HomeIcon, href: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/shop/dashboard' },
    { id: 'menu', label: 'จัดการเมนู', icon: Package, href: '/shop/menu' },
    { id: 'orders', label: 'คำสั่งซื้อ', icon: ShoppingCart, href: '/shop/orders' },
    { id: 'reports', label: 'รายงานยอดขาย', icon: BarChart3, href: '/shop/reports' },
    { id: 'profile', label: 'ข้อมูลร้าน', icon: Store, href: '/shop/profile' },
  ],
  customer: [
    { id: 'menu', label: 'เมนูอาหาร', icon: Package, href: '/' },
    { id: 'orders', label: 'คำสั่งซื้อของฉัน', icon: ShoppingCart, href: '/customer/orders' },
    { id: 'favorites', label: 'ร้านโปรด', icon: Heart, href: '/customer/favorites' },
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: User, href: '/profile' },
  ],
  finance: [
    { id: 'reports', label: 'รายงานการเงิน', icon: FileBarChart, href: '/finance/reports' },
    { id: 'payments', label: 'จัดการการชำระเงิน', icon: CreditCard, href: '/finance/payments' },
    { id: 'sales', label: 'วิเคราะห์ยอดขาย', icon: TrendingUp, href: '/finance/sales' },
  ]
};

export function Sidebar({ userRole, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentSidebarItems = sidebarItems[userRole as keyof typeof sidebarItems] || [];

  // Sync external isOpen prop with internal state
  useEffect(() => {
    setIsMobileMenuOpen(isOpen);
  }, [isOpen]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (!newState && onClose) {
      onClose();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Menu Button - แสดงเฉพาะบนมือถือเมื่อปิดเมนู */}
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed left-4 top-20 z-50 p-2 rounded-lg bg-card border shadow-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay สำหรับมือถือ */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] top-16"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-16 w-64 bg-card border-r h-[calc(100vh-4rem)] overflow-y-auto z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-3 sm:p-4">
          {/* Close button ภายใน Sidebar สำหรับมือถือ */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold px-1">เมนูหลัก</h2>
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-1 sm:space-y-2">
            {currentSidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href || 
                             (item.href === '/' && pathname === '/') ||
                             (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}