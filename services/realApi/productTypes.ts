import { ProductType } from '../../types';
import { apiRequest } from './config';

// Product Types API
export const realProductTypesApi = {
  async getAll(): Promise<ProductType[]> {
    const response = await apiRequest<{ data: any[] }>('/product-types?limit=100');
    return response.data.map((item) => ({
      id: item.id.toString(),
      shopId: item.shopId?.toString(),
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt || item.createdAt,
    }));
  },

  async getById(id: string): Promise<ProductType> {
    const response = await apiRequest<any>(`/product-types/${id}`);
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async create(data: Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductType> {
    const response = await apiRequest<any>('/product-types', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async update(id: string, data: Partial<Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ProductType> {
    const response = await apiRequest<any>(`/product-types/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: data.name,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/product-types/${id}`, { method: 'DELETE' });
  },
};
