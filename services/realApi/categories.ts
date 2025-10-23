import { Category } from '../../types';
import { apiRequest } from './config';

// Categories API
export const realCategoriesApi = {
  async getAll(): Promise<Category[]> {
    const response = await apiRequest<{ data: any[] }>('/product-categories?limit=100');
    return response.data.map((item) => ({
      id: item.id.toString(),
      shopId: item.shopId?.toString(),
      name: item.name,
      parentId: item.parentId?.toString(),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt || item.createdAt,
    }));
  },

  async getById(id: string): Promise<Category> {
    const response = await apiRequest<any>(`/product-categories/${id}`);
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      parentId: response.parentId?.toString(),
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>): Promise<Category> {
    const response = await apiRequest<any>('/product-categories', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        parentId: data.parentId ? parseInt(data.parentId) : undefined,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      parentId: response.parentId?.toString(),
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>>): Promise<Category> {
    const response = await apiRequest<any>(`/product-categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: data.name,
        parentId: data.parentId ? parseInt(data.parentId) : undefined,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      name: response.name,
      parentId: response.parentId?.toString(),
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/product-categories/${id}`, { method: 'DELETE' });
  },
};
