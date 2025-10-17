'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, User, Save, X } from 'lucide-react';
import authUtils from '@/utils/auth';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  profileImage?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authUtils.isAuthenticated()) {
          setError('กรุณาเข้าสู่ระบบใหม่');
          authUtils.clearAuth();
          window.location.href = '/auth/login';
          return;
        }

        const response = await fetch('http://localhost:4000/api/users/profile', {
          headers: authUtils.getAuthHeaders()
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบใหม่');
            authUtils.clearAuth();
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 2000);
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
          setEditForm({
            fullName: result.data.fullName,
            phone: result.data.phone || '',
            profileImage: result.data.profileImage || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          throw new Error(result.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์');
        }

      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
          setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!editForm.fullName.trim()) {
        setError('กรุณากรอกชื่อ-นามสกุล');
        return;
      }

      if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
        setError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
        return;
      }

      if (editForm.newPassword && editForm.newPassword.length < 6) {
        setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
      }

      const updateData: any = {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        profileImage: editForm.profileImage.trim()
      };

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      const response = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          ...authUtils.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (result.success) {
        setProfile(result.data);
        setEditing(false);
        setEditForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        alert('อัปเดตโปรไฟล์สำเร็จ');
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setError(null);
    if (profile) {
      setEditForm({
        fullName: profile.fullName,
        phone: profile.phone || '',
        profileImage: profile.profileImage || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'shop_owner': return 'bg-blue-100 text-blue-800';
      case 'finance': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'shop_owner': return 'เจ้าของร้าน';
      case 'finance': return 'ฝ่ายการเงิน';
      case 'customer': return 'ลูกค้า';
      default: return role;
    }
  };

  if (loading) {
    return (
      <AppLayout userRole={authUtils.getCurrentUser()?.role?.name || 'guest'}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">โปรไฟล์ของฉัน</h1>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole={authUtils.getCurrentUser()?.role?.name || 'guest'}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">โปรไฟล์ของฉัน</h1>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout userRole={authUtils.getCurrentUser()?.role?.name || 'guest'}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">โปรไฟล์ของฉัน</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">ไม่พบข้อมูลโปรไฟล์</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole={authUtils.getCurrentUser()?.role?.name || 'guest'}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <User className="w-4 h-4 mr-2" />
              แก้ไขโปรไฟล์
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>ข้อมูลส่วนตัว</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={editing ? editForm.profileImage : profile.profileImage} />
                  <AvatarFallback className="text-lg">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">URL รูปโปรไฟล์</Label>
                    <Input
                      id="profileImage"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={editForm.profileImage}
                      onChange={(e) => setEditForm(prev => ({ ...prev, profileImage: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                  {editing ? (
                    <Input
                      id="fullName"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{profile.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">ชื่อผู้ใช้</Label>
                  <p className="p-2 bg-gray-100 rounded text-muted-foreground">{profile.username}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <p className="p-2 bg-gray-100 rounded text-muted-foreground">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  {editing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{profile.phone || 'ไม่ได้ระบุ'}</p>
                  )}
                </div>
              </div>

              {/* Password Change (only when editing) */}
              {editing && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">เปลี่ยนรหัสผ่าน (ไม่บังคับ)</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={editForm.currentPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={editForm.newPassword}
                          onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {editing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    ยกเลิก
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </Button>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลบัญชี</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>สถานะบัญชี</Label>
                <Badge className={profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {profile.isActive ? 'ใช้งานอยู่' : 'ถูกระงับ'}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>บทบาท</Label>
                <Badge className={getRoleBadgeColor(profile.role.name)}>
                  {getRoleName(profile.role.name)}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>เข้าสู่ระบบล่าสุด</Label>
                <p className="text-sm text-muted-foreground">
                  {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('th-TH') : 'ไม่เคยเข้าสู่ระบบ'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>สมัครสมาชิกเมื่อ</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.createdAt).toLocaleString('th-TH')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
