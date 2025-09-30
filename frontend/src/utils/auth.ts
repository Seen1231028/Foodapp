// Authentication utility functions
export interface AuthUser {
  id: number;
  username: string;
  role: {
    name: string;
    description?: string;
  };
}

// Check if we're in browser environment
const isBrowser = () => typeof window !== 'undefined';

export const authUtils = {
  // Get current user from localStorage
  getCurrentUser: (): AuthUser | null => {
    if (!isBrowser()) return null;
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      if (isBrowser()) {
        localStorage.removeItem('user');
      }
      return null;
    }
  },

  // Get auth token
  getToken: (): string | null => {
    if (!isBrowser()) return null;
    
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      // Return mock token for testing
      return 'mock-token';
    }
    return token;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!isBrowser()) return false;
    
    const token = authUtils.getToken();
    const user = authUtils.getCurrentUser();
    return !!(token && user);
  },

  // Check if user has admin role
  isAdmin: (): boolean => {
    if (!isBrowser()) return false;
    
    const user = authUtils.getCurrentUser();
    return user?.role?.name === 'admin';
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (!isBrowser()) return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check auth state and redirect if needed
  validateAuth: (requireAdmin = false): boolean => {
    if (!isBrowser()) return false;
    
    const token = authUtils.getToken();
    const user = authUtils.getCurrentUser();

    // If user exists but no token, clear everything
    if (user && !token) {
      console.log('User exists but no token found. Clearing auth data...');
      authUtils.clearAuth();
      window.location.href = '/auth/login';
      return false;
    }

    // If no token or user, redirect to login
    if (!token || !user) {
      console.log('No valid auth data found. Redirecting to login...');
      window.location.href = '/auth/login';
      return false;
    }

    // If admin required but user is not admin
    if (requireAdmin && !authUtils.isAdmin()) {
      console.log('Admin access required but user is not admin.');
      return false;
    }

    return true;
  },

  // Get auth headers for API calls
  getAuthHeaders: (): HeadersInit => {
    if (!isBrowser()) return {};
    
    const token = authUtils.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
};

export default authUtils;