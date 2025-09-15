import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
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
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
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
      return config
    })

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
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
      const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/login', data)
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
      const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/register', data)
      const { token, user } = response.data
      this.setToken(token)
      this.setUser(user)
      return response.data
    } catch (error) {
      // Re-throw the error to be handled by the calling component
      throw error
    }
  }

  async verifyToken(): Promise<{ user: User }> {
    const response: AxiosResponse<{ user: User }> = await this.api.post('/api/auth/verify-token')
    this.setUser(response.data.user)
    return response.data
  }

  async logout(): Promise<void> {
    this.clearToken()
    this.clearUser()
  }

  // Menu endpoints
  async getMenus(params?: {
    category?: string
    search?: string
    available?: boolean
  }): Promise<PaginatedResponse<Menu>> {
    const response: AxiosResponse<PaginatedResponse<Menu>> = await this.api.get('/api/menus', { params })
    return response.data
  }

  async getMenu(id: number): Promise<ApiResponse<Menu>> {
    const response: AxiosResponse<ApiResponse<Menu>> = await this.api.get(`/api/menus/${id}`)
    return response.data
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response: AxiosResponse<ApiResponse<Category[]>> = await this.api.get('/api/menus/categories')
    return response.data
  }

  // Order endpoints
  async getOrders(): Promise<PaginatedResponse<Order>> {
    const response: AxiosResponse<PaginatedResponse<Order>> = await this.api.get('/api/orders')
    return response.data
  }

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.get(`/api/orders/${id}`)
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
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.post('/api/orders', data)
    return response.data
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<{ status: string; timestamp: string }> = await this.api.get('/api/health')
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService