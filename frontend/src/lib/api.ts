import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse, 
  Menu, 
  Category, 
  Order,
  ApiResponse,
  PaginatedResponse 
} from './types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    // Use different API URL for server-side vs client-side
    const getApiUrl = () => {
      if (typeof window === 'undefined') {
        // Server-side (Docker internal network)
        return process.env.NEXT_PUBLIC_API_URL || 'http://foodapp_backend:4000/api'
      }
      // Client-side (browser)
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    }

    this.api = axios.create({
      baseURL: getApiUrl(),
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // Add logging
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
        params: config.params
      })
      
      return config
    }, (error) => {
      console.error('🚨 API Request Error:', error)
      return Promise.reject(error)
    })

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
        return response
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        
        if (error.response?.status === 401) {
          this.clearToken()
        }
        return Promise.reject(error)
      }
    )
  }

  // Token management
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // User management
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data)
      const { token, user } = response.data
      this.setToken(token)
      this.setUser(user)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data)
      const { token, user } = response.data
      this.setToken(token)
      this.setUser(user)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async verifyToken(): Promise<{ user: User }> {
    // Use POST /auth/verify-token (backend defines POST only)
    const response: AxiosResponse<{ success?: boolean; data?: { user: User }; user?: User }> = await this.api.post('/auth/verify-token')
    const user = (response.data as any).data?.user || (response.data as any).user
    if (user) this.setUser(user)
    return { user }
  }

  async logout(): Promise<void> {
    this.clearToken()
    this.clearUser()
  }

  async forgotPassword(data: { email: string }): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/forgot-password', data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async resetPassword(data: { email: string; newPassword: string }): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/reset-password', data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Menu endpoints
  async getMenus(params?: {
    category?: string
    search?: string
    available?: boolean
  }): Promise<PaginatedResponse<Menu>> {
    const response: AxiosResponse<PaginatedResponse<Menu>> = await this.api.get('/menus', { params })
    return response.data
  }

  async getMenu(id: number): Promise<ApiResponse<Menu>> {
    const response: AxiosResponse<ApiResponse<Menu>> = await this.api.get(`/menus/${id}`)
    return response.data
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response: AxiosResponse<ApiResponse<Category[]>> = await this.api.get('/menus/categories')
    return response.data
  }

  async createMenu(data: Partial<Menu>): Promise<ApiResponse<Menu>> {
    const response: AxiosResponse<ApiResponse<Menu>> = await this.api.post('/menus', data)
    return response.data
  }

  async updateMenu(id: number, data: Partial<Menu>): Promise<ApiResponse<Menu>> {
    const response: AxiosResponse<ApiResponse<Menu>> = await this.api.put(`/menus/${id}`, data)
    return response.data
  }

  async deleteMenu(id: number): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/menus/${id}`)
    return response.data
  }

  async toggleMenuAvailability(id: number): Promise<ApiResponse<Menu>> {
    const response: AxiosResponse<ApiResponse<Menu>> = await this.api.patch(`/menus/${id}/toggle-availability`)
    return response.data
  }

  // Order endpoints
  async getOrders(): Promise<PaginatedResponse<Order>> {
    const response: AxiosResponse<PaginatedResponse<Order>> = await this.api.get('/orders')
    return response.data
  }

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.get(`/orders/${id}`)
    return response.data
  }

  async createOrder(data: {
    items: Array<{
      menuId: number
      quantity: number
      notes?: string
    }>
    notes?: string
  }): Promise<ApiResponse<Order>> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.post('/orders', data)
    return response.data
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<{ status: string; timestamp: string }> = await this.api.get('/health')
    return response.data
  }

  // Dashboard endpoints
  async getShopStats(): Promise<ApiResponse<{
    totalOrders: number
    totalRevenue: number
    totalCustomers: number
    totalMenuItems: number
    recentOrders: Order[]
    dailyRevenue: Array<{ date: string; revenue: number }>
    topMenuItems: Array<{ menuId: number; name: string; totalOrdered: number }>
  }>> {
    const response = await this.api.get('/dashboard/shop-stats')
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService