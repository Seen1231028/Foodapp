'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import '@/utils/cleanup'; // Auto-cleanup localStorage
import { 
  Search,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Package,
  Store,
  User
} from "lucide-react";
import Link from "next/link";

interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  preparationTime: string;
}

interface Restaurant {
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
}

function HomePage({ userRole }: { userRole: string }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      restaurantId: 1,
      name: "ผัดไทยกุ้งสด",
      description: "ผัดไทยแสนอร่อย โรยหน้าด้วยกุ้งสดๆ พร้อมผักกาดขาว ถั่วงอก และใส่ไข่",
      price: 120,
      image: "/api/placeholder/300/200",
      category: "thai",
      isAvailable: true,
      rating: 4.8,
      reviewCount: 245,
      preparationTime: "15-20 นาที"
    },
    {
      id: 2,
      restaurantId: 1,
      name: "ต้มยำกุ้งน้ำข้น",
      description: "ต้มยำรสเด็ด เปรียวเค็มหวาน กุ้งสดใหญ่ เห็ดฟาง มะเขือเทศ",
      price: 150,
      image: "/api/placeholder/300/200",
      category: "thai",
      isAvailable: true,
      rating: 4.9,
      reviewCount: 312,
      preparationTime: "20-25 นาที"
    },
    {
      id: 3,
      restaurantId: 2,
      name: "ซูชิแซลมอนพรีเมียม",
      description: "ซูชิแซลมอนสดใหม่ นำเข้าจากนอร์เวย์ พร้อมข้าวซูชิเกรดพรีเมียม",
      price: 280,
      image: "/api/placeholder/300/200",
      category: "japanese",
      isAvailable: true,
      rating: 4.7,
      reviewCount: 189,
      preparationTime: "10-15 นาที"
    },
    {
      id: 4,
      restaurantId: 2,
      name: "ราเมนหมูชาชู",
      description: "ราเมนน้ำซุปเข้มข้น หมูชาชูนุ่ม ไข่ต้ม และผักโขมญี่ปุ่น",
      price: 220,
      image: "/api/placeholder/300/200",
      category: "japanese",
      isAvailable: true,
      rating: 4.6,
      reviewCount: 156,
      preparationTime: "25-30 นาที"
    },
    {
      id: 5,
      restaurantId: 3,
      name: "เบอร์เกอร์เนื้อวัวแองกัส",
      description: "เบอร์เกอร์เนื้อวัวแองกัสแท้ 100% พร้อมชีสเชดดาร์ และผักสดๆ",
      price: 189,
      image: "/api/placeholder/300/200",
      category: "western",
      isAvailable: true,
      rating: 4.5,
      reviewCount: 98,
      preparationTime: "15-20 นาที"
    },
    {
      id: 6,
      restaurantId: 3,
      name: "สเต็กเนื้อริบอาย",
      description: "สเต็กเนื้อริบอายเกรดพรีเมียม ย่างสุกกำลังดี พร้อมผักและมันฝรั่ง",
      price: 450,
      image: "/api/placeholder/300/200",
      category: "western",
      isAvailable: true,
      rating: 4.8,
      reviewCount: 67,
      preparationTime: "30-35 นาที"
    }
  ];

  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Golden Thai Kitchen",
      description: "ร้านอาหารไทยต้นตำรับ รสชาติหลากหลาย",
      image: "/api/placeholder/400/250",
      rating: 4.8,
      reviewCount: 1245,
      deliveryTime: "25-35 นาที",
      deliveryFee: 25,
      minimumOrder: 100,
      category: "thai",
      distance: "1.2 กม.",
      isOpen: true
    },
    {
      id: 2,
      name: "Sakura Sushi Bar", 
      description: "ซูชิและซาชิมิสดใหม่ สไตล์ญี่ปุ่นแท้",
      image: "/api/placeholder/400/250",
      rating: 4.7,
      reviewCount: 987,
      deliveryTime: "20-30 นาที", 
      deliveryFee: 30,
      minimumOrder: 150,
      category: "japanese",
      distance: "0.8 กม.",
      isOpen: true
    },
    {
      id: 3,
      name: "Western Grill House",
      description: "สเต็กและอาหารตะวันตก คุณภาพพรีเมียม",
      image: "/api/placeholder/400/250",
      rating: 4.6,
      reviewCount: 756,
      deliveryTime: "30-40 นาที",
      deliveryFee: 35,
      minimumOrder: 200,
      category: "western", 
      distance: "2.1 กม.",
      isOpen: true
    }
  ];

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'thai', name: 'อาหารไทย' },
    { id: 'japanese', name: 'อาหารญี่ปุ่น' },
    { id: 'western', name: 'อาหารตะวันตก' },
    { id: 'chinese', name: 'อาหารจีน' }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRestaurant = selectedRestaurant === null || item.restaurantId === selectedRestaurant;
    return matchesCategory && matchesSearch && matchesRestaurant;
  });

  const addToCart = (itemId: number) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const getCartItemCount = (itemId: number) => cartItems[itemId] || 0;
  const getTotalCartItems = () => Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  const getTotalCartValue = () => {
    return Object.entries(cartItems).reduce((total, [itemId, count]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  const handleRestaurantClick = (restaurantId: number) => {
    setSelectedRestaurant(restaurantId);
    setSelectedCategory('all');
  };

  const clearRestaurantFilter = () => {
    setSelectedRestaurant(null);
  };

  return (
    <AppLayout 
      cartItemCount={getTotalCartItems()} 
      onCartClick={() => setShowCart(!showCart)}
      userRole={userRole}
    >
      {/* Main Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับสู่ ZeenZilla</h1>
          <p className="text-muted-foreground">สั่งอาหารอร่อยจากร้านดังใกล้บ้านคุณ</p>
          {selectedRestaurant && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={clearRestaurantFilter}>
                ← กลับดูร้านทั้งหมด
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                กำลังดูเมนูจาก: {restaurants.find(r => r.id === selectedRestaurant)?.name}
              </p>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="ค้นหาเมนูอาหาร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Restaurant Highlights */}
            {!selectedRestaurant && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">ร้านแนะนำ</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {restaurants.map((restaurant) => (
                    <Card 
                      key={restaurant.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      <div className="aspect-video bg-muted">
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                          <Store className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <div className="flex items-center text-sm text-yellow-600">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {restaurant.rating}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{restaurant.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {restaurant.deliveryTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {restaurant.distance}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div>
              <h2 className="text-xl font-semibold mb-4">เมนูอาหาร</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                        <Package className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center text-sm text-yellow-600">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {item.rating}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.preparationTime}
                        </div>
                        <span className="text-sm">({item.reviewCount} รีวิว)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">฿{item.price}</span>
                        <div className="flex items-center gap-2">
                          {getCartItemCount(item.id) > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                          {getCartItemCount(item.id) > 0 && (
                            <span className="mx-2 font-semibold">{getCartItemCount(item.id)}</span>
                          )}
                          <Button
                            size="sm"
                            onClick={() => addToCart(item.id)}
                            disabled={!item.isAvailable}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Modal */}
          {showCart && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                      ✕
                    </Button>
                  </div>
                  
                  {getTotalCartItems() === 0 ? (
                    <p className="text-muted-foreground text-center py-8">ตะกร้าว่างเปล่า</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(cartItems).map(([itemId, count]) => {
                        if (count === 0) return null;
                        const item = menuItems.find(item => item.id === parseInt(itemId));
                        if (!item) return null;
                        
                        return (
                          <div key={itemId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">฿{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="mx-2 font-semibold">{count}</span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(item.id)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total:</span>
                          <span>฿{getTotalCartValue()}</span>
                        </div>
                        <Button className="w-full mt-4">
                          Order ({getTotalCartItems()} items)
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
    </AppLayout>
  );
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        // Check for logged in user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            console.log('Found saved user:', userData);
          } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('user');
          }
        } else if (savedUser === 'undefined' || savedUser === 'null') {
          // Clean up invalid localStorage values
          localStorage.removeItem('user');
        }
        setIsLoading(false);
      }, []);

      // Debug log
      console.log('Home component - user:', user, 'isLoading:', isLoading);

      if (isLoading) {
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">กำลังโหลด...</p>
            </div>
          </div>
        );
      }

      if (user) {
        console.log('Rendering dashboard for user:', user.username, 'role:', user.role.name);
        return <HomePage userRole={user.role.name} />;
      }

      console.log('Rendering login/register page - no user found');

      return (
        <div className="min-h-screen bg-background flex items-center justify-center relative">
          {/* LiquidEther Background */}
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 0, 
            pointerEvents: 'none' 
          }}>
            <LiquidEther
              colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
              mouseForce={25}
              cursorSize={120}
              isViscous={false}
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.6}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.7}
              autoIntensity={2.5}
              takeoverDuration={0.25}
              autoResumeDelay={2000}
              autoRampDuration={0.8}
            />
          </div>

          {/* Content with overlay */}
          <div className="max-w-md w-full space-y-8 p-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2 drop-shadow-lg">ZeenZilla</h1>
              <p className="text-muted-foreground mb-8 drop-shadow">ระบบสั่งอาหารออนไลน์</p>
            </div>
            
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                    ยินดีต้อนรับ
                  </h2>
                  <p className="text-muted-foreground">
                    เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเริ่มใช้งาน
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Link href="auth/login" className="w-full">
                    <Button className="w-full" size="lg">
                      เข้าสู่ระบบ
                    </Button>
                  </Link>
                  
                  <Link href="auth/register" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      สมัครสมาชิก
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }
