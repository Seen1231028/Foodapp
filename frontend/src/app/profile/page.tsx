'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Heart,
  Star,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail
} from "lucide-react";

interface CustomerProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profileImage: string;
  memberSince: string;
  totalOrders: number;
  favoriteCategories: string[];
}

interface DeliveryAddress {
  id: number;
  name: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'office' | 'other';
}

interface PaymentMethod {
  id: number;
  type: 'credit_card' | 'debit_card' | 'promptpay' | 'true_wallet';
  name: string;
  details: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const [profile, setProfile] = useState<CustomerProfile>({
    id: 1,
    username: "customer123",
    email: "customer@example.com",
    fullName: "สมศรี ใจดี",
    phone: "081-234-5678",
    dateOfBirth: "1990-05-15",
    gender: "female",
    profileImage: "/user-avatar.jpg",
    memberSince: "2023-01-15",
    totalOrders: 45,
    favoriteCategories: ["อาหารไทย", "ก๋วยเตี๋ยว", "ขนมหวาน"]
  });

  const [addresses, setAddresses] = useState<DeliveryAddress[]>([
    {
      id: 1,
      name: "บ้าน",
      address: "123/45 ถนนสุขุมวิท",
      district: "คลองตัน",
      province: "กรุงเทพมหานคร",
      postalCode: "10110",
      phone: "081-234-5678",
      isDefault: true,
      type: "home"
    },
    {
      id: 2,
      name: "ที่ทำงาน",
      address: "99/1 อาคารเอไอเอ ถนนพระราม 3",
      district: "บางโพ",
      province: "กรุงเทพมหานคร",
      postalCode: "10160",
      phone: "02-123-4567",
      isDefault: false,
      type: "office"
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "credit_card",
      name: "บัตรเครดิต KBank",
      details: "**** **** **** 1234",
      isDefault: true,
      expiryDate: "12/26"
    },
    {
      id: 2,
      type: "promptpay",
      name: "PromptPay",
      details: "081-234-5678",
      isDefault: false
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsNotifications: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // แสดง toast notification ว่าบันทึกสำเร็จ
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getAddressTypeIcon = (type: DeliveryAddress['type']) => {
    const icons = {
      home: "🏠",
      office: "🏢",
      other: "📍"
    };
    return icons[type];
  };

  const getPaymentTypeIcon = (type: PaymentMethod['type']) => {
    const icons = {
      credit_card: "💳",
      debit_card: "💳",
      promptpay: "📱",
      true_wallet: "💰"
    };
    return icons[type];
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <DashboardLayout title="โปรไฟล์">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profileImage} alt={profile.fullName} />
                  <AvatarFallback className="text-2xl">
                    {profile.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground">{profile.fullName}</h1>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">
                        สมาชิกตั้งแต่ {formatMemberSince(profile.memberSince)}
                      </Badge>
                      <Badge variant="secondary">
                        {profile.totalOrders} ออเดอร์
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "ยกเลิก" : "แก้ไขข้อมูล"}
                    </Button>
                    {isEditing && (
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">ข้อมูลส่วนตัว</TabsTrigger>
            <TabsTrigger value="addresses">ที่อยู่</TabsTrigger>
            <TabsTrigger value="payments">การชำระเงิน</TabsTrigger>
            <TabsTrigger value="settings">การตั้งค่า</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  ข้อมูลส่วนตัว
                </CardTitle>
                <CardDescription>
                  จัดการข้อมูลส่วนตัวของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, fullName: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">ชื่อผู้ใช้</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, username: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, email: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, phone: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">วันเกิด</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, dateOfBirth: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">เพศ</Label>
                    <Select 
                      value={profile.gender} 
                      onValueChange={(value) => setProfile(prev => ({...prev, gender: value}))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ชาย</SelectItem>
                        <SelectItem value="female">หญิง</SelectItem>
                        <SelectItem value="other">อื่นๆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>หมวดหมู่อาหารที่ชอบ</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.favoriteCategories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        <Heart className="h-3 w-3 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Addresses */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">ที่อยู่จัดส่ง</h2>
                <p className="text-sm text-muted-foreground">จัดการที่อยู่สำหรับการจัดส่ง</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                เพิ่มที่อยู่
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className={address.isDefault ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getAddressTypeIcon(address.type)}</span>
                        <div>
                          <h3 className="font-medium">{address.name}</h3>
                          {address.isDefault && (
                            <Badge variant="default" className="text-xs">ค่าเริ่มต้น</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p>{address.address}</p>
                      <p>{address.district} {address.province} {address.postalCode}</p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{address.phone}</span>
                      </div>
                    </div>
                    
                    {!address.isDefault && (
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        ตั้งเป็นค่าเริ่มต้น
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Methods */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">วิธีการชำระเงิน</h2>
                <p className="text-sm text-muted-foreground">จัดการวิธีการชำระเงินของคุณ</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                เพิ่มการชำระเงิน
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className={method.isDefault ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPaymentTypeIcon(method.type)}</span>
                        <div>
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                          {method.expiryDate && (
                            <p className="text-xs text-muted-foreground">หมดอายุ {method.expiryDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {method.isDefault && (
                      <Badge variant="default" className="text-xs">ค่าเริ่มต้น</Badge>
                    )}
                    
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        ตั้งเป็นค่าเริ่มต้น
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  การแจ้งเตือน
                </CardTitle>
                <CardDescription>
                  จัดการการแจ้งเตือนที่คุณต้องการรับ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>อัปเดตสถานะออเดอร์</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนเมื่อสถานะออเดอร์เปลี่ยนแปลง
                      </p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>โปรโมชั่นและข้อเสนอพิเศษ</Label>
                      <p className="text-sm text-muted-foreground">
                        รับข้อมูลโปรโมชั่นและส่วนลดจากร้านอาหาร
                      </p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>จดหมายข่าว</Label>
                      <p className="text-sm text-muted-foreground">
                        รับข้อมูลข่าวสารและอัปเดตใหม่ๆ
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>การแจ้งเตือนทาง SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนสำคัญทาง SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>การแจ้งเตือนทางอีเมล</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนทางอีเมล
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>การแจ้งเตือนแบบ Push</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนผ่านแอป
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  ความปลอดภัย
                </CardTitle>
                <CardDescription>
                  จัดการการตั้งค่าความปลอดภัยของบัญชี
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  เปลี่ยนรหัสผ่าน
                </Button>
                <Button variant="outline" className="w-full">
                  ตั้งค่าการยืนยันตัวตนสองขั้นตอน
                </Button>
                <Button variant="outline" className="w-full">
                  ดูอุปกรณ์ที่เข้าสู่ระบบ
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">เขตอันตราย</CardTitle>
                <CardDescription>
                  การดำเนินการเหล่านี้ไม่สามารถย้อนกลับได้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">
                  ลบบัญชี
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}