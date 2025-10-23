# API Services Structure

This directory contains the refactored API service modules for the ERP UI application.

## Directory Structure

```
services/
├── realApi/                  # Modular API services
│   ├── config.ts            # Core API configuration and utilities
│   ├── auth.ts              # Authentication API
│   ├── brands.ts            # Brands API
│   ├── categories.ts        # Categories API
│   ├── productTypes.ts      # Product Types API
│   ├── inventory.ts         # Inventory API
│   ├── shops.ts             # Shops API
│   ├── batches.ts           # Batch Items API
│   └── index.ts             # Barrel export file
├── realApi.ts               # Re-exports from realApi/ directory
├── api.ts                   # Mock/Real API facade (toggles between mock and real)
├── productListings.ts       # Product Listings service
├── inventoryTrails.ts       # Inventory Trails service
└── profile.ts               # Profile service
```

## Usage

### Recommended Approach

Import from `realApi.ts` which re-exports from the modular directory:

```typescript
// Import specific modules
import { realAuthApi } from '@/services/realApi';
import { realBrandsApi } from '@/services/realApi';
import { realInventoryApi } from '@/services/realApi';

// Import utilities
import { apiRequest, setTokens, getTokens, clearTokens } from '@/services/realApi';
```

### Alternative (Direct Import)

You can also import directly from the modular structure:

```typescript
import { realAuthApi } from '@/services/realApi/auth';
import { realBrandsApi } from '@/services/realApi/brands';
```

### Mock/Real API Facade

Use `services/api.ts` which automatically toggles between mock and real API based on environment:

```typescript
// This will use real or mock API based on NEXT_PUBLIC_USE_MOCK_API env var
import { authApi, inventoryApi } from '@/services/api';
```

## Modules

### `config.ts`
Core API configuration including:
- `API_BASE_URL`: Base URL for API requests
- `apiRequest()`: Generic API request handler with auth and error handling
- `setTokens()`: Store access and refresh tokens
- `getTokens()`: Retrieve stored tokens
- `clearTokens()`: Clear all stored tokens
- `setShopId()`: Set current shop ID

### `auth.ts`
Authentication operations:
- `login()`: User login
- `register()`: User registration
- `logout()`: User logout
- `getCurrentUser()`: Get current user profile
- `forgotPassword()`: Password reset (placeholder)

### `brands.ts`
Brand management:
- `getAll()`: Get all brands
- `getById(id)`: Get brand by ID
- `create(data)`: Create new brand
- `update(id, data)`: Update brand
- `delete(id)`: Delete brand

### `categories.ts`
Category management:
- `getAll()`: Get all categories
- `getById(id)`: Get category by ID
- `create(data)`: Create new category
- `update(id, data)`: Update category
- `delete(id)`: Delete category

### `productTypes.ts`
Product type management:
- `getAll()`: Get all product types
- `getById(id)`: Get product type by ID
- `create(data)`: Create new product type
- `update(id, data)`: Update product type
- `delete(id)`: Delete product type

### `inventory.ts`
Inventory management:
- `getAll(filters)`: Get all inventory items with pagination
- `getById(id)`: Get inventory item by ID
- `create(data)`: Create new inventory item
- `update(id, data)`: Update inventory item
- `delete(id)`: Delete inventory item

### `shops.ts`
Shop management:
- `getMyShops()`: Get current user's shops

### `batches.ts`
Batch items management:
- `getByInventoryItemId(id)`: Get batch history for an inventory item
- `getByBatchId(id)`: Get batch items by batch ID (not implemented)
- `create(data)`: Create batch item (not implemented)
- `update(id, data)`: Update batch item (not implemented)
- `delete(id)`: Delete batch item (not implemented)

## Benefits of This Structure

1. **Modularity**: Each domain has its own file, making it easier to locate and modify code
2. **Maintainability**: Smaller files are easier to understand and maintain
3. **Scalability**: Easy to add new modules without cluttering a single file
4. **Testing**: Isolated modules are easier to unit test
5. **Code Splitting**: Better support for code splitting and lazy loading
6. **Collaboration**: Reduced merge conflicts when multiple developers work on different modules
7. **Backward Compatibility**: Legacy code continues to work through re-exports

## Migration Guide

### For New Code
Use the standard import pattern:
```typescript
import { realInventoryApi } from '@/services/realApi';
```

### For Existing Code
No changes required! All existing imports continue to work.

### Gradual Migration
You can gradually migrate to direct imports if preferred:
```diff
- import { realAuthApi } from '@/services/realApi';
+ import { realAuthApi } from '@/services/realApi/auth';
```

## Future Improvements

Consider these enhancements:
1. Add TypeScript interfaces for API responses in each module
2. Implement request/response interceptors for logging
3. Add retry logic for failed requests
4. Create separate error handling utilities
5. Add request caching for frequently accessed data
6. Implement WebSocket support for real-time updates
