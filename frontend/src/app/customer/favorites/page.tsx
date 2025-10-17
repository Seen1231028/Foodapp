'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Star,
  Clock,
  MapPin,
  Heart,
  HeartOff,
  Store,
  Phone,
  Globe
} from 'lucide-react';

interface FavoriteRestaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  category: string;
  distance: string;
  isOpen: boolean;
  phone: string;
  website?: string;
  addedDate: string;
}

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([
    {
      id: 1,
      name: "Golden Thai Kitchen",
      description: "ร้านอาหารไทยต้นตำรับ รสชาติหลากหลาย เมนูเด็ดที่ไม่ควรพลาด",
      image: "/api/placeholder/400/250",
      rating: 4.8,
      reviewCount: 1245,
      deliveryTime: "25-35 นาที",
      deliveryFee: 25,
      minimumOrder: 100,
      category: "อาหารไทย",
      distance: "1.2 กม.",
      isOpen: true,
      phone: "02-123-4567",
      website: "www.goldenthai.com",
      addedDate: "2025-09-10"
    },
    {
      id: 2,
      name: "Sakura Sushi Bar", 
      description: "ซูชิและซาชิมิสดใหม่ สไตล์ญี่ปุ่นแท้ วัตถุดิบคุณภาพพรีเมียม",
      image: "/api/placeholder/400/250",
      rating: 4.7,
      reviewCount: 987,
      deliveryTime: "20-30 นาที", 
      deliveryFee: 30,
      minimumOrder: 150,
      category: "อาหารญี่ปุ่น",
      distance: "0.8 กม.",
      isOpen: true,
      phone: "02-234-5678",
      addedDate: "2025-09-08"
    },
    {
      id: 3,
      name: "Western Grill House",
      description: "สเต็กและอาหารตะวันตก คุณภาพพรีเมียม บรรยากาศหรูหรา",
      image: "/api/placeholder/400/250",
      rating: 4.6,
      reviewCount: 756,
      deliveryTime: "30-40 นาที",
      deliveryFee: 35,
      minimumOrder: 200,
      category: "อาหารตะวันตก", 
      distance: "2.1 กม.",
      isOpen: true,
      phone: "02-345-6789",
      website: "www.westgrill.com",
      addedDate: "2025-09-05"
    },
    {
      id: 4,
      name: "Pasta Milano",
      description: "พาสต้าสไตล์อิตาเลียน ของแท้ รสชาติต้นตำรับ",
      image: "/api/placeholder/400/250",
      rating: 4.5,
      reviewCount: 542,
      deliveryTime: "25-35 นาที",
      deliveryFee: 28,
      minimumOrder: 120,
      category: "อาหารอิตาเลียน",
      distance: "1.8 กม.",
      isOpen: false,
      phone: "02-456-7890",
      addedDate: "2025-09-01"
    }
  ]);

  const removeFromFavorites = (restaurantId: number) => {
    setFavorites(prev => prev.filter(restaurant => restaurant.id !== restaurantId));
  };

  const filteredFavorites = favorites.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout userRole="customer">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ร้านโปรด</h1>
        <p className="text-muted-foreground">
          ร้านอาหารที่คุณชื่นชอบและบันทึกไว้ ({favorites.length} ร้าน)
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="ค้นหาร้านโปรด..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Heart className="w-16 h-16 text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'ไม่พบร้านที่ค้นหา' : 'ยังไม่มีร้านโปรด'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'ลองค้นหาด้วยคำอื่นหรือเปลี่ยนเงื่อนไขการค้นหา'
                  : 'เริ่มเพิ่มร้านที่คุณชื่นชอบเป็นร้านโปรดของคุณ'
                }
              </p>
            </div>
            {!searchTerm && (
              <Button>
                ไปหาร้านอาหาร
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFavorites.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                  <Store className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                      {!restaurant.isOpen && (
                        <Badge variant="secondary">ปิด</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center text-yellow-600">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        {restaurant.rating} ({restaurant.reviewCount} รีวิว)
                      </div>
                      <Badge variant="outline">{restaurant.category}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromFavorites(restaurant.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <HeartOff className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{restaurant.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {restaurant.deliveryTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {restaurant.distance}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span>ค่าส่ง: ฿{restaurant.deliveryFee}</span>
                  <span>ขั้นต่ำ: ฿{restaurant.minimumOrder}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {restaurant.phone}
                  </div>
                  {restaurant.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      <a href={`https://${restaurant.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        เว็บไซต์
                      </a>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  เพิ่มเมื่อ: {new Date(restaurant.addedDate).toLocaleDateString('th-TH')}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" disabled={!restaurant.isOpen}>
                    {restaurant.isOpen ? 'สั่งอาหาร' : 'ร้านปิด'}
                  </Button>
                  <Button variant="outline">
                    ดูเมนู
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
