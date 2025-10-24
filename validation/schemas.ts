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
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal(''))
});

// Category schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  parentId: z.string().optional(),
  description: z.string().optional()
});

// Product Type schema
export const productTypeSchema = z.object({
  name: z.string().min(2, 'Product type name must be at least 2 characters'),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional().default({})
});

// Inventory Item schema
export const inventoryItemSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  retailPrice: z.number().min(0, 'Retail price cannot be negative'),
  orientalPrice: z.number().min(0, 'Oriental price cannot be negative'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  productTypeId: z.string().min(1, 'Product type is required'),
  warehouse: z.string().min(2, 'Warehouse must be at least 2 characters'),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0)
  }).optional(),
  courier: z.string().optional(),
  assembly: z.boolean().optional().default(false),
  dynamicFeatures: z.record(z.string(), z.any()).optional().default({})
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
