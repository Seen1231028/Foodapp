'use client';

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, CheckCircle, XCircle, Eye, Download, Package, AlertCircle, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Menu {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isActive: boolean;
  preparationTime: number;
  categoryId: number;
  shopId?: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  shop?: {
    id: number;
    name: string;
    image?: string;
  };
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบ');
        return;
      }

      const response = await fetch('http://localhost:4000/api/menus', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลเมนูได้');
      }

      const result = await response.json();
      if (result.success) {
        setMenus(result.data);
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleToggleAvailable = async (menuId: number, currentStatus: boolean) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/menus/${menuId}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถอัพเดทสถานะได้');
      }

      await fetchMenus();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (menuId: number, currentStatus: boolean) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/menus/${menuId}/active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถอัพเดทสถานะได้');
      }

      await fetchMenus();
      setSelectedMenu(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setActionLoading(false);
    }
  };

  const exportMenusCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM
    csv += 'ID,ชื่อเมนู,ร้านค้า,หมวดหมู่,ราคา,สถานะ,พร้อมขาย,เวลาเตรียม,วันที่สร้าง\n';
    
    filteredMenus.forEach(menu => {
      csv += `${menu.id},"${menu.name}","${menu.shop?.name || '-'}","${menu.category.name}",${menu.price},`;
      csv += `${menu.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'},${menu.isAvailable ? 'พร้อม' : 'ไม่พร้อม'},`;
      csv += `${menu.preparationTime} นาที,${new Date(menu.createdAt).toLocaleDateString('th-TH')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `menus_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMenus = menus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.shop?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMenus = filteredMenus.filter(m => m.isActive);
  const inactiveMenus = filteredMenus.filter(m => !m.isActive);

  if (loading) {
    return (
      <DashboardLayout title="จัดการเมนูอาหาร">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="จัดการเมนูอาหาร">
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">เมนูทั้งหมด</p>
                  <p className="text-2xl font-bold">{menus.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ใช้งาน</p>
                  <p className="text-2xl font-bold text-green-600">{activeMenus.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ปิดใช้งาน</p>
                  <p className="text-2xl font-bold text-red-600">{inactiveMenus.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ไม่พร้อมขาย</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {menus.filter(m => !m.isAvailable).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>รายการเมนูอาหาร</CardTitle>
                <CardDescription>จัดการและตรวจสอบเมนูอาหารทั้งหมดในระบบ</CardDescription>
              </div>
              <Button onClick={exportMenusCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                ส่งออก CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ค้นหาเมนู, ร้านค้า, หมวดหมู่..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">ทั้งหมด ({filteredMenus.length})</TabsTrigger>
                <TabsTrigger value="active">ใช้งาน ({activeMenus.length})</TabsTrigger>
                <TabsTrigger value="inactive">ปิดใช้งาน ({inactiveMenus.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <MenuTable menus={filteredMenus} onView={setSelectedMenu} onToggleAvailable={handleToggleAvailable} actionLoading={actionLoading} />
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <MenuTable menus={activeMenus} onView={setSelectedMenu} onToggleAvailable={handleToggleAvailable} actionLoading={actionLoading} />
              </TabsContent>

              <TabsContent value="inactive" className="mt-4">
                <MenuTable menus={inactiveMenus} onView={setSelectedMenu} onToggleAvailable={handleToggleAvailable} actionLoading={actionLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedMenu} onOpenChange={() => setSelectedMenu(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>รายละเอียดเมนู</DialogTitle>
              <DialogDescription>ข้อมูลเมนู #{selectedMenu?.id}</DialogDescription>
            </DialogHeader>

            {selectedMenu && (
              <div className="space-y-4">
                {selectedMenu.image && (
                  <img
                    src={selectedMenu.image}
                    alt={selectedMenu.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ชื่อเมนู</p>
                    <p className="font-medium">{selectedMenu.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ราคา</p>
                    <p className="font-medium">฿{selectedMenu.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ร้านค้า</p>
                    <p className="font-medium">{selectedMenu.shop?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">หมวดหมู่</p>
                    <p className="font-medium">{selectedMenu.category.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">เวลาเตรียม</p>
                    <p className="font-medium">{selectedMenu.preparationTime} นาที</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">สถานะ</p>
                    <div className="flex gap-2">
                      <Badge variant={selectedMenu.isActive ? "default" : "secondary"}>
                        {selectedMenu.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                      </Badge>
                      <Badge variant={selectedMenu.isAvailable ? "default" : "destructive"}>
                        {selectedMenu.isAvailable ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedMenu.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">คำอธิบาย</p>
                    <p className="text-sm">{selectedMenu.description}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedMenu.isActive ? (
                    <Button
                      variant="destructive"
                      onClick={() => handleToggleActive(selectedMenu.id, selectedMenu.isActive)}
                      disabled={actionLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      ปิดใช้งาน
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleToggleActive(selectedMenu.id, selectedMenu.isActive)}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      อนุมัติใช้งาน
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function MenuTable({ 
  menus, 
  onView, 
  onToggleAvailable, 
  actionLoading 
}: { 
  menus: Menu[]; 
  onView: (menu: Menu) => void;
  onToggleAvailable: (id: number, current: boolean) => void;
  actionLoading: boolean;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">เมนู</TableHead>
              <TableHead className="min-w-[150px]">ร้านค้า</TableHead>
              <TableHead className="min-w-[120px]">หมวดหมู่</TableHead>
              <TableHead className="min-w-[100px]">ราคา</TableHead>
              <TableHead className="min-w-[100px]">สถานะ</TableHead>
              <TableHead className="min-w-[120px]">พร้อมขาย</TableHead>
              <TableHead className="text-right min-w-[150px]">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {menus.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                ไม่พบข้อมูลเมนู
              </TableCell>
            </TableRow>
          ) : (
            menus.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {menu.image ? (
                      <img src={menu.image} alt={menu.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        🍽️
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{menu.name}</p>
                      <p className="text-xs text-muted-foreground">#{menu.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{menu.shop?.name || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{menu.category.name}</Badge>
                </TableCell>
                <TableCell className="font-medium">฿{menu.price}</TableCell>
                <TableCell>
                  <Badge variant={menu.isActive ? "default" : "secondary"}>
                    {menu.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={menu.isAvailable ? "default" : "destructive"}
                    onClick={() => onToggleAvailable(menu.id, menu.isAvailable)}
                    disabled={actionLoading}
                  >
                    {menu.isAvailable ? 'พร้อม' : 'ไม่พร้อม'}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => onView(menu)}>
                    <Eye className="h-4 w-4 mr-1" />
                    ดู
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
