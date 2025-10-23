import { apiRequest } from './config';

// Shop Management
export const realShopsApi = {
  async getMyShops(): Promise<any[]> {
    const response = await apiRequest<any[]>('/users/me/shops', {}, true, false);
    return response;
  },
};
