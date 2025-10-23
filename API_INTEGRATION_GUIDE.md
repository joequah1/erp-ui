# API Integration Guide

## Overview

The ERP UI now supports both **mock API** (for testing) and **real API** (for production). You can easily toggle between them using environment variables.

## Configuration

### Environment Variables

Create or update `.env.local` with the following:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_USE_MOCK_API=true
```

- `NEXT_PUBLIC_API_URL`: The base URL for the real API (default: `http://localhost:3000/api`)
- `NEXT_PUBLIC_USE_MOCK_API`: Set to `true` to use mock data, `false` to use real API

## Switching Between Mock and Real API

### Use Mock API (for testing)
```env
NEXT_PUBLIC_USE_MOCK_API=true
```

### Use Real API (for production)
```env
NEXT_PUBLIC_USE_MOCK_API=false
```

## Integrated Endpoints

### Authentication
- ✅ Login
- ✅ Register
- ✅ Get Current User Profile
- ✅ Logout

### Brands
- ✅ List all brands
- ✅ Get brand by ID
- ✅ Create brand
- ✅ Update brand
- ✅ Delete brand

### Categories
- ✅ List all categories
- ✅ Get category by ID
- ✅ Create category
- ✅ Update category
- ✅ Delete category

### Product Types
- ✅ List all product types
- ✅ Get product type by ID
- ✅ Create product type
- ✅ Update product type
- ✅ Delete product type

### Inventory
- ✅ List inventory items (with pagination and filters)
- ✅ Get inventory item by ID
- ✅ Create inventory item
- ✅ Update inventory item
- ✅ Delete inventory item

## API Requirements

### Real API Endpoints Expected

Based on the API documentation (`API_DOCUMENTATION.md`), the following endpoints are integrated:

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get current user
- `POST /api/auth/refresh` - Refresh token

#### Brands
- `GET /api/brands?page=1&limit=100` - List brands
- `GET /api/brands/:id` - Get brand
- `POST /api/brands` - Create brand
- `PATCH /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

#### Categories
- `GET /api/product-categories?page=1&limit=100` - List categories
- `GET /api/product-categories/:id` - Get category
- `POST /api/product-categories` - Create category
- `PATCH /api/product-categories/:id` - Update category
- `DELETE /api/product-categories/:id` - Delete category

#### Product Types
- `GET /api/product-types?page=1&limit=100` - List product types
- `GET /api/product-types/:id` - Get product type
- `POST /api/product-types` - Create product type
- `PATCH /api/product-types/:id` - Update product type
- `DELETE /api/product-types/:id` - Delete product type

#### Inventory
- `GET /api/product-inventory?page=1&limit=20` - List inventory
- `GET /api/product-inventory/:id` - Get inventory item
- `POST /api/product-inventory` - Create inventory item
- `PATCH /api/product-inventory/:id` - Update inventory item
- `DELETE /api/product-inventory/:id` - Delete inventory item

### Required Headers for Real API

The real API implementation automatically handles:

1. **Authorization**: `Bearer <access_token>`
2. **Shop Context**: `x-shop-id: <shop_id>`
3. **Content-Type**: `application/json`

### Token Management

When using the real API, tokens are automatically:
- Stored in `localStorage`
- Included in API requests
- Refreshed when expired (401 errors)
- Cleared on logout

## Testing with Real API

### Step 1: Start the Real API Server
Make sure your Laravel/NestJS API is running on `http://localhost:3000`

### Step 2: Update Environment
```env
NEXT_PUBLIC_USE_MOCK_API=false
```

### Step 3: Restart Next.js Dev Server
```bash
npm run dev
```

### Step 4: Test Authentication
1. Go to login page
2. Use valid credentials from your API
3. Check browser console for API calls
4. Verify token storage in localStorage

### Step 5: Test CRUD Operations
1. Navigate to Brands, Categories, Product Types, or Inventory pages
2. Try creating, updating, and deleting items
3. Monitor network tab for API calls

## Known Limitations

### Mock API
- Uses in-memory data (resets on refresh)
- Simulated delays for realistic UX
- Limited to predefined data

### Real API Integration
- Requires valid shop ID after login (from `/api/users/me/shops`)
- Token refresh logic is implemented
- Some fields may need mapping adjustments based on actual API responses

## Troubleshooting

### Issue: "Session expired" errors
**Solution**: The access token has expired. The app will automatically try to refresh it. If refresh fails, you'll be redirected to login.

### Issue: "Shop access denied" (403 errors)
**Solution**: Ensure you have selected a valid shop. Check that `x-shop-id` header matches a shop you have access to.

### Issue: API calls failing with CORS errors
**Solution**: Configure your API to allow requests from `http://localhost:3002` (or your Next.js dev server port)

### Issue: Data format mismatches
**Solution**: Check the real API response format and update type mappings in `/services/realApi.ts`

## File Structure

```
/services
  ├── api.ts          # Main API file with toggle logic
  ├── realApi.ts      # Real API implementation
  └── ...

/.env.local          # Local environment configuration
```

## Next Steps

1. ✅ Test authentication flow with real API
2. ✅ Test CRUD operations for each module
3. 🔲 Implement shop selection after login
4. 🔲 Add error boundary for API errors
5. 🔲 Implement proper loading states
6. 🔲 Add toast notifications for API responses

## Support

For issues or questions about the API integration:
1. Check the main `API_DOCUMENTATION.md`
2. Review network tab in browser DevTools
3. Check browser console for errors
4. Verify environment variables are set correctly
