export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'user';
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  ownerId: string;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  owner?: User;
  users?: ShopUser[];
}

export interface ShopUser {
  id: string;
  shopId: string;
  userId: string;
  role: 'owner' | 'admin' | 'user';
  permissions: string[];
  invitedAt: string;
  joinedAt?: string;
  status: 'pending' | 'active' | 'inactive';
  // Relations
  user?: User;
  shop?: Shop;
}

export interface ShopInvitation {
  id: string;
  shopId: string;
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
  invitedBy: string;
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  currentShop: Shop | null;
  userShops: Shop[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface Brand {
  id: string;
  shopId?: string;
  name: string;
  visible: number; // 0 or 1
  flag: number; // 0 or 1
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  shopId?: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  shopId?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  shopId?: string;
  createdBy?: string;
  brandId?: string;
  supplierId?: string;
  productTypeId?: string;
  categoryId?: string;
  sku: string;
  name: string;
  shortName?: string;
  description?: string;
  barcode?: string;
  stock: number;
  currency: string;
  sellingPrice: number; // API uses string for decimal precision
  costPrice?: number;
  mainImage?: string;
  status: number; // 0 = inactive, 1 = active
  // Package Information
  courierType?: 'Van' | 'White Glove' | 'Bulky';
  assembly?: boolean;
  packagingDetail?: string;
  packagingType?: string;
  parcelWeight?: number; // in kg
  parcelLength?: number; // in cm
  parcelWidth?: number; // in cm
  parcelHeight?: number; // in cm
  // Product Information (actual product dimensions)
  weight?: number; // in kg
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  // Features (JSON column in DB)
  features?: Record<string, string>; // { "warranty": "2 years", "color": "Black", etc. }
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relations
  brand?: Brand;
  category?: Category;
  productType?: ProductType;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FilterOptions {
  search?: string;
  brandId?: string;
  categoryId?: string;
  productTypeId?: string;
  warehouse?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface JobMonitor {
  id: string;
  type: 'import' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  filename: string;
  totalRows?: number;
  processedRows?: number;
  errors?: string[];
  createdAt: string;
  updatedAt: string;
}

// User Management Types
export interface Permission {
  id: string;
  name: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'import' | 'export';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  shopId: string;
  assignedBy: string;
  assignedAt: string;
  role?: Role;
  user?: User;
}

// Batch Management Types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate to SGD
}

export interface BatchItem {
  id: string;
  batchId: string;
  inventoryItemId: string;
  quantity: number;
  cost: number;
  currency: string;
  sgdCost: number; // Auto-converted cost in SGD
  createdAt: string;
  updatedAt: string;
  // Relations
  inventoryItem?: InventoryItem;
}

export interface Batch {
  id: string;
  shopId: string;
  containerNumber: string;
  eta: string; // Estimated Time of Arrival
  arrivalDate?: string; // Actual arrival date
  status: 'pending' | 'in_transit' | 'arrived' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  totalValue: number; // Total SGD value
  itemsCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  items?: BatchItem[];
  creator?: User;
}


// Product Inventory Trail Types
export type InventoryTrailType = 0 | 1 | 2 | 3 | 4; // 0=DEDUCTION, 1=ADDITION, 2=SET, 3=TRANSFER, 4=NO_CHANGE
export type InventoryTrailRelatedType = 'App\\Models\\Order' | 'App\\Models\\ProductListing' | 'App\\Models\\ProductInventory' | 'App\\Models\\ProductVariant';

export interface ProductInventoryTrail {
  id: number;
  productInventoryId: number;
  batchId?: number | null;
  shopId: number;
  userId: number;
  message: string;
  type: InventoryTrailType;
  relatedId?: string | null;
  relatedType?: InventoryTrailRelatedType | null;
  uniqueType?: string | null;
  uniqueId?: number | null;
  old: number;
  new: number;
  unitCost?: string | null;
  unitSellingPrice?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  user?: {
    id: number;
    name: string;
    email: string;
  };
  batch?: {
    id: number;
    name: string;
    containerNumber?: string;
  } | null;
}

export interface PaginatedProductInventoryTrail {
  data: ProductInventoryTrail[];
  total: number;
  page: number;
  limit: number;
}

// Product Listing Types
export interface ProductListing {
  id: number;
  shopId: number;
  accountId?: number;
  integrationId?: number;
  productId?: number;
  productVariantId?: number;
  integrationCategoryId?: number;
  accountCategoryId?: number;
  identifiers?: any;
  name?: string;
  options?: any;
  option1?: string;
  option2?: string;
  option3?: string;
  stock?: number;
  syncStock?: number; // boolean 0 or 1
  totalSold?: number;
  productUrl?: string;
  status?: number;
  lastImportedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Relations
  account?: {
    id: number;
    name: string;
    integrationId: number;
  };
  integration?: {
    id: number;
    name: string;
    thumbnailImage?: string;
  };
}

export interface PaginatedProductListing {
  data: ProductListing[];
  total: number;
  page: number;
  limit: number;
}
