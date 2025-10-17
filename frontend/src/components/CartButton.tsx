'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export function CartButton() {
  const router = useRouter();
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => router.push('/checkout')}
          className="shadow-lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          ตะกร้า ({totalItems})
          <Badge className="ml-2 bg-white text-primary">
            ฿{totalPrice.toFixed(2)}
          </Badge>
        </Button>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 left-6 z-50">
        <Button
          size="lg"
          onClick={() => router.push('/checkout')}
          className="w-full shadow-lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {totalItems} รายการ - ฿{totalPrice.toFixed(2)}
        </Button>
      </div>
    </>
  );
}
