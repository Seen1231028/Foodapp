'use client';

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-primary">ZeenZilla</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">สวัสดี, {user.fullName}</span>
              <span className="sm:hidden">สวัสดี</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
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