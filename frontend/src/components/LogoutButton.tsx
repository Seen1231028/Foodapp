// Logout utility component
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import authUtils from '@/utils/auth';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

export function LogoutButton({ className, variant = 'outline', size = 'default' }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    authUtils.clearAuth();
    router.push('/auth/login');
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant={variant} 
      size={size} 
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      ออกจากระบบ
    </Button>
  );
}

export default LogoutButton;