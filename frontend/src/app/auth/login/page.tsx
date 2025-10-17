'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import authUtils from '@/utils/auth';
import '@/utils/cleanup'; // Auto-cleanup localStorage

const loginSchema = z.object({
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting login data:', data);
      
      // Call real API
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);
      
      let result;
      try {
        const text = await response.text();
        console.log('Raw response:', text);
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        result = {};
      }
      
      console.log('Login response data:', result);

      if (response.ok && result.success) {
        console.log('Login successful, saving auth data...');
        
        // Save auth data using authUtils (indirect via localStorage)
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        console.log('Auth data saved, redirecting...');
        
        // Redirect based on role
        if (result.data.user.role.name === 'admin') {
          console.log('Redirecting to admin panel...');
          router.push('/admin/users');
        } else {
          console.log('Redirecting to home...');
          router.push('/');
        }
      } else {
        console.error('Login failed:', result);
        setError(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">FoodFlow</h1>
          <p className="text-muted-foreground">ระบบสั่งอาหารออนไลน์</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Demo credentials info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600 font-medium mb-2">บัญชีทดสอบ:</p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• Admin: username = "admin", password = "admin123"</div>
                <div>• shopowner: username = "shopowner", password = "shop123"</div>
                <div>• customer: username = "customer", password = "customer123"</div>
                <div>• finance: username = "finance", password = "finance123"</div>
                <div>• User: สามารถสมัครสมาชิกใหม่ได้</div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  {...register("username")}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-xs text-orange-600 hover:text-orange-800 hover:underline font-medium"
                  ><Label>ลืมรหัสผ่าน?</Label>

                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่าน"
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-12" : "pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                ยังไม่มีบัญชี?{" "}
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:underline font-medium"
                >
                  สมัครสมาชิก
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}