import { apiRequest } from './realApi';
import { User } from '@/types';

export interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileApi = {
  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    return apiRequest<User>(`/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }, true, false); // requiresAuth = true, requiresShop = false
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }, true, false); // requiresAuth = true, requiresShop = false
  },

  async getCurrentProfile(): Promise<User> {
    return apiRequest<User>('/auth/profile', {}, true, false);
  },
};
