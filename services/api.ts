import {
  User,
  Shop,
  ShopUser,
  ShopInvitation,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  Brand,
  Category,
  ProductType,
  InventoryItem,
  PaginatedResponse,
  FilterOptions,
  JobMonitor,
  Permission,
  Role,
  Currency,
  Batch,
  BatchItem
} from '../types';

// Real API imports - import directly from modular structure to avoid circular dependency
import {
  realAuthApi,
  realBrandsApi,
  realCategoriesApi,
  realProductTypesApi,
  realInventoryApi,
  realShopsApi,
  realBatchItemsApi,
  setTokens as realSetTokens,
  setShopId as realSetShopId,
  clearTokens as realClearTokens,
} from './realApi';

// Check if we should use the real API
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true';

// This will be easily changeable to your Laravel API URL
const API_BASE_URL = 'http://localhost:8000/api';

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const mockBrands: Brand[] = [
  { id: '1', name: 'Apple', visible: 1, flag: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Samsung', visible: 1, flag: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: 'Nike', visible: 1, flag: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Smartphones', parentId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: 'Laptops', parentId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', name: 'Clothing', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '5', name: 'Shoes', parentId: '4', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

const mockProductTypes: ProductType[] = [
  {
    id: '1',
    name: 'Physical Product',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Digital Product',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
];

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'APL-IPH15-BLK',
    name: 'iPhone 15 Black',
    shortName: 'IP15-BLK',
    description: 'Latest iPhone model in black color',
    barcode: '1234567890123',
    stock: 150,
    currency: 'USD',
    sellingPrice: 999,
    costPrice: 800,
    mainImage: '',
    brandId: '1',
    categoryId: '2',
    productTypeId: '1',
    status: 1,
    courierType: 'Van',
    assembly: false,
  packagingDetail: 'Standard retail packaging',
    weight: 0.2,
    length: 15,
    width: 7.5,
    height: 1,
    features: {
      'Warranty': '2 years',
      'Color': 'Black',
      'Storage': '256GB'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    sku: 'SAM-GAL24-WHT',
    name: 'Samsung Galaxy S24 White',
    shortName: 'GAL24-WHT',
    description: 'Latest Samsung flagship phone in white',
    barcode: '9876543210987',
    stock: 75,
    currency: 'USD',
    sellingPrice: 899,
    costPrice: 700,
    mainImage: '',
    brandId: '2',
    categoryId: '2',
    productTypeId: '1',
    status: 1,
    courierType: 'Van',
    assembly: false,
  packagingDetail: 'Original Samsung packaging',
    weight: 0.19,
    length: 14.5,
    width: 7,
    height: 0.9,
    features: {
      'Warranty': '1 year',
      'Color': 'White',
      'Storage': '128GB'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockJobs: JobMonitor[] = [];

// Mock data for user management
const mockPermissions: Permission[] = [
  // Inventory permissions
  { id: '1', name: 'inventory.create', module: 'inventory', action: 'create', description: 'Create inventory items' },
  { id: '2', name: 'inventory.read', module: 'inventory', action: 'read', description: 'View inventory items' },
  { id: '3', name: 'inventory.update', module: 'inventory', action: 'update', description: 'Update inventory items' },
  { id: '4', name: 'inventory.delete', module: 'inventory', action: 'delete', description: 'Delete inventory items' },
  { id: '5', name: 'inventory.import', module: 'inventory', action: 'import', description: 'Import inventory data' },
  { id: '6', name: 'inventory.export', module: 'inventory', action: 'export', description: 'Export inventory data' },
  // Brands permissions
  { id: '7', name: 'brands.create', module: 'brands', action: 'create', description: 'Create brands' },
  { id: '8', name: 'brands.read', module: 'brands', action: 'read', description: 'View brands' },
  { id: '9', name: 'brands.update', module: 'brands', action: 'update', description: 'Update brands' },
  { id: '10', name: 'brands.delete', module: 'brands', action: 'delete', description: 'Delete brands' },
  // Categories permissions
  { id: '11', name: 'categories.create', module: 'categories', action: 'create', description: 'Create categories' },
  { id: '12', name: 'categories.read', module: 'categories', action: 'read', description: 'View categories' },
  { id: '13', name: 'categories.update', module: 'categories', action: 'update', description: 'Update categories' },
  { id: '14', name: 'categories.delete', module: 'categories', action: 'delete', description: 'Delete categories' },
  // Batches permissions
  { id: '15', name: 'batches.create', module: 'batches', action: 'create', description: 'Create batches' },
  { id: '16', name: 'batches.read', module: 'batches', action: 'read', description: 'View batches' },
  { id: '17', name: 'batches.update', module: 'batches', action: 'update', description: 'Update batches' },
  { id: '18', name: 'batches.delete', module: 'batches', action: 'delete', description: 'Delete batches' },
  // Users permissions
  { id: '19', name: 'users.create', module: 'users', action: 'create', description: 'Create users' },
  { id: '20', name: 'users.read', module: 'users', action: 'read', description: 'View users' },
  { id: '21', name: 'users.update', module: 'users', action: 'update', description: 'Update users' },
  { id: '22', name: 'users.delete', module: 'users', action: 'delete', description: 'Delete users' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Owner',
    description: 'Full access to all features',
    permissions: mockPermissions,
    isSystem: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access with most permissions',
    permissions: mockPermissions.filter(p => !['users.delete'].includes(p.name)),
    isSystem: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Inventory and batch management',
    permissions: mockPermissions.filter(p => ['inventory', 'brands', 'categories', 'batches'].includes(p.module)),
    isSystem: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: mockPermissions.filter(p => p.action === 'read'),
    isSystem: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const mockCurrencies: Currency[] = [
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.74 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.68 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.59 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 109.85 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 5.32 },
];

const mockBatches: Batch[] = [
  {
    id: '1',
    shopId: '1',
    containerNumber: 'CONT-2024-001',
    eta: '2024-02-15',
    arrivalDate: '2024-02-14',
    status: 'completed',
    notes: 'Electronics shipment from China',
    totalValue: 25000,
    itemsCount: 150,
    createdBy: '1',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-14'
  },
  {
    id: '2',
    shopId: '1',
    containerNumber: 'CONT-2024-002',
    eta: '2024-03-01',
    status: 'in_transit',
    notes: 'Fashion items from Vietnam',
    totalValue: 18500,
    itemsCount: 200,
    createdBy: '1',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  }
];

const mockBatchItems: BatchItem[] = [
  {
    id: '1',
    batchId: '1',
    inventoryItemId: '1',
    quantity: 50,
    cost: 600,
    currency: 'USD',
    sgdCost: 810.81, // 600 / 0.74
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    batchId: '1',
    inventoryItemId: '2',
    quantity: 30,
    cost: 500,
    currency: 'USD',
    sgdCost: 675.68, // 500 / 0.74
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API (Mock)
const mockAuthApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await delay(1000);

    if (mockUsers.find(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }

    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockUsers.push(user);

    return {
      user,
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    await delay(1200);
    
    return {
      message: 'Password reset email sent successfully'
    };
  },

  async logout(): Promise<void> {
    await delay(300);
  },

  async getCurrentUser(): Promise<User> {
    await delay(500);
    return mockUsers[0]; // Return mock user
  }
};

// Brands API (Mock)
const mockBrandsApi = {
  async getAll(): Promise<Brand[]> {
    await delay(300);
    return [...mockBrands];
  },

  async getById(id: string): Promise<Brand> {
    await delay(300);
    const brand = mockBrands.find(b => b.id === id);
    if (!brand) throw new Error('Brand not found');
    return brand;
  },

  async create(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
    await delay(500);
    const brand: Brand = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockBrands.push(brand);
    return brand;
  },

  async update(id: string, data: Partial<Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Brand> {
    await delay(500);
    const index = mockBrands.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Brand not found');
    
    mockBrands[index] = {
      ...mockBrands[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockBrands[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockBrands.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Brand not found');
    mockBrands.splice(index, 1);
  }
};

// Categories API (Mock)
const mockCategoriesApi = {
  async getAll(): Promise<Category[]> {
    await delay(300);
    return buildCategoryTree([...mockCategories]);
  },

  async getById(id: string): Promise<Category> {
    await delay(300);
    const category = mockCategories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  },

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>): Promise<Category> {
    await delay(500);
    const category: Category = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCategories.push(category);
    return category;
  },

  async update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>>): Promise<Category> {
    await delay(500);
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    mockCategories[index] = {
      ...mockCategories[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockCategories[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    mockCategories.splice(index, 1);
  }
};

// Product Types API (Mock)
const mockProductTypesApi = {
  async getAll(): Promise<ProductType[]> {
    await delay(300);
    return [...mockProductTypes];
  },

  async getById(id: string): Promise<ProductType> {
    await delay(300);
    const productType = mockProductTypes.find(pt => pt.id === id);
    if (!productType) throw new Error('Product type not found');
    return productType;
  },

  async create(data: Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductType> {
    await delay(500);
    const productType: ProductType = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProductTypes.push(productType);
    return productType;
  },

  async update(id: string, data: Partial<Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ProductType> {
    await delay(500);
    const index = mockProductTypes.findIndex(pt => pt.id === id);
    if (index === -1) throw new Error('Product type not found');
    
    mockProductTypes[index] = {
      ...mockProductTypes[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockProductTypes[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockProductTypes.findIndex(pt => pt.id === id);
    if (index === -1) throw new Error('Product type not found');
    mockProductTypes.splice(index, 1);
  }
};

// Inventory API (Mock)
const mockInventoryApi = {
  async getAll(filters: FilterOptions = {}): Promise<PaginatedResponse<InventoryItem>> {
    await delay(500);
    
    let filteredItems = [...mockInventoryItems];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.sku.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search)
      );
    }

    // Apply brand filter
    if (filters.brandId) {
      filteredItems = filteredItems.filter(item => item.brandId === filters.brandId);
    }

    // Apply category filter
    if (filters.categoryId) {
      filteredItems = filteredItems.filter(item => item.categoryId === filters.categoryId);
    }

    // Apply product type filter
    if (filters.productTypeId) {
      filteredItems = filteredItems.filter(item => item.productTypeId === filters.productTypeId);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredItems.sort((a, b) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const perPage = filters.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    // Add relations
    const itemsWithRelations = paginatedItems.map(item => ({
      ...item,
      brand: mockBrands.find(b => b.id === item.brandId),
      category: mockCategories.find(c => c.id === item.categoryId),
      productType: mockProductTypes.find(pt => pt.id === item.productTypeId)
    }));
    
    return {
      data: itemsWithRelations,
      meta: {
        current_page: page,
        last_page: Math.ceil(filteredItems.length / perPage),
        per_page: perPage,
        total: filteredItems.length
      }
    };
  },

  async getById(id: string): Promise<InventoryItem> {
    await delay(300);
    const item = mockInventoryItems.find(i => i.id === id);
    if (!item) throw new Error('Inventory item not found');
    
    return {
      ...item,
      brand: mockBrands.find(b => b.id === item.brandId),
      category: mockCategories.find(c => c.id === item.categoryId),
      productType: mockProductTypes.find(pt => pt.id === item.productTypeId)
    };
  },

  async create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'category' | 'productType'>): Promise<InventoryItem> {
    await delay(800);
    const item: InventoryItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockInventoryItems.push(item);
    return item;
  },

  async update(id: string, data: Partial<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'category' | 'productType'>>): Promise<InventoryItem> {
    await delay(800);
    const index = mockInventoryItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    
    mockInventoryItems[index] = {
      ...mockInventoryItems[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockInventoryItems[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockInventoryItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    mockInventoryItems.splice(index, 1);
  }
};

// Jobs API for bulk operations
export const jobsApi = {
  async startImport(file: File, template: string): Promise<JobMonitor> {
    await delay(500);
    
    const job: JobMonitor = {
      id: Date.now().toString(),
      type: 'import',
      status: 'pending',
      progress: 0,
      filename: file.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockJobs.push(job);
    
    // Simulate job progress
    setTimeout(() => {
      job.status = 'processing';
      job.progress = 25;
      job.totalRows = 100;
      job.processedRows = 25;
    }, 1000);
    
    setTimeout(() => {
      job.status = 'completed';
      job.progress = 100;
      job.processedRows = 100;
    }, 3000);
    
    return job;
  },

  async startExport(filters: FilterOptions, template: string): Promise<JobMonitor> {
    await delay(500);
    
    const job: JobMonitor = {
      id: Date.now().toString(),
      type: 'export',
      status: 'pending',
      progress: 0,
      filename: `inventory-export-${Date.now()}.xlsx`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockJobs.push(job);
    
    // Simulate job progress
    setTimeout(() => {
      job.status = 'processing';
      job.progress = 50;
    }, 800);
    
    setTimeout(() => {
      job.status = 'completed';
      job.progress = 100;
    }, 2000);
    
    return job;
  },

  async getJob(id: string): Promise<JobMonitor> {
    await delay(200);
    const job = mockJobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');
    return job;
  },

  async getAllJobs(): Promise<JobMonitor[]> {
    await delay(300);
    return [...mockJobs].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};

// Helper function to build category tree
function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const roots: Category[] = [];
  
  // Create map and initialize children arrays
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });
  
  // Build tree structure
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children!.push(category);
      }
    } else {
      roots.push(category);
    }
  });
  
  return roots;
}

// Users & Roles API
export const usersApi = {
  async getAll(): Promise<User[]> {
    await delay(300);
    return [...mockUsers];
  },

  async getById(id: string): Promise<User> {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await delay(500);
    const user: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers.push(user);
    return user;
  },

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockUsers[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
  }
};

// Roles API
export const rolesApi = {
  async getAll(): Promise<Role[]> {
    await delay(300);
    return [...mockRoles];
  },

  async getById(id: string): Promise<Role> {
    await delay(300);
    const role = mockRoles.find(r => r.id === id);
    if (!role) throw new Error('Role not found');
    return role;
  },

  async create(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    await delay(500);
    const role: Role = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockRoles.push(role);
    return role;
  },

  async update(id: string, data: Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Role> {
    await delay(500);
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    
    mockRoles[index] = {
      ...mockRoles[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockRoles[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    if (mockRoles[index].isSystem) throw new Error('Cannot delete system role');
    mockRoles.splice(index, 1);
  }
};

// Permissions API
export const permissionsApi = {
  async getAll(): Promise<Permission[]> {
    await delay(300);
    return [...mockPermissions];
  }
};

// Batches API
export const batchesApi = {
  async getAll(filters: FilterOptions = {}): Promise<PaginatedResponse<Batch>> {
    await delay(500);
    
    let filteredBatches = [...mockBatches];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredBatches = filteredBatches.filter(batch => 
        batch.containerNumber.toLowerCase().includes(search) ||
        (batch.notes && batch.notes.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredBatches.sort((a, b) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const perPage = filters.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    const paginatedBatches = filteredBatches.slice(startIndex, endIndex);
    
    return {
      data: paginatedBatches,
      meta: {
        current_page: page,
        last_page: Math.ceil(filteredBatches.length / perPage),
        per_page: perPage,
        total: filteredBatches.length
      }
    };
  },

  async getById(id: string): Promise<Batch> {
    await delay(300);
    const batch = mockBatches.find(b => b.id === id);
    if (!batch) throw new Error('Batch not found');
    
    // Add batch items
    const items = mockBatchItems.filter(item => item.batchId === id).map(item => ({
      ...item,
      inventoryItem: mockInventoryItems.find(inv => inv.id === item.inventoryItemId)
    }));
    
    return { ...batch, items };
  },

  async create(data: Omit<Batch, 'id' | 'createdAt' | 'updatedAt' | 'totalValue' | 'itemsCount'>): Promise<Batch> {
    await delay(800);
    const batch: Batch = {
      ...data,
      id: Date.now().toString(),
      totalValue: 0,
      itemsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockBatches.push(batch);
    return batch;
  },

  async update(id: string, data: Partial<Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Batch> {
    await delay(800);
    const index = mockBatches.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Batch not found');
    
    mockBatches[index] = {
      ...mockBatches[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockBatches[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockBatches.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Batch not found');
    mockBatches.splice(index, 1);
    
    // Remove associated batch items
    const itemIndices = mockBatchItems.map((item, idx) => item.batchId === id ? idx : -1).filter(idx => idx !== -1);
    itemIndices.reverse().forEach(idx => mockBatchItems.splice(idx, 1));
  }
};

// Batch Items API (Mock)
const mockBatchItemsApi = {
  async getByBatchId(batchId: string): Promise<BatchItem[]> {
    await delay(300);
    return mockBatchItems.filter(item => item.batchId === batchId).map(item => ({
      ...item,
      inventoryItem: mockInventoryItems.find(inv => inv.id === item.inventoryItemId)
    }));
  },

  async getByInventoryItemId(inventoryItemId: string): Promise<Array<Batch & { batchItem: BatchItem }>> {
    await delay(300);
    // Find all batch items for this inventory item
    const items = mockBatchItems.filter(item => item.inventoryItemId === inventoryItemId);

    // Get the batches and combine with batch item data
    return items.map(item => {
      const batch = mockBatches.find(b => b.id === item.batchId);
      if (!batch) return null;
      return {
        ...batch,
        batchItem: item
      };
    }).filter((b): b is Batch & { batchItem: BatchItem } => b !== null);
  },

  async create(data: Omit<BatchItem, 'id' | 'createdAt' | 'updatedAt' | 'sgdCost'>): Promise<BatchItem> {
    await delay(500);

    // Calculate SGD cost
    const currency = mockCurrencies.find(c => c.code === data.currency);
    const sgdCost = currency ? data.cost / currency.rate : data.cost;

    const item: BatchItem = {
      ...data,
      id: Date.now().toString(),
      sgdCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockBatchItems.push(item);

    // Update batch totals
    const batch = mockBatches.find(b => b.id === data.batchId);
    if (batch) {
      const batchItems = mockBatchItems.filter(bi => bi.batchId === data.batchId);
      batch.totalValue = batchItems.reduce((sum, bi) => sum + (bi.sgdCost * bi.quantity), 0);
      batch.itemsCount = batchItems.reduce((sum, bi) => sum + bi.quantity, 0);
    }

    return item;
  },

  async update(id: string, data: Partial<Omit<BatchItem, 'id' | 'createdAt' | 'updatedAt' | 'sgdCost'>>): Promise<BatchItem> {
    await delay(500);
    const index = mockBatchItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Batch item not found');

    const updatedData = { ...mockBatchItems[index], ...data };

    // Recalculate SGD cost if currency or cost changed
    if (data.currency || data.cost) {
      const currency = mockCurrencies.find(c => c.code === updatedData.currency);
      updatedData.sgdCost = currency ? updatedData.cost / currency.rate : updatedData.cost;
    }

    mockBatchItems[index] = {
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    // Update batch totals
    const batch = mockBatches.find(b => b.id === mockBatchItems[index].batchId);
    if (batch) {
      const batchItems = mockBatchItems.filter(bi => bi.batchId === batch.id);
      batch.totalValue = batchItems.reduce((sum, bi) => sum + (bi.sgdCost * bi.quantity), 0);
      batch.itemsCount = batchItems.reduce((sum, bi) => sum + bi.quantity, 0);
    }

    return mockBatchItems[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockBatchItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Batch item not found');

    const batchId = mockBatchItems[index].batchId;
    mockBatchItems.splice(index, 1);

    // Update batch totals
    const batch = mockBatches.find(b => b.id === batchId);
    if (batch) {
      const batchItems = mockBatchItems.filter(bi => bi.batchId === batchId);
      batch.totalValue = batchItems.reduce((sum, bi) => sum + (bi.sgdCost * bi.quantity), 0);
      batch.itemsCount = batchItems.reduce((sum, bi) => sum + bi.quantity, 0);
    }
  }
};

// Currencies API
const mockCurrenciesApi = {
  async getAll(): Promise<Currency[]> {
    await delay(200);
    return [...mockCurrencies];
  }
};

// Export wrappers that toggle between mock and real API
export const authApi = USE_REAL_API ? realAuthApi : mockAuthApi;
export const brandsApi = USE_REAL_API ? realBrandsApi : mockBrandsApi;
export const categoriesApi = USE_REAL_API ? realCategoriesApi : mockCategoriesApi;
export const productTypesApi = USE_REAL_API ? realProductTypesApi : mockProductTypesApi;
export const inventoryApi = USE_REAL_API ? realInventoryApi : mockInventoryApi;
export const batchItemsApi = USE_REAL_API ? realBatchItemsApi : mockBatchItemsApi;
export const currenciesApi = mockCurrenciesApi; // No real API for this yet

// Helper functions for real API token management
export const setTokens = USE_REAL_API ? realSetTokens : () => {};
export const setShopId = USE_REAL_API ? realSetShopId : () => {};
export const clearTokens = USE_REAL_API ? realClearTokens : () => {};