'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { User, LogOut, Sun, Moon } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-primary dark:text-primary">ZeenZilla</h1>
            </Link>
            <nav className="ml-8 hidden md:flex items-center space-x-4">
              <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Demo Dashboards
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">สวัสดี, {user.fullName}</span>
              <span className="sm:hidden">สวัสดี</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                {user.role.name === 'admin' && 'ผู้ดูแลระบบ'}
                {user.role.name === 'shop_owner' && 'เจ้าของร้าน'}
                {user.role.name === 'customer' && 'ลูกค้า'}
                {user.role.name === 'finance' && 'ฝ่ายการเงิน'}
              </span>
              
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}