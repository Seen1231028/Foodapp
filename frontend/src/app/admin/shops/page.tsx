'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, Eye, Edit, Users, DollarSign, Package, Phone, Mail, Calendar, User, MapPin, Trash2, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import authUtils from '@/utils/auth';
import '@/utils/cleanup'; // Auto-cleanup localStorage

interface ShopOwner {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  role?: {
    name: string;
  };
  // Mock shop statistics
  menuCount?: number;
  totalRevenue?: number;
  totalOrders?: number;
}

// Shop Details Modal Component
function ViewShopModal({ shop }: { shop: ShopOwner }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="ดูรายละเอียดร้านค้า">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            รายละเอียดร้านค้า
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              ข้อมูลเจ้าของร้าน
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ชื่อ-นามสกุล</label>
                <p className="font-medium">{shop.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ชื่อผู้ใช้</label>
                <p className="font-medium">@{shop.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">อีเมล</label>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {shop.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">เบอร์โทรศัพท์</label>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {shop.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">สถานะ</label>
                <div className="mt-1">
                  {shop.isActive ? (
                    <Badge className="bg-green-100 text-green-800">ใช้งานอยู่</Badge>
                  ) : (
                    <Badge variant="secondary">ไม่ใช้งาน</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">วันที่สมัครสมาชิก</label>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(shop.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Shop Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Store className="w-4 h-4" />
              สถิติร้านค้า
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{shop.menuCount || 0}</div>
                  <div className="text-sm text-muted-foreground">เมนูอาหาร</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">฿{(shop.totalRevenue || 0).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">รายได้รวม</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">{shop.totalOrders || 0}</div>
                  <div className="text-sm text-muted-foreground">ออเดอร์ทั้งหมด</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              แก้ไขข้อมูล
            </Button>
            <Button variant="outline" className="flex-1">
              <Package className="w-4 h-4 mr-2" />
              จัดการเมนู
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Edit Shop Modal Component
function EditShopModal({ shop, onUpdate }: { shop: ShopOwner; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: shop.fullName,
    email: shop.email,
    phone: shop.phone,
    username: shop.username,
    isActive: shop.isActive
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/users/${shop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOpen(false);
        onUpdate(); // Refresh the shop list
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="แก้ไขข้อมูลร้านค้า">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            แก้ไขข้อมูลร้านค้า
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="username">ชื่อผู้ใช้</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="isActive">เปิดใช้งานร้านค้า</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Menu Management Modal Component
function MenuManagementModal({ shop }: { shop: ShopOwner }) {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock menu data for demonstration
  const mockMenus = [
    { id: 1, name: 'ผัดไทย', price: 50, category: 'อาหารจานเดียว', status: 'available' },
    { id: 2, name: 'ส้มตำ', price: 30, category: 'อาหารอีสาน', status: 'available' },
    { id: 3, name: 'แกงเขียวหวาน', price: 60, category: 'แกง', status: 'out_of_stock' },
    { id: 4, name: 'ข้าวผัด', price: 45, category: 'อาหารจานเดียว', status: 'available' },
  ];

  useEffect(() => {
    // In real app, fetch menus for this shop
    setMenus(mockMenus.slice(0, shop.menuCount || 4));
  }, [shop.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="จัดการเมนูอาหาร">
          <Package className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            จัดการเมนูอาหาร - {shop.fullName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add Menu Button */}
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">เมนูอาหารทั้งหมด ({menus.length} รายการ)</p>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มเมนูใหม่
            </Button>
          </div>

          {/* Menu List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menus.map((menu) => (
              <Card key={menu.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{menu.name}</h4>
                      <p className="text-sm text-muted-foreground">{menu.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">฿{menu.price}</p>
                      {menu.status === 'available' ? (
                        <Badge className="bg-green-100 text-green-800">พร้อมขาย</Badge>
                      ) : (
                        <Badge variant="secondary">หมด</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      แก้ไข
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`flex-1 ${menu.status === 'available' ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {menu.status === 'available' ? 'ปิดขาย' : 'เปิดขาย'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {menus.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">ยังไม่มีเมนูอาหาร</p>
              <Button className="mt-4" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มเมนูแรก
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add New Shop Modal Component
function AddNewShopModal({ onUpdate }: { onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({
          ...formData,
          role: 'shop_owner',
          isActive: true
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOpen(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        onUpdate(); // Refresh the shop list
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" title="เพิ่มร้านค้าใหม่เข้าสู่ระบบ">
          <Plus className="w-4 h-4" />
          เพิ่มร้านค้าใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            เพิ่มร้านค้าใหม่
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">ชื่อ-นามสกุลเจ้าของร้าน</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="username">ชื่อผู้ใช้</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'กำลังสร้าง...' : 'สร้างบัญชี'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const origin = API.endsWith('/api') ? API.slice(0,-4) : API;

function imgUrl(rel?: string|null) { if (!rel) return ''; return rel.startsWith('/uploads') ? origin + rel : rel; }

export default function AdminShops() {
  const [shopOwners, setShopOwners] = useState<ShopOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<number|null>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : '';

  const toggleShopStatus = async (shopId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${shopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        fetchShopOwners(); // Refresh the list
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const deleteShop = async (shopId: number, shopName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบร้านค้า "${shopName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/users/${shopId}`, {
        method: 'DELETE',
        headers: authUtils.getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        fetchShopOwners(); // Refresh the list
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการลบร้านค้า');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const fetchShopOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authUtils.isAuthenticated()) {
        setError('กรุณาเข้าสู่ระบบใหม่');
        authUtils.clearAuth();
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch('http://localhost:4000/api/users', {
        headers: authUtils.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Filter only shop owners
        const shops = data.data.users.filter((user: any) => user.role?.name === 'shop_owner');
        
        // Add mock shop statistics
        const shopsWithStats = shops.map((shop: any) => ({
          ...shop,
          menuCount: Math.floor(Math.random() * 20) + 5,
          totalRevenue: Math.floor(Math.random() * 50000) + 10000,
          totalOrders: Math.floor(Math.random() * 100) + 20
        }));
        
        setShopOwners(shopsWithStats);
      } else {
        const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
        if (response.status === 401) {
          setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชี Admin');
          authUtils.clearAuth();
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else if (response.status === 403) {
          setError('คุณไม่มีสิทธิ์ในการจัดการร้านค้า');
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Shop owners fetch error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      } else {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Validate authentication with admin requirement
    if (!authUtils.validateAuth(true)) {
      return; // validateAuth will handle redirection
    }

    fetchShopOwners();
  }, []);

  useEffect(() => { 
    if (selectedShop) {
      fetchShopDetail(selectedShop);
    }
  }, [selectedShop]);

  const fetchShopDetail = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/shops/${id}`);
      const json = await res.json();
      if (json.success) {
        setMenus(json.data.menus);
        setSelectedShop(id);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleShopImage = async (file: File) => {
    if (!selectedShop) return;
    const b64 = await fileToBase64(file);
    setUploading(true);
    try {
      const res = await fetch(`${API}/shops/${selectedShop}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ image: b64 })
      });
      const json = await res.json();
      if (json.success) {
        setShopOwners(prev => prev.map(s => s.id === selectedShop ? { ...s, image: json.data.image } : s));
      }
    } finally { setUploading(false); }
  };

  const handleMenuImage = async (menuId: number, file: File) => {
    const b64 = await fileToBase64(file);
    setUploading(true);
    try {
      const res = await fetch(`${API}/menus/${menuId}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ image: b64 })
      });
      const json = await res.json();
      if (json.success) {
        setMenus(prev => prev.map(m => m.id === menuId ? { ...m, image: json.data.image } : m));
      }
    } finally { setUploading(false); }
  };

  if (loading) {
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Shop Management</h1>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Shop Management</h1>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-500 mb-4">เกิดข้อผิดพลาด: {error}</p>
                <Button onClick={fetchShopOwners}>
                  ลองใหม่อีกครั้ง
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shop Management</h1>
            <p className="text-muted-foreground">
              จัดการร้านค้าและเจ้าของร้านในระบบ ({shopOwners.length} ร้าน)
            </p>
          </div>
          <AddNewShopModal onUpdate={fetchShopOwners} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card title="จำนวนร้านค้าทั้งหมดในระบบ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ร้านค้าทั้งหมด</CardTitle>
              <Store className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopOwners.length}</div>
            </CardContent>
          </Card>
          
          <Card title="จำนวนร้านค้าที่เปิดให้บริการอยู่">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ร้านที่ใช้งานอยู่</CardTitle>
              <Store className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shopOwners.filter(s => s.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card title="รายได้รวมของร้านค้าทั้งหมด">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ฿{shopOwners.reduce((sum, shop) => sum + (shop.totalRevenue || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card title="จำนวนเมนูอาหารทั้งหมดในระบบ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เมนูทั้งหมด</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shopOwners.reduce((sum, shop) => sum + (shop.menuCount || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shops List */}
        <Card>
          <CardHeader>
            <CardTitle>รายการร้านค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shopOwners.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Store className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{shop.fullName}</h3>
                        {shop.isActive ? (
                          <Badge className="bg-green-100 text-green-800">ใช้งานอยู่</Badge>
                        ) : (
                          <Badge variant="secondary">ไม่ใช้งาน</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{shop.email}</p>
                      <p className="text-sm text-muted-foreground">
                        @{shop.username} • {shop.phone}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="w-3 h-3" />
                          {shop.menuCount} เมนู
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          ฿{shop.totalRevenue?.toLocaleString()} รายได้
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {shop.totalOrders} ออเดอร์
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        สร้างเมื่อ: {new Date(shop.createdAt).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ViewShopModal shop={shop} />
                    <EditShopModal shop={shop} onUpdate={fetchShopOwners} />
                    <MenuManagementModal shop={shop} />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleShopStatus(shop.id, shop.isActive)}
                      title={shop.isActive ? "ปิดใช้งานร้านค้า" : "เปิดใช้งานร้านค้า"}
                      className={shop.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteShop(shop.id, shop.fullName)}
                      title="ลบร้านค้า"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {shopOwners.length === 0 && (
                <div className="text-center py-8">
                  <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">ยังไม่มีร้านค้าในระบบ</p>
                  <Button className="mt-4" size="sm" title="เพิ่มร้านค้าแรกของคุณ">
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มร้านค้าแรก
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
