import authUtils from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  image: string | null
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

export interface Category {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMenuData {
  name: string
  description?: string
  price: number
  categoryId: number
  image?: string
  preparationTime?: number
}

export interface UpdateMenuData {
  name?: string
  description?: string
  price?: number
  categoryId?: number
  image?: string
  preparationTime?: number
  isAvailable?: boolean
}

export const menuApi = {
  async getMenus(filters?: {
    category?: string
    search?: string
    available?: boolean
  }): Promise<MenuItem[]> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.category) params.append('category', filters.category)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.available !== undefined) params.append('available', filters.available.toString())

      const response = await fetch(`${API_URL}/menus?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch menus')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch menus')
      }

      return result.data
    } catch (error) {
      console.error('Menu API error:', error)
      throw error
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_URL}/menus/categories`)

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories')
      }

      return result.data
    } catch (error) {
      console.error('Categories API error:', error)
      throw error
    }
  },

  async getMenu(id: number): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_URL}/menus/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch menu')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch menu')
      }

      return result.data
    } catch (error) {
      console.error('Menu API error:', error)
      throw error
    }
  },

  async createMenu(data: CreateMenuData): Promise<MenuItem> {
    try {
      const token = authUtils.getToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${API_URL}/menus`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to create menu')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create menu')
      }

      return result.data
    } catch (error) {
      console.error('Create menu API error:', error)
      throw error
    }
  },

  async updateMenu(id: number, data: UpdateMenuData): Promise<MenuItem> {
    try {
      const token = authUtils.getToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${API_URL}/menus/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to update menu')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update menu')
      }

      return result.data
    } catch (error) {
      console.error('Update menu API error:', error)
      throw error
    }
  },

  async deleteMenu(id: number): Promise<void> {
    try {
      const token = authUtils.getToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${API_URL}/menus/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete menu')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete menu')
      }
    } catch (error) {
      console.error('Delete menu API error:', error)
      throw error
    }
  },

  async toggleAvailability(id: number, isAvailable: boolean): Promise<MenuItem> {
    try {
      const token = authUtils.getToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${API_URL}/menus/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable })
      })

      if (!response.ok) {
        throw new Error('Failed to toggle availability')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle availability')
      }

      return result.data
    } catch (error) {
      console.error('Toggle availability API error:', error)
      throw error
    }
  }
}

export default menuApi