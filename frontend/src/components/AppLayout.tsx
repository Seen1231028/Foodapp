'use client';

import React from 'react';
import { TopNavbar } from '@/components/TopNavbar';
import { Sidebar } from '@/components/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  cartItemCount?: number;
  onCartClick?: () => void;
  userRole?: string;
}

export function AppLayout({ children, cartItemCount = 0, onCartClick, userRole = 'customer' }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar 
        cartItemCount={cartItemCount} 
        onCartClick={onCartClick}
        userRole={userRole}
      />
      <Sidebar userRole={userRole} />
      
      <div className="ml-64 pt-16 p-6">
        {children}
      </div>
    </div>
  );
}