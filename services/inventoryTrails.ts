import { apiRequest } from './realApi';
import { PaginatedProductInventoryTrail } from '@/types';

export interface InventoryTrailFilters {
  page?: number;
  limit?: number;
  type?: number;
  relatedType?: string;
  batchId?: number;
}

export const inventoryTrailsApi = {
  async getByInventoryId(
    inventoryId: string,
    filters?: InventoryTrailFilters
  ): Promise<PaginatedProductInventoryTrail> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type !== undefined) params.append('type', filters.type.toString());
    if (filters?.relatedType) params.append('relatedType', filters.relatedType);
    if (filters?.batchId) params.append('batchId', filters.batchId.toString());

    const queryString = params.toString();
    const endpoint = `/product-inventory/${inventoryId}/trails${queryString ? '?' + queryString : ''}`;

    return apiRequest<PaginatedProductInventoryTrail>(endpoint);
  },

  async getById(id: string) {
    return apiRequest<any>(`/product-inventory-trails/${id}`);
  },
};
