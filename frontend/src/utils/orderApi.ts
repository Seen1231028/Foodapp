import authUtils from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Interface สำหรับ Order
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  image?: string;
}

export interface OrderPayment {
  id: number;
  method: string;
  status: string;
  amount: number;
  paidAt?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  payments?: OrderPayment[];
}

// ดึงรายการคำสั่งซื้อทั้งหมด
export const getOrders = async (status?: string) => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      return { 
        success: false, 
        error: 'กรุณาเข้าสู่ระบบก่อนดูคำสั่งซื้อ',
        orders: []
      };
    }

    let url = `${API_BASE_URL}/orders`;
    if (status && status !== 'all') {
      url += `?status=${status}`;
    }

    console.log('Fetching orders from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      return { 
        success: false, 
        error: `ไม่สามารถดึงข้อมูลได้ (${response.status})`,
        orders: []
      };
    }

    const result = await response.json();
    console.log('Orders result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      orders: []
    };
  }
};

// ดึงข้อมูลคำสั่งซื้อเฉพาะ
export const getOrderById = async (orderId: number) => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// อัพเดทสถานะคำสั่งซื้อ
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      throw new Error('ไม่พบ token');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update order status');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ฟังก์ชันช่วยในการแปลงสถานะเป็นภาษาไทย
export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': 'รอยืนยัน',
    'confirmed': 'ยืนยันแล้ว',
    'preparing': 'กำลังเตรียม',
    'ready': 'พร้อมรับ',
    'completed': 'สำเร็จ',
    'cancelled': 'ยกเลิก'
  };
  return statusMap[status.toLowerCase()] || status;
};

// ฟังก์ชันช่วยในการกำหนดสีสถานะ
export const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    'pending': 'yellow',
    'confirmed': 'blue',
    'preparing': 'orange',
    'ready': 'purple',
    'completed': 'green',
    'cancelled': 'red'
  };
  return colorMap[status.toLowerCase()] || 'gray';
};

// ฟังก์ชันช่วยในการกำหนดสถานะถัดไป
export const getNextStatus = (currentStatus: string): string[] => {
  const statusFlow: { [key: string]: string[] } = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['preparing', 'cancelled'],
    'preparing': ['ready', 'cancelled'],
    'ready': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };
  return statusFlow[currentStatus.toLowerCase()] || [];
};

// ฟังก์ชันช่วยในการคำนวณเวลาผ่านไป
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) {
    return 'เมื่อสักครู่';
  } else if (diffInMins < 60) {
    return `${diffInMins} นาทีที่แล้ว`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ชั่วโมงที่แล้ว`;
  } else {
    return `${diffInDays} วันที่แล้ว`;
  }
};

// ฟังก์ชันช่วยในการฟอร์แมทเงิน
export const formatCurrency = (amount: number): string => {
  return `฿${amount.toLocaleString()}`;
};

// สร้างคำสั่งซื้อใหม่
export const createOrder = async (orderData: {
  items: Array<{
    menuId: number;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  notes?: string;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'WALLET';
}) => {
  try {
    const token = authUtils.getToken();
    if (!token) {
      return {
        success: false,
        error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ'
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'ไม่สามารถสร้างคำสั่งซื้อได้'
      };
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ'
    };
  }
};