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
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  quantity: number;
  cost: number;
  retailPrice: number;
  orientalPrice: number;
  brandId: string;
  categoryId: string;
  productTypeId: string;
  warehouse: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  courier?: string;
  assembly?: boolean;
  dynamicFeatures: Record<string, any>;
  createdAt: string;
  updatedAt: string;
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
