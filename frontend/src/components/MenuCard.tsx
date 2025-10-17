'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { MenuItem } from '@/utils/menuApi';
import { Plus, Minus, ShoppingCart, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MenuCardProps {
  menu: MenuItem;
}

export function MenuCard({ menu }: MenuCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [notes, setNotes] = useState('');

  const cartItem = items.find(i => i.menuId === menu.id);
  const cartQty = cartItem?.quantity || 0;

  const handleAddToCart = (withNotes: boolean = false) => {
    if (withNotes) {
      setShowNotesDialog(true);
      return;
    }

    addItem({
      id: menu.id,
      menuId: menu.id,
      name: menu.name,
      price: Number(menu.price),
      image: menu.image || undefined
    }, 1);
    
    toast.success(`เพิ่ม ${menu.name} ลงตะกร้าแล้ว`);
  };

  const handleAddWithNotes = () => {
    addItem({
      id: menu.id,
      menuId: menu.id,
      name: menu.name,
      price: Number(menu.price),
      image: menu.image || undefined,
      notes
    }, 1);
    
    toast.success(`เพิ่ม ${menu.name} ลงตะกร้าแล้ว`);
    setShowNotesDialog(false);
    setNotes('');
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = cartQty + delta;
    if (newQty >= 0) {
      updateQuantity(menu.id, newQty);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-video relative bg-muted">
          {menu.image ? (
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {!menu.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">หมด</Badge>
            </div>
          )}
        </div>

        <CardHeader className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1">{menu.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {menu.description || 'ไม่มีคำอธิบาย'}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">
              {menu.category?.name || 'อื่นๆ'}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {menu.preparationTime} นาที
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              ฿{Number(menu.price).toFixed(2)}
            </div>

            {!menu.isAvailable ? (
              <Button disabled size="sm">
                หมดแล้ว
              </Button>
            ) : cartQty === 0 ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(false)}
                  size="sm"
                  variant="default"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  เพิ่ม
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold w-8 text-center">{cartQty}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มหมายเหตุ - {menu.name}</DialogTitle>
            <DialogDescription>
              ระบุรายละเอียดพิเศษสำหรับรายการนี้
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย, ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddWithNotes} className="flex-1">
                เพิ่มลงตะกร้า
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNotesDialog(false);
                  setNotes('');
                }}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
