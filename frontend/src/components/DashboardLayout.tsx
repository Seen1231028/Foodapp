'use client';

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}