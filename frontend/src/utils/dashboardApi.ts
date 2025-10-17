import authUtils from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalMenuItems: number
  pendingOrders: number
  todayOrders: number
  todayRevenue: number
}

export const dashboardApi = {
  async getShopStats(): Promise<DashboardStats> {
    try {
      const token = authUtils.getToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${API_URL}/dashboard/shop-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard stats')
      }

      return result.data
    } catch (error) {
      console.error('Dashboard API error:', error)
      throw error
    }
  }
}

export default dashboardApi