// User API service functions for admin user management

import authUtils from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const getAuthHeaders = () => {
  return authUtils.getAuthHeaders();
};

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: {
    id: number;
    name: string;
    description: string;
  };
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleId: number;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get all users with pagination and filters
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.role) queryParams.append('role', params.role);

  const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get user by ID
export const getUser = async (id: number): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Create new user
export const createUser = async (userData: CreateUserData): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Update user
export const updateUser = async (id: number, userData: UpdateUserData): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Delete user (soft delete - deactivate)
export const deleteUser = async (id: number): Promise<ApiResponse<any>> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Toggle user status (activate/deactivate)
export const toggleUserStatus = async (id: number): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get all roles
export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  const response = await fetch(`${API_BASE_URL}/users/roles/list`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get user statistics
export const getUserStats = async (): Promise<ApiResponse<{
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  usersByRole: Array<{
    roleId: number;
    roleName: string;
    count: number;
  }>;
  recentUsers: Array<{
    id: number;
    username: string;
    fullName: string;
    role: string;
    createdAt: string;
  }>;
}>> => {
  const response = await fetch(`${API_BASE_URL}/users/stats`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getRoles,
  getUserStats
};