"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, Shop, LoginCredentials, RegisterData, ForgotPasswordData } from '@/types';
import { authApi, setTokens, setShopId, clearTokens } from '@/services/api';
import { realShopsApi } from '@/services/realApi';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<string>;
  logout: () => Promise<void>;
  switchShop: (shopId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    currentShop: null,
    userShops: [],
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing token on app startup
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      authApi.getCurrentUser()
        .then(async user => {
          // Fetch user shops from API
          let userShops: Shop[] = [];
          try {
            const shops = await realShopsApi.getMyShops();
            userShops = shops.map((shop: any) => ({
              id: shop.id.toString(),
              name: shop.name,
              description: shop.slug || '',
              ownerId: user.id,
              settings: {},
              isActive: shop.status === 1,
              createdAt: shop.createdAt || new Date().toISOString(),
              updatedAt: shop.updatedAt || new Date().toISOString()
            }));
          } catch (error) {
            console.warn('Failed to fetch shops, using mock data:', error);
            userShops = [
              { id: '1', name: 'Main Store', description: 'Primary retail location', ownerId: user.id, settings: {}, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
              { id: '2', name: 'Online Store', description: 'E-commerce platform', ownerId: user.id, settings: {}, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
            ];
          }

          // Get previously selected shop or use first one
          const savedShopId = typeof window !== 'undefined' ? localStorage.getItem('current_shop_id') : null;
          const currentShop = savedShopId ? userShops.find(s => s.id === savedShopId) || userShops[0] : userShops[0];

          // Set shop ID for API calls
          if (currentShop) {
            setShopId(currentShop.id);
          }

          setState({
            user,
            currentShop,
            userShops,
            isAuthenticated: true,
            isLoading: false
          });
        })
        .catch(() => {
          if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
          clearTokens();
          setState({
            user: null,
            currentShop: null,
            userShops: [],
            isAuthenticated: false,
            isLoading: false
          });
        });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authApi.login(credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        document.cookie = `auth_token=${token}; path=/;`;
      }

      // Fetch user shops from API
      let userShops: Shop[] = [];
      try {
        const shops = await realShopsApi.getMyShops();
        userShops = shops.map((shop: any) => ({
          id: shop.id.toString(),
          name: shop.name,
          description: shop.slug || '',
          ownerId: user.id,
          settings: {},
          isActive: shop.status === 1,
          createdAt: shop.createdAt || new Date().toISOString(),
          updatedAt: shop.updatedAt || new Date().toISOString()
        }));
      } catch (error) {
        console.warn('Failed to fetch shops, using mock data:', error);
        userShops = [
          { id: '1', name: 'Main Store', description: 'Primary retail location', ownerId: user.id, settings: {}, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          { id: '2', name: 'Online Store', description: 'E-commerce platform', ownerId: user.id, settings: {}, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
        ];
      }

      const currentShop = userShops[0];

      // Set shop ID for API calls
      if (currentShop) {
        setShopId(currentShop.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('current_shop_id', currentShop.id);
        }
      }

      setState({
        user,
        currentShop,
        userShops,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authApi.register(data);
      if (typeof window !== 'undefined') localStorage.setItem('auth_token', token);
      const mockShops: Shop[] = [
        { id: '1', name: 'Main Store', description: 'Primary retail location', ownerId: user.id, settings: {}, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      ];
      setState({
        user,
        currentShop: mockShops[0],
        userShops: mockShops,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<string> => {
    const result = await authApi.forgotPassword(data);
    return result.message;
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authApi.logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_shop_id');
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      clearTokens();
      setState({
        user: null,
        currentShop: null,
        userShops: [],
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      // Force logout even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_shop_id');
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      clearTokens();
      setState({
        user: null,
        currentShop: null,
        userShops: [],
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const switchShop = (shopId: string) => {
    const shop = state.userShops.find(s => s.id === shopId);
    if (shop) {
      setState(prev => ({ ...prev, currentShop: shop }));
      setShopId(shopId);
      if (typeof window !== 'undefined') localStorage.setItem('current_shop_id', shopId);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        login,
        register,
        forgotPassword,
        logout,
        switchShop
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
