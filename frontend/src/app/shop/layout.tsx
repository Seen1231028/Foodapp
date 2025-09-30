'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MenuIcon,
  ShoppingCart,
  User,
  BarChart3,
  LogOut,
  Store,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import authUtils from '@/utils/auth';

const generalNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
];

const shopNavigation = [
  {
    name: "Dashboard",
    href: "/shop/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Menu Management",
    href: "/shop/menu",
    icon: MenuIcon,
  },
  {
    name: "Orders",
    href: "/shop/orders",
    icon: ShoppingCart,
  },
  {
    name: "Profile",
    href: "/shop/profile",
    icon: User,
  },
  {
    name: "Reports",
    href: "/shop/reports",
    icon: BarChart3,
  },
];

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and has shop_owner role
    const currentUser = authUtils.getCurrentUser();
    const token = authUtils.getToken();

    if (!token || !currentUser) {
      router.push('/auth/login');
      return;
    }

    // Check if user is shop owner
    if (currentUser.role.name !== 'shop_owner' && currentUser.role.name !== 'admin') {
      router.push('/auth/login');
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    authUtils.clearAuth();
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <Store className="h-8 w-8 text-orange-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">Shop Panel</span>
        </div>
        
        <nav className="mt-8 px-4">
          {/* General Navigation */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              General
            </h3>
            <ul className="space-y-2">
              {generalNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Shop Management */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Shop Management
            </h3>
            <ul className="space-y-2">
              {shopNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
              <p className="text-xs text-gray-500">{user?.role?.description}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}