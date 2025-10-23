import { apiRequest } from './config';

// Batch Items API
export const realBatchItemsApi = {
  async getByInventoryItemId(inventoryItemId: string): Promise<any[]> {
    try {
      const response = await apiRequest<{ data: any[]; total: number; page: number; limit: number }>(
        `/product-inventory/${inventoryItemId}/batches?page=1&limit=100`
      );

      // Transform the API response to match the expected format
      return response.data.map((item: any) => ({
        id: item.id?.toString() || item.batchId?.toString(),
        batchId: item.batchId?.toString(),
        inventoryId: item.inventoryId?.toString(),
        locationId: item.locationId?.toString(),
        containerNumber: item.batch?.containerNumber || 'N/A',
        eta: item.batch?.eta || new Date().toISOString(),
        restockDate: item.batch?.restockDate,
        arrivalDate: item.completedAt,
        status: item.status === 1 ? 'active' : item.status === 2 ? 'completed' : 'pending',
        location: item.location?.name,
        batchItem: {
          quantity: item.stock || 0,
          cost: parseFloat(item.cost || '0'),
          originCost: parseFloat(item.originCost || '0'),
          landedCost: parseFloat(item.landedCost || '0'),
          commission: parseFloat(item.commission || '0'),
          surcharge: parseFloat(item.surcharge || '0'),
          subtotal: parseFloat(item.subtotal || '0'),
          shippingCost: parseFloat(item.shippingCost || '0'),
          currency: item.currency || 'USD',
          sold: item.sold || 0,
          expiryDate: item.expiryDate,
          priority: item.priority || 1,
        },
        batch: item.batch,
      }));
    } catch (error) {
      console.error('Failed to fetch batch history:', error);
      return [];
    }
  },

  async getByBatchId(batchId: string): Promise<any[]> {
    throw new Error('Batch items by batch ID endpoint not implemented in real API yet');
  },

  async create(data: any): Promise<any> {
    throw new Error('Batch item creation endpoint not implemented in real API yet');
  },

  async update(id: string, data: any): Promise<any> {
    throw new Error('Batch item update endpoint not implemented in real API yet');
  },

  async delete(id: string): Promise<void> {
    throw new Error('Batch item deletion endpoint not implemented in real API yet');
  },
};
