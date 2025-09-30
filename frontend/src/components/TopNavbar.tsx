'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ShoppingCart, User, Moon, Sun } from 'lucide-react';
import authUtils from '@/utils/auth';
import LogoutButton from '@/components/LogoutButton';

interface TopNavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  userRole?: string;
}

export function TopNavbar({ cartItemCount = 0, onCartClick, userRole = 'customer' }: TopNavbarProps) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary cursor-pointer">ZeenZilla</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
              <Moon className="w-4 h-4" />
            </div>

            {/* User Info & Role Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">สวัสดี, {currentUser.username}</span>
                <Badge variant="outline">{currentUser.role?.name || userRole}</Badge>
              </div>
            ) : (
              <Badge variant="outline">{userRole}</Badge>
            )}
            
            {/* Cart Button (only for customers) */}
            {(currentUser?.role?.name === 'customer' || userRole === 'customer') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCartClick}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ตะกร้า ({cartItemCount})
              </Button>
            )}
            
            {/* Profile Link (only if logged in) */}
            {currentUser && (
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  โปรไฟล์
                </Button>
              </Link>
            )}
            
            {/* Auth Buttons */}
            {currentUser ? (
              <LogoutButton variant="ghost" size="sm" />
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}