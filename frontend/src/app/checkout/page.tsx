'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/utils/orderApi';
import { Loader2, CreditCard, Wallet, Banknote, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'WALLET';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, isLoaded } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');

  // Redirect if cart is empty (only after cart is loaded from localStorage)
  useEffect(() => {
    if (isLoaded && items.length === 0) {
      toast.error('ตะกร้าสินค้าว่างเปล่า');
      router.push('/');
    }
  }, [items, router, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          menuId: item.menuId,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes
        })),
        notes: notes || undefined,
        paymentMethod
      };

      const result = await createOrder(orderData);

      if (result.success) {
        toast.success('สั่งซื้อสำเร็จ!');
        clearCart();
        router.push('/customer/orders');
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: 'CASH', label: 'เงินสด', icon: Banknote },
    { value: 'CREDIT_CARD', label: 'บัตรเครดิต', icon: CreditCard },
    { value: 'DEBIT_CARD', label: 'บัตรเดบิต', icon: CreditCard },
    { value: 'BANK_TRANSFER', label: 'โอนเงิน', icon: Building },
    { value: 'WALLET', label: 'กระเป๋าเงิน', icon: Wallet },
  ];

  // Show loading or nothing while cart is loading
  if (!isLoaded || items.length === 0) {
    return null;
  }

  return (
    <AppLayout userRole="customer">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">ชำระเงิน</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.menuId} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ฿{item.price.toFixed(2)} x {item.quantity}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground">
                          หมายเหตุ: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="font-medium">
                      ฿{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>รวมทั้งสิ้น</span>
                    <span>฿{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>วิธีชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>เลือกวิธีชำระเงิน</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  >
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div
                          key={method.value}
                          className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted"
                        >
                          <RadioGroupItem value={method.value} id={method.value} />
                          <Label
                            htmlFor={method.value}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <Icon className="h-5 w-5" />
                            {method.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Order Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุสำหรับร้านค้า (ถ้ามี)</Label>
                  <Textarea
                    id="notes"
                    placeholder="เช่น ส่งไวหน่อยนะคะ"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      กำลังสั่งซื้อ...
                    </>
                  ) : (
                    <>
                      ยืนยันคำสั่งซื้อ ฿{totalPrice.toFixed(2)}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  ย้อนกลับ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
