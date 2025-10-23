import { User, LoginCredentials, RegisterData, ForgotPasswordData } from '../../types';
import { apiRequest, setTokens, clearTokens } from './config';

// Auth API
export const realAuthApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false,
      false
    );

    setTokens(response.tokens.accessToken, response.tokens.refreshToken);

    // Convert API user format to app User format
    const user: User = {
      id: response.user.id.toString(),
      email: response.user.email,
      name: response.user.name,
      role: 'user', // Default role
      phone: response.user.phoneNumber,
      createdAt: response.user.createdAt || new Date().toISOString(),
      updatedAt: response.user.updatedAt || new Date().toISOString(),
    };

    return {
      user,
      token: response.tokens.accessToken,
    };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phoneNumber: data.confirmPassword, // Note: API might need adjustment for phone
        }),
      },
      false,
      false
    );

    setTokens(response.tokens.accessToken, response.tokens.refreshToken);

    const user: User = {
      id: response.user.id.toString(),
      email: response.user.email,
      name: response.user.name,
      role: 'user',
      phone: response.user.phoneNumber,
      createdAt: response.user.createdAt || new Date().toISOString(),
      updatedAt: response.user.updatedAt || new Date().toISOString(),
    };

    return {
      user,
      token: response.tokens.accessToken,
    };
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    // Note: Real API doesn't have forgot password endpoint yet
    return { message: 'Password reset functionality coming soon' };
  },

  async logout(): Promise<void> {
    clearTokens();
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiRequest<any>('/auth/profile', {}, true, false);

    return {
      id: response.id.toString(),
      email: response.email,
      name: response.name,
      role: 'user',
      phone: response.phoneNumber,
      createdAt: response.createdAt,
      updatedAt: new Date().toISOString(),
    };
  },
};
