import { apiRequest } from './realApi';
import { PaginatedProductListing } from '@/types';

export interface ProductListingFilters {
  page?: number;
  limit?: number;
  accountId?: number;
  integrationId?: number;
  productId?: number;
  productVariantId?: number;
  status?: number;
}

export const productListingsApi = {
  async getAll(filters?: ProductListingFilters): Promise<PaginatedProductListing> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.accountId) params.append('accountId', filters.accountId.toString());
    if (filters?.integrationId) params.append('integrationId', filters.integrationId.toString());
    if (filters?.productId) params.append('productId', filters.productId.toString());
    if (filters?.productVariantId) params.append('productVariantId', filters.productVariantId.toString());
    if (filters?.status !== undefined) params.append('status', filters.status.toString());

    const queryString = params.toString();
    const endpoint = `/product-listings${queryString ? '?' + queryString : ''}`;

    return apiRequest<PaginatedProductListing>(endpoint);
  },

  async getByInventoryId(
    inventoryId: string,
    filters?: ProductListingFilters
  ): Promise<PaginatedProductListing> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.accountId) params.append('accountId', filters.accountId.toString());
    if (filters?.integrationId) params.append('integrationId', filters.integrationId.toString());
    if (filters?.status !== undefined) params.append('status', filters.status.toString());

    const queryString = params.toString();
    const endpoint = `/product-inventory/${inventoryId}/listings${queryString ? '?' + queryString : ''}`;

    return apiRequest<PaginatedProductListing>(endpoint);
  },

  async getById(id: string) {
    return apiRequest<any>(`/product-listings/${id}`);
  },
};
