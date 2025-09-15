'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginRequest, RegisterRequest } from '@/lib/types'
import { apiService } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log('Login attempt with:', data)
      const response = await apiService.login(data)
      console.log('Login response:', response)
      setUser(response.user)
      console.log('User set in context:', response.user)
      toast.success(response.message || 'เข้าสู่ระบบสำเร็จ')
      return true
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiService.register(data)
      setUser(response.user)
      toast.success(response.message || 'สมัครสมาชิกสำเร็จ')
      return true
    } catch (error: any) {
      console.error('Register error:', error)
      const message = error.response?.data?.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
    toast.success('ออกจากระบบสำเร็จ')
  }

  const checkAuth = async () => {
    try {
      const token = apiService.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await apiService.verifyToken()
      setUser(response.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      apiService.clearToken()
      apiService.clearUser()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}