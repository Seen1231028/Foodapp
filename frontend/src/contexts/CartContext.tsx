'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface CartItem {
  id: number;
  menuId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  updateNotes: (menuId: number, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    console.log('🛒 Loading cart from localStorage:', savedCart);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log('✅ Cart loaded:', parsed);
        setItems(parsed);
      } catch (error) {
        console.error('❌ Error loading cart:', error);
      }
    } else {
      console.log('ℹ️ No saved cart found');
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      console.log('💾 Saving cart to localStorage:', items);
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.menuId === item.menuId);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(i =>
          i.menuId === item.menuId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeItem = (menuId: number) => {
    setItems(prevItems => prevItems.filter(item => item.menuId !== menuId));
  };

  const updateQuantity = (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.menuId === menuId ? { ...item, quantity } : item
      )
    );
  };

  const updateNotes = (menuId: number, notes: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.menuId === menuId ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  
  const totalPrice = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        totalItems,
        totalPrice,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
