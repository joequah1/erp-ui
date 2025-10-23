import { InventoryItem, PaginatedResponse, FilterOptions } from '../../types';
import { apiRequest } from './config';

// Inventory API
export const realInventoryApi = {
  async getAll(filters: FilterOptions = {}): Promise<PaginatedResponse<InventoryItem>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Map perPage to limit for API compatibility
        if (key === 'perPage') {
          params.append('limit', value.toString());
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiRequest<{ data: any[]; total: number; page: number; limit: number }>(
      `/product-inventory?${params.toString()}`
    );

    const items = response.data.map((item) => ({
      id: item.id.toString(),
      shopId: item.shopId?.toString(),
      createdBy: item.createdBy?.toString(),
      brandId: item.brandId?.toString(),
      supplierId: item.supplierId?.toString(),
      productTypeId: item.productTypeId?.toString(),
      categoryId: item.categoryId?.toString(),
      sku: item.sku || '',
      name: item.name || '',
      shortName: item.shortName,
      description: item.description,
      barcode: item.barcode,
      stock: item.stock || 0,
      currency: item.currency || 'USD',
      sellingPrice: item.sellingPrice || '0',
      costPrice: item.costPrice,
      mainImage: item.mainImage,
      status: item.status ?? 1,
      // Package Information
      courierType: item.courierType,
      assembly: item.assembly,
      packagingDetail: item.packagingDetail,
      packagingType: item.packagingType,
      parcelWeight: item.parcelWeight,
      parcelLength: item.parcelLength,
      parcelWidth: item.parcelWidth,
      parcelHeight: item.parcelHeight,
      // Product Dimensions
      weight: item.weight,
      length: item.length,
      width: item.width,
      height: item.height,
      // Features
      features: item.features,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt || item.createdAt,
    }));

    return {
      data: items,
      meta: {
        current_page: response.page,
        last_page: Math.ceil(response.total / response.limit),
        per_page: response.limit,
        total: response.total,
      },
    };
  },

  async getById(id: string): Promise<InventoryItem> {
    const response = await apiRequest<any>(`/product-inventory/${id}`);
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      createdBy: response.createdBy?.toString(),
      brandId: response.brandId?.toString(),
      supplierId: response.supplierId?.toString(),
      productTypeId: response.productTypeId?.toString(),
      categoryId: response.categoryId?.toString(),
      sku: response.sku || '',
      name: response.name || '',
      shortName: response.shortName,
      description: response.description,
      barcode: response.barcode,
      stock: response.stock || 0,
      currency: response.currency || 'USD',
      sellingPrice: response.sellingPrice || '0',
      costPrice: response.costPrice,
      mainImage: response.mainImage,
      status: response.status ?? 1,
      // Relationship objects (return full object)
      brand: response.brand ?? undefined,
      category: response.category ?? undefined,
      productType: response.productType ?? undefined,
      // Package Information
      courierType: response.courierType,
      assembly: response.assembly,
      packagingDetail: response.packagingDetail,
      packagingType: response.packagingType,
      parcelWeight: response.parcelWeight,
      parcelLength: response.parcelLength,
      parcelWidth: response.parcelWidth,
      parcelHeight: response.parcelHeight,
      // Product Dimensions
      weight: response.weight,
      length: response.length,
      width: response.width,
      height: response.height,
      // Features
      features: response.features,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'category' | 'productType'>): Promise<InventoryItem> {
    const response = await apiRequest<any>('/product-inventory', {
      method: 'POST',
      body: JSON.stringify({
        sku: data.sku,
        name: data.name,
        shortName: data.shortName,
        description: data.description,
        barcode: data.barcode,
        stock: data.stock,
        currency: data.currency,
        sellingPrice: data.sellingPrice,
        costPrice: data.costPrice,
        mainImage: data.mainImage,
        brandId: data.brandId ? parseInt(data.brandId) : undefined,
        supplierId: data.supplierId ? parseInt(data.supplierId) : undefined,
        categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
        productTypeId: data.productTypeId ? parseInt(data.productTypeId) : undefined,
        status: data.status ?? 1,
        // Package Information
        courierType: data.courierType,
        assembly: data.assembly,
        packagingDetail: data.packagingDetail,
        packagingType: data.packagingType,
        parcelWeight: data.parcelWeight,
        parcelLength: data.parcelLength,
        parcelWidth: data.parcelWidth,
        parcelHeight: data.parcelHeight,
        // Product Dimensions
        weight: data.weight,
        length: data.length,
        width: data.width,
        height: data.height,
        // Features
        features: data.features,
      }),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      createdBy: response.createdBy?.toString(),
      brandId: response.brandId?.toString(),
      supplierId: response.supplierId?.toString(),
      productTypeId: response.productTypeId?.toString(),
      categoryId: response.categoryId?.toString(),
      sku: response.sku || '',
      name: response.name || '',
      shortName: response.shortName,
      description: response.description,
      barcode: response.barcode,
      stock: response.stock || 0,
      currency: response.currency || 'USD',
      sellingPrice: response.sellingPrice || '0',
      costPrice: response.costPrice,
      mainImage: response.mainImage,
      status: response.status ?? 1,
      // Package Information
      courierType: response.courierType,
      assembly: response.assembly,
      packagingDetail: response.packagingDetail,
      packagingType: response.packagingType,
      parcelWeight: response.parcelWeight,
      parcelLength: response.parcelLength,
      parcelWidth: response.parcelWidth,
      parcelHeight: response.parcelHeight,
      // Product Dimensions
      weight: response.weight,
      length: response.length,
      width: response.width,
      height: response.height,
      // Features
      features: response.features,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async update(id: string, data: Partial<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'category' | 'productType'>>): Promise<InventoryItem> {
    const updateData: any = {};
    if (data.sku) updateData.sku = data.sku;
    if (data.name) updateData.name = data.name;
    if (data.shortName !== undefined) updateData.shortName = data.shortName;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.currency) updateData.currency = data.currency;
    if (data.sellingPrice !== undefined) updateData.sellingPrice = data.sellingPrice;
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice;
    if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.brandId !== undefined) updateData.brandId = data.brandId ? parseInt(data.brandId) : undefined;
    if (data.supplierId !== undefined) updateData.supplierId = data.supplierId ? parseInt(data.supplierId) : undefined;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId ? parseInt(data.categoryId) : undefined;
    if (data.productTypeId !== undefined) updateData.productTypeId = data.productTypeId ? parseInt(data.productTypeId) : undefined;
    // Package Information
    if (data.courierType !== undefined) updateData.courierType = data.courierType;
    if (data.assembly !== undefined) updateData.assembly = data.assembly;
    if (data.packagingDetail !== undefined) updateData.packagingDetail = data.packagingDetail;
    if (data.packagingType !== undefined) updateData.packagingType = data.packagingType;
    if (data.parcelWeight !== undefined) updateData.parcelWeight = data.parcelWeight;
    if (data.parcelLength !== undefined) updateData.parcelLength = data.parcelLength;
    if (data.parcelWidth !== undefined) updateData.parcelWidth = data.parcelWidth;
    if (data.parcelHeight !== undefined) updateData.parcelHeight = data.parcelHeight;
    // Product Dimensions
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.length !== undefined) updateData.length = data.length;
    if (data.width !== undefined) updateData.width = data.width;
    if (data.height !== undefined) updateData.height = data.height;
    // Features
    if (data.features !== undefined) updateData.features = data.features;

    const response = await apiRequest<any>(`/product-inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return {
      id: response.id.toString(),
      shopId: response.shopId?.toString(),
      createdBy: response.createdBy?.toString(),
      brandId: response.brandId?.toString(),
      supplierId: response.supplierId?.toString(),
      productTypeId: response.productTypeId?.toString(),
      categoryId: response.categoryId?.toString(),
      sku: response.sku || '',
      name: response.name || '',
      shortName: response.shortName,
      description: response.description,
      barcode: response.barcode,
      stock: response.stock || 0,
      currency: response.currency || 'USD',
      sellingPrice: response.sellingPrice || '0',
      costPrice: response.costPrice,
      mainImage: response.mainImage,
      status: response.status ?? 1,
      // Package Information
      courierType: response.courierType,
      assembly: response.assembly,
      packagingDetail: response.packagingDetail,
      packagingType: response.packagingType,
      parcelWeight: response.parcelWeight,
      parcelLength: response.parcelLength,
      parcelWidth: response.parcelWidth,
      parcelHeight: response.parcelHeight,
      // Product Dimensions
      weight: response.weight,
      length: response.length,
      width: response.width,
      height: response.height,
      // Features
      features: response.features,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt || response.createdAt,
    };
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/product-inventory/${id}`, { method: 'DELETE' });
  },
};
