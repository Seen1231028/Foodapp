'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ShoppingCart, User, Moon, Sun, Menu } from 'lucide-react';
import authUtils from '@/utils/auth';
import LogoutButton from '@/components/LogoutButton';
import { useCart } from '@/contexts/CartContext';

interface TopNavbarProps {
  onCartClick?: () => void;
  userRole?: string;
  onMenuClick?: () => void;
}

export function TopNavbar({ onCartClick, userRole = 'customer', onMenuClick }: TopNavbarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if dark mode is enabled from localStorage
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Get current user info
    setCurrentUser(authUtils.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authUtils.clearAuth();
    router.push('/auth/login');
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Menu Button - เฉพาะบนมือถือ */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            
            <Link href="/">
              <h1 className="text-lg sm:text-xl font-bold cursor-pointer bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent">
                FoodFlow
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden xs:block" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                className="scale-75 sm:scale-100"
              />
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden xs:block" />
            </div>

            {/* User Info & Role Badge */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
                  สวัสดี, {currentUser.username}
                </span>
                <Badge variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5">
                  {currentUser.role?.name || userRole}
                </Badge>
              </div>
            ) : (
              <Badge variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5 hidden sm:inline-flex">
                {userRole}
              </Badge>
            )}

            {/* Profile Link (only if logged in) */}
            {currentUser && (
              <Link href="/profile" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden md:inline">โปรไฟล์</span>
                </Button>
              </Link>
            )}
            
            {/* Auth Buttons */}
            {currentUser ? (
              <LogoutButton variant="ghost" size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm" />
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm">
                  <span className="hidden xs:inline">เข้าสู่ระบบ</span>
                  <User className="w-4 h-4 xs:hidden" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}