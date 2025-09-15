'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  username: z.string()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร")
    .regex(/^[a-zA-Z0-9_]+$/, "ชื่อผู้ใช้ต้องเป็นตัวอักษร ตัวเลข และ _ เท่านั้น"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "รหัสผ่านต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "ชื่อเต็มต้องมีอย่างน้อย 2 ตัวอักษร"),
  phone: z.string().optional(),
  roleId: z.string().min(1, "กรุณาเลือกประเภทผู้ใช้"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, roleId, ...registerData } = data;
    const success = await registerUser({
      ...registerData,
      roleId: parseInt(roleId),
    });
    if (success) {
      router.push("/");
    } else {
      reset();
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
            <CardTitle className="text-2xl text-center">สมัครสมาชิก</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="กรอกอีเมล"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">ชื่อเต็ม</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="กรอกชื่อเต็ม"
                  {...register("fullName")}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์ (ไม่จำเป็น)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="กรอกเบอร์โทรศัพท์"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleId">ประเภทผู้ใช้</Label>
                <Select onValueChange={(value: string) => setValue("roleId", value)}>
                  <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
                    <SelectValue placeholder="เลือกประเภทผู้ใช้" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">ลูกค้า</SelectItem>
                    <SelectItem value="2">เจ้าของร้าน</SelectItem>
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-sm text-red-500">{errors.roleId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="ยืนยันรหัสผ่าน"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500 pr-12" : "pr-12"}
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
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                มีบัญชีอยู่แล้ว?{" "}
                <Link 
                  href="/auth/login" 
                  className="text-primary hover:underline font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}