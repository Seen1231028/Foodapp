'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import apiService from '@/lib/api';
import { Menu as MenuItem } from '@/lib/types';

export default function ShopMenu() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getMenus();
      
      if (response.success && response.data) {
        setMenuItems(response.data);
      } else {
        throw new Error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('ไม่สามารถโหลดข้อมูลเมนูได้');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (id: number) => {
    try {
      const response = await apiService.toggleMenuAvailability(id);
      
      if (response.success && response.data) {
        setMenuItems(items => 
          items.map(item => 
            item.id === id ? response.data! : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('ไม่สามารถเปลี่ยนสถานะเมนูได้');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเมนูนี้?')) {
      return;
    }

    try {
      await apiService.deleteMenu(id);
      setMenuItems(items => items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu:', error);
      alert('ไม่สามารถลบเมนูได้');
    }
  };

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">จัดการเมนู</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMenuItems}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">จัดการเมนู</h1>
        <Button onClick={() => router.push('/shop/menu/new')}>
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มเมนูใหม่
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">เมนูทั้งหมด</p>
              <p className="text-2xl font-bold">{menuItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">พร้อมเสิร์ฟ</p>
              <p className="text-2xl font-bold text-green-600">
                {menuItems.filter(item => item.isAvailable).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ไม่พร้อม</p>
              <p className="text-2xl font-bold text-gray-600">
                {menuItems.filter(item => !item.isAvailable).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredMenuItems.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีเมนู</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'ไม่พบเมนูที่ค้นหา' : 'เริ่มต้นด้วยการเพิ่มเมนูแรกของคุณ'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {item.category.name}
                    </Badge>
                  </div>
                  <Badge 
                    variant={item.isAvailable ? "default" : "secondary"}
                  >
                    {item.isAvailable ? 'พร้อมเสิร์ฟ' : 'ไม่พร้อม'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ฿{item.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleAvailability(item.id)}
                  >
                    {item.isAvailable ? 'ปิดเมนู' : 'เปิดเมนู'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
