'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Store,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  Image as ImageIcon,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Users
} from "lucide-react";

interface ShopProfile {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  category: string;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  coverImageUrl: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: string;
}

interface ShopSettings {
  autoAcceptOrders: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  marketingEmails: boolean;
  dataSharing: boolean;
}

export default function ShopProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const [profile, setProfile] = useState<ShopProfile>({
    id: 1,
    name: "ร้านอาหารไทยแท้",
    description: "ร้านอาหารไทยต้นตำรับ บรรยากาศดี รสชาติแท้ ราคาเป็นกันเอง มีอาหารไทยหลากหลายชนิด ทั้งต้ม แกง ผัด ยำ และขนมหวานไทย",
    address: "123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110",
    phone: "02-123-4567",
    email: "contact@thaifood.com",
    openTime: "08:00",
    closeTime: "21:00",
    isActive: true,
    category: "อาหารไทย",
    rating: 4.5,
    totalReviews: 324,
    imageUrl: "/shop-logo.jpg",
    coverImageUrl: "/shop-cover.jpg",
    deliveryFee: 25,
    minimumOrder: 100,
    estimatedDeliveryTime: "30-45 นาที"
  });

  const [settings, setSettings] = useState<ShopSettings>({
    autoAcceptOrders: true,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    marketingEmails: false,
    dataSharing: false
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

  const handleSettingChange = (key: keyof ShopSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <DashboardLayout title="ข้อมูลร้าน">
      <div className="space-y-6">
        {/* Shop Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.imageUrl} alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground">{profile.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={profile.isActive ? "default" : "secondary"}>
                        {profile.isActive ? "เปิดทำการ" : "ปิดทำการ"}
                      </Badge>
                      <Badge variant="outline">{profile.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{profile.rating}</span>
                      <span className="text-muted-foreground">({profile.totalReviews} รีวิว)</span>
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

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">ข้อมูลร้าน</TabsTrigger>
            <TabsTrigger value="business">ข้อมูลธุรกิจ</TabsTrigger>
            <TabsTrigger value="settings">การตั้งค่า</TabsTrigger>
            <TabsTrigger value="stats">สถิติ</TabsTrigger>
          </TabsList>

          {/* ข้อมูลร้าน */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  ข้อมูลพื้นฐาน
                </CardTitle>
                <CardDescription>
                  จัดการข้อมูลพื้นฐานของร้านค้า
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อร้าน</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, name: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">ประเภทอาหาร</Label>
                    <Select 
                      value={profile.category} 
                      onValueChange={(value) => setProfile(prev => ({...prev, category: value}))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="อาหารไทย">อาหารไทย</SelectItem>
                        <SelectItem value="อาหารจีน">อาหารจีน</SelectItem>
                        <SelectItem value="อาหารญี่ปุ่น">อาหารญี่ปุ่น</SelectItem>
                        <SelectItem value="อาหารเกาหลี">อาหารเกาหลี</SelectItem>
                        <SelectItem value="อาหารฝรั่ง">อาหารฝรั่ง</SelectItem>
                        <SelectItem value="อาหารอิตาลี">อาหารอิตาลี</SelectItem>
                        <SelectItem value="ขนมหวาน">ขนมหวาน</SelectItem>
                        <SelectItem value="เครื่องดื่ม">เครื่องดื่ม</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">คำอธิบายร้าน</Label>
                  <Textarea
                    id="description"
                    value={profile.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile(prev => ({...prev, description: e.target.value}))}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="บอกเล่าเกี่ยวกับร้านของคุณ..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่ร้าน</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile(prev => ({...prev, address: e.target.value}))}
                    disabled={!isEditing}
                    rows={2}
                    placeholder="ที่อยู่เต็มของร้าน"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, phone: e.target.value}))}
                      disabled={!isEditing}
                      placeholder="02-xxx-xxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, email: e.target.value}))}
                      disabled={!isEditing}
                      placeholder="shop@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ข้อมูลธุรกิจ */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  เวลาทำการ
                </CardTitle>
                <CardDescription>
                  กำหนดเวลาเปิด-ปิดร้าน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openTime">เวลาเปิด</Label>
                    <Input
                      id="openTime"
                      type="time"
                      value={profile.openTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, openTime: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="closeTime">เวลาปิด</Label>
                    <Input
                      id="closeTime"
                      type="time"
                      value={profile.closeTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, closeTime: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  ข้อมูลการส่ง
                </CardTitle>
                <CardDescription>
                  ตั้งค่าค่าส่งและเงื่อนไขการสั่งซื้อ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">ค่าส่ง (บาท)</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      value={profile.deliveryFee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, deliveryFee: Number(e.target.value)}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder">ยอดขั้นต่ำ (บาท)</Label>
                    <Input
                      id="minimumOrder"
                      type="number"
                      value={profile.minimumOrder}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, minimumOrder: Number(e.target.value)}))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDeliveryTime">เวลาจัดส่ง</Label>
                    <Input
                      id="estimatedDeliveryTime"
                      value={profile.estimatedDeliveryTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({...prev, estimatedDeliveryTime: e.target.value}))}
                      disabled={!isEditing}
                      placeholder="30-45 นาที"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* การตั้งค่า */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  การตั้งค่าทั่วไป
                </CardTitle>
                <CardDescription>
                  จัดการการตั้งค่าระบบและการแจ้งเตือน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>รับออเดอร์อัตโนมัติ</Label>
                      <p className="text-sm text-muted-foreground">
                        ยอมรับออเดอร์ใหม่โดยอัตโนมัติโดยไม่ต้องยืนยัน
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptOrders}
                      onCheckedChange={(checked) => handleSettingChange('autoAcceptOrders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>แจ้งเตือนออเดอร์ใหม่</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนเมื่อมีออเดอร์ใหม่เข้ามา
                      </p>
                    </div>
                    <Switch
                      checked={settings.orderNotifications}
                      onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>แจ้งเตือนทางอีเมล</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนสำคัญทางอีเมล
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>แจ้งเตือนทาง SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        รับการแจ้งเตือนทาง SMS สำหรับการแจ้งเตือนด่วน
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>อีเมลการตลาด</Label>
                      <p className="text-sm text-muted-foreground">
                        รับข้อมูลข่าวสารและโปรโมชั่นใหม่ๆ
                      </p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>การแชร์ข้อมูล</Label>
                      <p className="text-sm text-muted-foreground">
                        อนุญาตให้แชร์ข้อมูลสำหรับการวิเคราะห์และปรับปรุงบริการ
                      </p>
                    </div>
                    <Switch
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* สถิติ */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">คะแนนรีวิว</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.rating}</div>
                  <p className="text-xs text-muted-foreground">
                    จาก {profile.totalReviews} รีวิว
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ยอดขายวันนี้</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿12,500</div>
                  <p className="text-xs text-muted-foreground">
                    +20% จากเมื่อวาน
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ออเดอร์วันนี้</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">
                    +12% จากเมื่อวาน
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">สถานะร้าน</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">เปิด</div>
                  <p className="text-xs text-muted-foreground">
                    เปิดทำการ {profile.openTime} - {profile.closeTime}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลร้านค้า</CardTitle>
                <CardDescription>
                  ข้อมูลสรุปเกี่ยวกับร้านค้าของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ค่าส่ง:</span>
                    <span className="text-sm">฿{profile.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ยอดขั้นต่ำ:</span>
                    <span className="text-sm">฿{profile.minimumOrder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">เวลาจัดส่ง:</span>
                    <span className="text-sm">{profile.estimatedDeliveryTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ประเภทอาหาร:</span>
                    <Badge variant="outline">{profile.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}