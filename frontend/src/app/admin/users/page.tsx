'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Edit, Trash2, UserX, UserCheck, Search } from 'lucide-react';
import { authUtils } from '@/utils/auth';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: {
    id: number;
    name: string;
    description: string;
  };
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  roleId: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    roleId: 1 // Default to first role (admin)
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authUtils.isAuthenticated()) {
        setError('กรุณาเข้าสู่ระบบใหม่');
        authUtils.clearAuth();
        window.location.href = '/auth/login';
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter })
      });

      const response = await fetch(`http://localhost:4000/api/users?${queryParams}`, {
        headers: authUtils.getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
        if (response.status === 401) {
          setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชี Admin');
          authUtils.clearAuth();
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else if (response.status === 403) {
          setError('คุณไม่มีสิทธิ์ในการจัดการผู้ใช้');
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Users fetch error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      } else {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      if (!authUtils.isAuthenticated()) {
        return;
      }

      const response = await fetch('http://localhost:4000/api/users/roles/list', {
        headers: authUtils.getAuthHeaders()
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setRoles(data.data);
      } else {
        console.error('Failed to fetch roles:', data.error);
        // Don't show error for roles fetch failure, just use empty roles
      }
    } catch (err) {
      console.error('Roles fetch error:', err);
      // Don't show error for roles fetch failure, just use empty roles
    }
  };

  useEffect(() => {
    // Validate authentication with admin requirement
    if (!authUtils.validateAuth(true)) {
      return; // validateAuth will handle redirection
    }

    // Fetch data if authenticated
    fetchUsers();
    fetchRoles();
  }, [page, searchTerm, roleFilter]);

  const handleCreateUser = async () => {
    try {
      setIsSubmitting(true);
      
      if (!authUtils.isAuthenticated()) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: authUtils.getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          fullName: '',
          phone: '',
          roleId: 1
        });
        fetchUsers();
        alert('เพิ่มผู้ใช้สำเร็จ');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Create user error:', err);
      alert('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      
      if (!authUtils.isAuthenticated()) {
        throw new Error('No authentication token found');
      }

      // Don't send password if it's empty
      const updateData = { ...formData };
      if (!updateData.password) {
        delete (updateData as any).password;
      }

      const response = await fetch(`http://localhost:4000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: authUtils.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
        alert('อัปเดตข้อมูลผู้ใช้สำเร็จ');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Update user error:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      if (!authUtils.isAuthenticated()) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:4000/api/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: authUtils.getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Toggle user status error:', err);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะผู้ใช้');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      
      if (!authUtils.isAuthenticated()) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:4000/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: authUtils.getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        setShowDeleteDialog(false);
        setSelectedUser(null);
        fetchUsers();
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      roleId: 1
    });
    setShowCreateModal(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't populate password for security
      fullName: user.fullName,
      phone: user.phone || '',
      roleId: user.role.id
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'shop_owner':
        return 'bg-blue-100 text-blue-800';
      case 'finance':
        return 'bg-green-100 text-green-800';
      case 'customer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'shop_owner':
        return 'เจ้าของร้าน';
      case 'finance':
        return 'ฝ่ายการเงิน';
      case 'customer':
        return 'ลูกค้า';
      default:
        return roleName;
    }
  };

  if (loading) {
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">User Management</h1>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
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
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    return (
      <AppLayout userRole="admin">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">User Management</h1>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-500 mb-4 font-medium">เกิดข้อผิดพลาด: {error}</p>
                
                {!token && user && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-yellow-800 mb-2">🔑 ปัญหา: Token หายไป</h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      ระบบพบข้อมูลผู้ใช้แต่ไม่มี authentication token<br/>
                      กำลังนำคุณไปหน้าเข้าสู่ระบบใหม่...
                    </p>
                    <div className="text-xs text-yellow-600">
                      กำลังรีไดเรกต์ในอีก 2 วินาที...
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-600 mb-4 text-left">
                  <h4 className="font-medium mb-2">ตรวจสอบการเข้าสู่ระบบ:</h4>
                  <ul className="space-y-1">
                    <li>• คุณได้เข้าสู่ระบบแล้วหรือไม่?</li>
                    <li>• คุณใช้บัญชี Admin หรือไม่?</li>
                    <li>• Token: <span className="font-mono text-xs">{token ? 'มี' : 'ไม่มี'}</span></li>
                    <li>• User: <span className="font-mono text-xs">{user || 'ไม่มี'}</span></li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 วิธีแก้ไข:</h4>
                  <ol className="text-blue-700 text-sm text-left space-y-1">
                    <li>1. ไปที่หน้า Login</li>
                    <li>2. ใช้บัญชี Admin:</li>
                    <div className="ml-4 mt-1 bg-blue-100 p-2 rounded font-mono text-xs">
                      Username: admin<br/>
                      Password: admin123
                    </div>
                    <li>3. เข้าสู่ระบบ และกลับมาหน้านี้</li>
                  </ol>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => window.location.href = '/auth/login'} className="bg-blue-600 hover:bg-blue-700">
                    เข้าสู่ระบบ
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    ลองใหม่อีกครั้ง
                  </Button>
                </div>
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
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">
              จัดการผู้ใช้งานในระบบทั้งหมด ({users.length} คน)
            </p>
          </div>
          <Button 
            onClick={openCreateModal} 
            className="flex items-center gap-2"
            title="เพิ่มผู้ใช้ใหม่"
          >
            <Plus className="h-4 w-4" />
            เพิ่มผู้ใช้ใหม่
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาผู้ใช้ (ชื่อผู้ใช้, ชื่อเต็ม, อีเมล)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="กรองตามบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {getRoleDisplayName(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สมัคร</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          @{user.username} • {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-muted-foreground">
                            📞 {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role.name)}>
                        {getRoleDisplayName(user.role.name)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                          title="แก้ไขข้อมูลผู้ใช้"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                          title={user.isActive ? "ระงับการใช้งาน" : "เปิดใช้งาน"}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                          className="text-red-600 hover:text-red-800"
                          title="ลบผู้ใช้"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                title="หน้าก่อนหน้า"
              >
                ก่อนหน้า
              </Button>
              <span className="flex items-center px-4">
                หน้า {page} จาก {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                title="หน้าถัดไป"
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลผู้ใช้ใหม่ที่ต้องการเพิ่มเข้าสู่ระบบ
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  รหัสผ่าน
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  ชื่อเต็ม
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  เบอร์โทร
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  บทบาท
                </Label>
                <Select 
                  value={formData.roleId.toString()} 
                  onValueChange={(value) => setFormData({...formData, roleId: parseInt(value)})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="เลือกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {getRoleDisplayName(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleCreateUser} disabled={isSubmitting}>
                {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มผู้ใช้'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลของผู้ใช้ {selectedUser?.fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  อีเมล
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  รหัสผ่านใหม่
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="เว้นว่างหากไม่ต้องการเปลี่ยน"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fullName" className="text-right">
                  ชื่อเต็ม
                </Label>
                <Input
                  id="edit-fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  เบอร์โทร
                </Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  บทบาท
                </Label>
                <Select 
                  value={formData.roleId.toString()} 
                  onValueChange={(value) => setFormData({...formData, roleId: parseInt(value)})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="เลือกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {getRoleDisplayName(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleEditUser} disabled={isSubmitting}>
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">ยืนยันการลบผู้ใช้</h3>
              <p className="text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "{selectedUser?.fullName}"? 
                การดำเนินการนี้จะทำให้บัญชีถูกปิดใช้งาน
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'กำลังลบ...' : 'ลบผู้ใช้'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}