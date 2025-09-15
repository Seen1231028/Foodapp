// User types
export interface User {
  id: number
  username: string
  email: string
  fullName: string
  phone?: string
  isActive: boolean
  lastLogin?: string
  roleId: number
  createdAt: string
  updatedAt: string
  role: {
    id: number
    name: string
    description: string
  }
}

// Auth types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
  phone?: string
  roleId?: number
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

// Menu types
export interface Category {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Menu {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  isAvailable: boolean
  isActive: boolean
  preparationTime: number
  categoryId: number
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
  }
}

// Order types
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  WALLET = 'WALLET'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface OrderItem {
  id: number
  orderId: number
  menuId: number
  quantity: number
  price: number
  notes?: string
  menu: Menu
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  status: OrderStatus
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
  user: Pick<User, 'id' | 'username' | 'fullName'>
  items: OrderItem[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number
  page?: number
  totalPages?: number
}