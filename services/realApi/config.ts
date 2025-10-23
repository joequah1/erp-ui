// API Configuration and Core Utilities
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;
let currentShopId: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }
};

export const setShopId = (shopId: string) => {
  currentShopId = shopId;
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentShopId', shopId);
  }
};

export const getTokens = () => {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
    refreshToken = localStorage.getItem('refreshToken');
    currentShopId = localStorage.getItem('currentShopId');
  }
  return { accessToken, refreshToken, currentShopId };
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  currentShopId = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentShopId');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_shop_id');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Logout helper that redirects to login
const handleUnauthorized = () => {
  clearTokens();
  if (typeof window !== 'undefined') {
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/login') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      window.location.href = '/auth/login?error=unauthorized';
    }
  }
};

// Refresh token
async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const tokens = await response.json();
      setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens;
    }
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

// API request helper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true,
  requiresShop = true
): Promise<T> {
  const { accessToken: token, currentShopId: shopId } = getTokens();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (requiresShop && shopId) {
    headers['x-shop-id'] = shopId;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 - token expired
    if (response.status === 401 && requiresAuth) {
      // Try to refresh token if we have one
      if (refreshToken) {
        const newTokens = await refreshAccessToken();
        if (newTokens) {
          headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          return apiRequest<T>(endpoint, { ...options, headers }, requiresAuth, requiresShop);
        }
      }

      // If refresh failed or no refresh token, handle unauthorized
      handleUnauthorized();
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));

      // Handle specific status codes
      if (response.status === 403) {
        throw new Error(error.message || 'Access denied - You do not have permission to access this resource');
      }
      if (response.status === 404) {
        throw new Error(error.message || 'Resource not found');
      }

      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}
