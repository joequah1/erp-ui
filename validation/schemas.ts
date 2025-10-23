import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Brand schema
export const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255),
  visible: z.number().min(0).max(1).default(1),
  flag: z.number().min(0).max(1).default(0)
});

// Category schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255),
  parentId: z.string().optional()
});

// Product Type schema
export const productTypeSchema = z.object({
  name: z.string().min(1, 'Product type name is required').max(255)
});

// Inventory Item schema
export const inventoryItemSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(255),
  name: z.string().min(1, 'Product name is required').max(255),
  shortName: z.string().max(255).optional(),
  description: z.string().optional(),
  barcode: z.string().max(255).optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  sellingPrice: z.number().min(0, 'Invalid price').nullable(),
  costPrice: z.number().min(0, 'Invalid price').optional().nullable(),
  mainImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  brandId: z.string().optional(),
  supplierId: z.string().optional(),
  productTypeId: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.number().min(0).max(1).default(1),
  // Package Information
  courierType: z.enum(['Van', 'White Glove', 'Bulky']).optional().nullable(),
  assembly: z.boolean().optional(),
  packagingDetail: z.string().optional(),
  packagingType: z.string().optional(),
  parcelWeight: z.number().min(0, 'Parcel weight cannot be negative').optional().nullable(),
  parcelLength: z.number().min(0, 'Parcel length cannot be negative').optional().nullable(),
  parcelWidth: z.number().min(0, 'Parcel width cannot be negative').optional().nullable(),
  parcelHeight: z.number().min(0, 'Parcel height cannot be negative').optional().nullable(),
  // Product Information
  weight: z.number().min(0, 'Weight cannot be negative').optional().nullable(),
  length: z.number().min(0, 'Length cannot be negative').optional().nullable(),
  width: z.number().min(0, 'Width cannot be negative').optional().nullable(),
  height: z.number().min(0, 'Height cannot be negative').optional().nullable(),
  // Features - stored as JSON object
  features: z.record(z.string(), z.string()).optional()
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type BrandFormData = z.infer<typeof brandSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ProductTypeFormData = z.infer<typeof productTypeSchema>;
export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

// User schema
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal(''))
});

// Role schema
export const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required')
});

// Batch schema
export const batchSchema = z.object({
  containerNumber: z.string().min(3, 'Container number must be at least 3 characters'),
  eta: z.string().min(1, 'ETA is required'),
  arrivalDate: z.string().optional(),
  status: z.enum(['pending', 'in_transit', 'arrived', 'processing', 'completed', 'cancelled']),
  notes: z.string().optional()
});

// Batch Item schema
export const batchItemSchema = z.object({
  inventoryItemId: z.string().min(1, 'Inventory item is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  currency: z.string().min(3, 'Currency is required')
});

// Type exports
export type UserFormData = z.infer<typeof userSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type BatchFormData = z.infer<typeof batchSchema>;
export type BatchItemFormData = z.infer<typeof batchItemSchema>;
