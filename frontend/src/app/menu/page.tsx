'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Truck
} from "lucide-react";

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

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "ร้านอาหารไทยแท้",
      description: "อาหารไทยต้นตำรับ รสชาติแท้",
      image: "/restaurant1.jpg",
      rating: 4.5,
      reviewCount: 324,
      deliveryTime: "30-45 นาที",
      deliveryFee: 25,
      minimumOrder: 100,
      category: "อาหารไทย",
      distance: "1.2 กม.",
      isOpen: true
    },
    {
      id: 2,
      name: "ก๋วยเตี๋ยวลุงสมชาย",
      description: "ก๋วยเตี๋ยวรสเด็ด เส้นหนึบ",
      image: "/restaurant2.jpg",
      rating: 4.3,
      reviewCount: 189,
      deliveryTime: "20-30 นาที",
      deliveryFee: 20,
      minimumOrder: 80,
      category: "ก๋วยเตี๋ยว",
      distance: "0.8 กม.",
      isOpen: true
    },
    {
      id: 3,
      name: "KFC สาขาเซ็นทรัล",
      description: "ไก่ทอดกรอบนอกนุ่มใน",
      image: "/restaurant3.jpg",
      rating: 4.1,
      reviewCount: 567,
      deliveryTime: "25-35 นาที",
      deliveryFee: 30,
      minimumOrder: 150,
      category: "ฟาสต์ฟู้ด",
      distance: "2.1 กม.",
      isOpen: false
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: 1,
      restaurantId: 1,
      name: "ผัดไทยกุ้ง",
      description: "ผัดไทยแบบดั้งเดิม ใส่กุ้งสด ถั่วงอก ใบกุยช่าย",
      price: 120,
      image: "/food1.jpg",
      category: "อาหารจานเดียว",
      isAvailable: true,
      rating: 4.6,
      reviewCount: 89,
      preparationTime: "15-20 นาที"
    },
    {
      id: 2,
      restaurantId: 1,
      name: "ต้มยำกุ้ง",
      description: "ต้มยำรสจัดจ้าน เปรื้อย หอม เผ็ด เปรี้ยว",
      price: 150,
      image: "/food2.jpg",
      category: "แกง/ต้ม",
      isAvailable: true,
      rating: 4.7,
      reviewCount: 156,
      preparationTime: "20-25 นาที"
    },
    {
      id: 3,
      restaurantId: 2,
      name: "ก๋วยเตี๋ยวต้มยำ",
      description: "ก๋วยเตี๋ยวต้มยำรสเด็ด น้ำใส กุ้งสด",
      price: 60,
      image: "/food3.jpg",
      category: "ก๋วยเตี๋ยว",
      isAvailable: true,
      rating: 4.4,
      reviewCount: 78,
      preparationTime: "10-15 นาที"
    }
  ];

  const categories = [
    { value: "all", label: "ทั้งหมด" },
    { value: "อาหารไทย", label: "อาหารไทย" },
    { value: "ก๋วยเตี๋ยว", label: "ก๋วยเตี๋ยว" },
    { value: "ฟาสต์ฟู้ด", label: "ฟาสต์ฟู้ด" },
    { value: "อาหารจานเดียว", label: "อาหารจานเดียว" },
    { value: "แกง/ต้ม", label: "แกง/ต้ม" }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredMenuItems = menuItems.filter(item => {
    if (selectedRestaurant && item.restaurantId !== selectedRestaurant) return false;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (menuItem: MenuItem) => {
    const restaurant = restaurants.find(r => r.id === menuItem.restaurantId)!;
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.menuItem.id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { menuItem, quantity: 1, restaurant }]);
    }
  };

  const removeFromCart = (menuItemId: number) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.menuItem.id === menuItemId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.menuItem.id !== menuItemId));
    }
  };

  const toggleFavorite = (restaurantId: number) => {
    if (favorites.includes(restaurantId)) {
      setFavorites(favorites.filter(id => id !== restaurantId));
    } else {
      setFavorites([...favorites, restaurantId]);
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  return (
    <DashboardLayout title="เมนูอาหาร">
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาร้านอาหารหรือเมนู..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurants */}
            {!selectedRestaurant && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">ร้านอาหาร</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRestaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={restaurant.image} alt={restaurant.name} />
                            <AvatarFallback>{restaurant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-muted-foreground">{restaurant.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(restaurant.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Heart className={`h-4 w-4 ${favorites.includes(restaurant.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{restaurant.rating}</span>
                                <span>({restaurant.reviewCount})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{restaurant.deliveryTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{restaurant.distance}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex gap-2">
                                <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                                  {restaurant.isOpen ? "เปิด" : "ปิด"}
                                </Badge>
                                <Badge variant="outline">{restaurant.category}</Badge>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => setSelectedRestaurant(restaurant.id)}
                                disabled={!restaurant.isOpen}
                              >
                                ดูเมนู
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>ค่าส่ง ฿{restaurant.deliveryFee}</span>
                              <span>ขั้นต่ำ ฿{restaurant.minimumOrder}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            {selectedRestaurant && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    เมนู - {restaurants.find(r => r.id === selectedRestaurant)?.name}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedRestaurant(null)}>
                    กลับหน้าร้าน
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {filteredMenuItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={item.image} alt={item.name} />
                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span>{item.rating}</span>
                                    <span>({item.reviewCount})</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{item.preparationTime}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">฿{item.price}</div>
                                <Badge variant="outline">{item.category}</Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                {item.isAvailable ? "พร้อมจำหน่าย" : "หมด"}
                              </Badge>
                              
                              <div className="flex items-center gap-2">
                                {cart.find(cartItem => cartItem.menuItem.id === item.id) ? (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">
                                      {cart.find(cartItem => cartItem.menuItem.id === item.id)?.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addToCart(item)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(item)}
                                    disabled={!item.isAvailable}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    เพิ่ม
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  ตะกร้า ({getTotalItems()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    ตะกร้าว่าง
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.menuItem.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={item.menuItem.image} alt={item.menuItem.name} />
                          <AvatarFallback>{item.menuItem.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.menuItem.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.restaurant.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-bold">฿{item.menuItem.price * item.quantity}</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeFromCart(item.menuItem.id)}
                              >
                                <Minus className="h-2 w-2" />
                              </Button>
                              <span className="text-xs w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => addToCart(item.menuItem)}
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>รวม:</span>
                        <span>฿{getTotalPrice()}</span>
                      </div>
                      <Button className="w-full mt-3">
                        <Truck className="h-4 w-4 mr-2" />
                        สั่งซื้อ
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}