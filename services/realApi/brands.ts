import { Brand } from '../../types';
import { apiRequest } from './config';

// Brands API
export const realBrandsApi = {
  async getAll(): Promise<Brand[]> {
    const response = await apiRequest<{ data: any[] }>('/brands?limit=100');
    return response.data.map((item) => ({
      id: item.id.toString(),
      shopId: item.shopId?.toString(),
      name: item.name,
      visible: item.visible ?? 1,
      flag: item.flag ?? 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt || item.createdAt,
    }));
  },

  async getById(id: string): Promise<Brand> {
    const response = await apiRequest<any>(`/brands/${id}`);
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      visible: response.visible ?? 1,
      flag: response.flag ?? 0,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async create(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
    const response = await apiRequest<any>('/brands', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        visible: data.visible ?? 1,
        flag: data.flag ?? 0,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      visible: response.visible ?? 1,
      flag: response.flag ?? 0,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async update(id: string, data: Partial<Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Brand> {
    const response = await apiRequest<any>(`/brands/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: data.name,
        visible: data.visible,
        flag: data.flag,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      visible: response.visible ?? 1,
      flag: response.flag ?? 0,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/brands/${id}`, { method: 'DELETE' });
  },
};
