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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiService } from "@/lib/api";
import { toast } from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "รหัสผ่านต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const emailForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onEmailSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      await apiService.forgotPassword(data);
      setEmail(data.email);
      setStep('reset');
      toast.success('อีเมลถูกต้อง กรุณาตั้งรหัสผ่านใหม่');
    } catch (error: any) {
      const message = error.response?.data?.error || 'ไม่พบอีเมลในระบบ';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      await apiService.resetPassword({
        email,
        newPassword: data.newPassword,
      });
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ZeenZilla</h1>
          <p className="text-gray-600">ระบบสั่งอาหารออนไลน์</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 'email' ? 'ลืมรหัสผ่าน' : 'ตั้งรหัสผ่านใหม่'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    {...emailForm.register("email")}
                    className={emailForm.formState.errors.email ? "border-red-500" : ""}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังตรวจสอบ..." : "ตรวจสอบอีเมล"}
                </Button>
              </form>
            ) : (
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>อีเมล</Label>
                  <Input value={email} disabled className="bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="กรอกรหัสผ่านใหม่"
                      {...resetForm.register("newPassword")}
                      className={resetForm.formState.errors.newPassword ? "border-red-500 pr-12" : "pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{resetForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="ยืนยันรหัสผ่านใหม่"
                      {...resetForm.register("confirmPassword")}
                      className={resetForm.formState.errors.confirmPassword ? "border-red-500 pr-12" : "pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link 
                href="/auth/login" 
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}