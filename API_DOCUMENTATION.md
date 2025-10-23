# ERP API Gateway - API Documentation

Version: 1.0.0
Base URL: `http://localhost:3000/api`
Authentication: JWT Bearer Token

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Headers](#common-headers)
4. [Error Responses](#error-responses)
5. [Pagination](#pagination)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users-endpoints)
   - [Shops](#shops-endpoints)
   - [Brands](#brands-endpoints)
   - [Product Types](#product-types-endpoints)
   - [Product Categories](#product-categories-endpoints)
   - [Integrations](#integrations-endpoints)
   - [Regions](#regions-endpoints)
   - [Product Inventory](#product-inventory-endpoints)
   - [Product Variants](#product-variants-endpoints)
   - [Product Listings](#product-listings-endpoints)
   - [Accounts](#accounts-endpoints)
   - [Batches](#batches-endpoints)
   - [Orders](#orders-endpoints)
   - [Order Items](#order-items-endpoints)
   - [Order Alerts](#order-alerts-endpoints)
   - [Product Inventory Trails](#product-inventory-trails-endpoints)
7. [Data Models Reference](#data-models-reference)
8. [Common Workflows](#common-workflows)
9. [Status Code Reference](#status-code-reference)
10. [Troubleshooting](#troubleshooting)
11. [AI Agent Integration Guide](#ai-agent-integration-guide)
12. [Rate Limiting](#rate-limiting)
13. [Best Practices](#best-practices)
14. [Support & Contact](#support--contact)
15. [Changelog](#changelog)

---

## Overview

The ERP API Gateway is a multi-tenant e-commerce and inventory management system designed for businesses managing products across multiple marketplace integrations (Shopee, Lazada, etc.).

### Key Features
- **Multi-tenant architecture**: Shop-scoped operations with data isolation
- **JWT authentication**: Secure access and refresh token system
- **Marketplace integrations**: Connect to multiple e-commerce platforms
- **Inventory management**: Track products, variants, and batches
- **Order management**: Process orders from various marketplaces
- **RESTful API**: Standard HTTP methods and status codes

---

## Authentication

### Authentication Flow

1. **Register** a new user account
2. **Login** to receive access and refresh tokens
3. **Include access token** in Authorization header for all subsequent requests
4. **Refresh token** when access token expires

### Token Details
- **Access Token**: Valid for 1 hour
- **Refresh Token**: Valid for 7 days
- **Token Type**: Bearer

---

## Common Headers

All authenticated requests must include:

```http
Authorization: Bearer <access_token>
x-shop-id: <shop_id>
Content-Type: application/json
```

### Header Descriptions

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes (except auth endpoints) | Bearer token for authentication |
| `x-shop-id` | Yes (except auth, global endpoints) | Shop context for multi-tenant operations |
| `Content-Type` | Yes (for POST/PATCH) | Must be `application/json` |

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (no access to shop) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Pagination

List endpoints support pagination with the following query parameters:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Page number (1-indexed) |
| `limit` | integer | 10 | 100 | Items per page |

### Paginated Response Format

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

## API Endpoints

---

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Headers**: None (public endpoint)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890"
}
```

**Response** (201):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "status": 1
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Login

```http
POST /api/auth/login
```

**Headers**: None (public endpoint)

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Refresh Token

```http
POST /api/auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Get Current User Profile

```http
GET /api/auth/profile
```

**Headers**: Authorization required

**Response** (200):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "status": 1,
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

---

### Generate Test Token (Development Only)

```http
POST /api/auth/test-token
```

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
}
```

---

## Users Endpoints

### Get Current User Shops

```http
GET /api/users/me/shops
```

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "My Shop",
    "slug": "my-shop",
    "email": "shop@example.com",
    "currency": "USD",
    "status": 1
  }
]
```

---

### Get User by ID

```http
GET /api/users/:id
```

**Response** (200):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "status": 1,
  "shops": [...]
}
```

---

### Update User

```http
PATCH /api/users/:id
```

**Request Body**:
```json
{
  "name": "John Updated",
  "phoneNumber": "+9876543210"
}
```

**Response** (200): Updated user object

---

## Shops Endpoints

### Get My Shops

```http
GET /api/shops/my-shops
```

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "My Shop",
    "slug": "my-shop",
    "email": "shop@example.com",
    "currency": "USD",
    "status": 1
  }
]
```

---

### Get Shop by ID

```http
GET /api/shops/:id
```

**Headers**: x-shop-id required

**Response** (200):
```json
{
  "id": 1,
  "name": "My Shop",
  "slug": "my-shop",
  "email": "shop@example.com",
  "phoneNumber": "+1234567890",
  "address": {...},
  "country": "US",
  "currency": "USD",
  "status": 1,
  "users": [...]
}
```

---

### Create Shop

```http
POST /api/shops
```

**Request Body**:
```json
{
  "name": "New Shop",
  "slug": "new-shop",
  "email": "newshop@example.com",
  "currency": "USD"
}
```

**Response** (201): Created shop object

---

### Update Shop

```http
PATCH /api/shops/:id
```

**Request Body**:
```json
{
  "name": "Updated Shop Name",
  "email": "updated@example.com"
}
```

**Response** (200): Updated shop object

---

### Delete Shop

```http
DELETE /api/shops/:id
```

**Response** (204): No content

---

## Brands Endpoints

### List Brands

```http
GET /api/brands?page=1&limit=10
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 100

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Brand Name",
      "externalId": "ext-123",
      "visible": 1,
      "flag": 1,
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

### Get Brand by ID

```http
GET /api/brands/:id
```

**Response** (200): Brand object

---

### Create Brand

```http
POST /api/brands
```

**Request Body**:
```json
{
  "name": "New Brand",
  "externalId": "ext-456",
  "visible": 1,
  "flag": 1
}
```

**Response** (201): Created brand object

---

### Update Brand

```http
PATCH /api/brands/:id
```

**Request Body**:
```json
{
  "name": "Updated Brand Name",
  "visible": 0
}
```

**Response** (200): Updated brand object

---

### Delete Brand

```http
DELETE /api/brands/:id
```

**Response** (204): No content

---

## Product Types Endpoints

### List Product Types

```http
GET /api/product-types?page=1&limit=10
```

**Headers**: x-shop-id required

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10
}
```

---

### Create Product Type

```http
POST /api/product-types
```

**Request Body**:
```json
{
  "name": "Furniture"
}
```

**Response** (201): Created product type object

---

### Update Product Type

```http
PATCH /api/product-types/:id
```

**Request Body**:
```json
{
  "name": "Home Furniture"
}
```

**Response** (200): Updated product type object

---

### Delete Product Type

```http
DELETE /api/product-types/:id
```

**Response** (204): No content

---

## Product Categories Endpoints

### List Product Categories

```http
GET /api/product-categories?page=1&limit=10&parentId=5
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `parentId` (optional): Filter by parent category

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "parentId": null,
      "description": "Electronic devices",
      "position": 1,
      "status": 1,
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 10
}
```

---

### Get Category Tree

```http
GET /api/product-categories/tree
```

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "children": [
      {
        "id": 2,
        "name": "Phones",
        "children": []
      }
    ]
  }
]
```

---

### Get Category Children

```http
GET /api/product-categories/:id/children
```

**Response** (200): Array of child categories

---

### Create Category

```http
POST /api/product-categories
```

**Request Body**:
```json
{
  "name": "Smartphones",
  "parentId": 1,
  "description": "Mobile phones",
  "position": 1,
  "status": 1
}
```

**Response** (201): Created category object

---

### Update Category

```http
PATCH /api/product-categories/:id
```

**Request Body**:
```json
{
  "name": "Smart Phones",
  "description": "Updated description"
}
```

**Response** (200): Updated category object

---

### Delete Category

```http
DELETE /api/product-categories/:id
```

**Response** (204): No content

---

## Integrations Endpoints

**Note**: Integrations are global (no x-shop-id required)

### List Integrations

```http
GET /api/integrations?page=1&limit=10
```

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Shopee",
      "thumbnailImage": "https://example.com/shopee.png",
      "type": 1,
      "visibility": 1,
      "position": 1,
      "regionIds": [1, 2],
      "syncData": {...},
      "features": [...],
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

---

### Get Integration by ID

```http
GET /api/integrations/:id
```

**Response** (200): Integration object with full details

---

### Create Integration

```http
POST /api/integrations
```

**Request Body**:
```json
{
  "name": "Lazada",
  "thumbnailImage": "https://example.com/lazada.png",
  "type": 1,
  "visibility": 1,
  "position": 2,
  "regionIds": [1, 3]
}
```

**Response** (201): Created integration object

---

### Update Integration

```http
PATCH /api/integrations/:id
```

**Request Body**:
```json
{
  "name": "Updated Integration Name",
  "visibility": 0
}
```

**Response** (200): Updated integration object

---

### Delete Integration

```http
DELETE /api/integrations/:id
```

**Response** (204): No content

---

## Regions Endpoints

**Note**: Regions are global (no x-shop-id required)

### List Regions

```http
GET /api/regions?page=1&limit=10
```

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Singapore",
      "shortcode": "SG",
      "currency": "SGD",
      "thumbnailImage": "https://example.com/sg.png",
      "visibility": 1,
      "position": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

---

### Get Region by ID

```http
GET /api/regions/:id
```

**Response** (200): Region object with full details

---

### Create Region

```http
POST /api/regions
```

**Request Body**:
```json
{
  "name": "Malaysia",
  "shortcode": "MY",
  "currency": "MYR",
  "thumbnailImage": "https://example.com/my.png",
  "visibility": 1,
  "position": 2
}
```

**Response** (201): Created region object

---

### Update Region

```http
PATCH /api/regions/:id
```

**Request Body**:
```json
{
  "name": "Malaysia (Updated)",
  "visibility": 0
}
```

**Response** (200): Updated region object

---

### Delete Region

```http
DELETE /api/regions/:id
```

**Response** (204): No content

---

## Product Inventory Endpoints

### List Product Inventory

```http
GET /api/product-inventory?page=1&limit=10&brandId=5&supplierId=3&productTypeId=2&categoryId=10&status=1
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `brandId` (optional): Filter by brand
- `supplierId` (optional): Filter by supplier
- `productTypeId` (optional): Filter by product type
- `categoryId` (optional): Filter by category
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "sku": "INV-001",
      "name": "Product Name",
      "shortName": "Short Name",
      "description": "Product description",
      "barcode": "1234567890",
      "stock": 100,
      "currency": "USD",
      "sellingPrice": "99.99",
      "costPrice": "50.00",
      "mainImage": "https://example.com/image.jpg",
      "brandId": 5,
      "supplierId": 3,
      "productTypeId": 2,
      "categoryId": 10,
      "status": 1,
      "shopId": 1,
      "createdBy": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

---

### Get Product Inventory by ID

```http
GET /api/product-inventory/:id
```

**Response** (200): Product inventory object with relationships

---

### Create Product Inventory

```http
POST /api/product-inventory
```

**Request Body**:
```json
{
  "sku": "INV-002",
  "name": "New Product",
  "shortName": "NP",
  "description": "Product description",
  "barcode": "9876543210",
  "stock": 50,
  "currency": "USD",
  "sellingPrice": "149.99",
  "costPrice": "75.00",
  "brandId": 5,
  "supplierId": 3,
  "productTypeId": 2,
  "categoryId": 10,
  "status": 1
}
```

**Response** (201): Created product inventory object

---

### Update Product Inventory

```http
PATCH /api/product-inventory/:id
```

**Request Body**:
```json
{
  "name": "Updated Product Name",
  "stock": 75,
  "sellingPrice": "159.99"
}
```

**Response** (200): Updated product inventory object

---

### Delete Product Inventory

```http
DELETE /api/product-inventory/:id
```

**Response** (204): No content

---

### Adjust Stock

```http
POST /api/product-inventory/:id/adjust-stock
```

**Request Body**:
```json
{
  "adjustment": -10,
  "reason": "Sale"
}
```

**Response** (200): Updated product inventory object

---

### Get Batches for Inventory Item

```http
GET /api/product-inventory/:id/batches?page=1&limit=10
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 100

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "inventoryId": 5,
      "batchId": 10,
      "locationId": 2,
      "stock": 50,
      "cost": "45.50",
      "originCost": "300.00",
      "commission": "5.00",
      "surcharge": "2.50",
      "subtotal": "307.50",
      "shippingCost": "12.50",
      "landedCost": "48.00",
      "currency": "USD",
      "sold": 15,
      "expiryDate": "2026-01-15T00:00:00.000Z",
      "status": 1,
      "priority": 1,
      "completedAt": null,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z",
      "batch": {
        "id": 10,
        "name": "Batch January 2025",
        "notes": "New year inventory batch",
        "restockDate": "2025-01-20T00:00:00.000Z",
        "eta": "2025-01-25",
        "status": 1
      },
      "location": {
        "id": 2,
        "name": "Warehouse A - Aisle 3"
      }
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

**Description**: Returns all batches that contain the specified product inventory item. Each batch pivot includes stock levels, cost information, and relationships to the batch and location. This is useful for tracking which batches contain specific inventory items and their associated costs.

---

### Get Stock Change Trails for Inventory Item

```http
GET /api/product-inventory/:id/trails?page=1&limit=10&type=0&relatedType=App\Models\Order&batchId=5
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 100
- `type` (optional): Filter by trail type (0=DEDUCTION, 1=ADDITION, 2=SET, 3=TRANSFER, 4=NO_CHANGE)
- `relatedType` (optional): Filter by related type ('App\Models\Order', 'App\Models\ProductListing', 'App\Models\ProductInventory')
- `batchId` (optional): Filter by batch ID

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "productInventoryId": 5,
      "batchId": 10,
      "shopId": 1,
      "userId": 2,
      "message": "Stock deducted due to order SO123456789",
      "type": 0,
      "relatedId": "50",
      "relatedType": "App\\Models\\Order",
      "uniqueType": "order_fulfillment",
      "uniqueId": 50,
      "old": 100,
      "new": 98,
      "unitCost": "45.50",
      "unitSellingPrice": "99.99",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z",
      "user": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "batch": {
        "id": 10,
        "name": "Batch January 2025"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

**Description**: Returns audit trail of all stock changes for the specified product inventory item. Each trail record includes the type of change (deduction, addition, set, transfer, no change), what triggered the change (order, listing update, inventory adjustment), old and new values, and cost information. This is useful for tracking inventory history, debugging stock discrepancies, and generating reports.

**Trail Types**:
- `0` - DEDUCTION: Stock removed (e.g., order fulfilled)
- `1` - ADDITION: Stock added (e.g., batch arrival, return)
- `2` - SET: Stock set to specific value (e.g., inventory count correction)
- `3` - TRANSFER: Stock transferred between batches/locations
- `4` - NO_CHANGE: Log entry without stock change (e.g., price update)

**Related Types**:
- `App\Models\Order`: Change triggered by order fulfillment
- `App\Models\ProductListing`: Change triggered by marketplace listing sync
- `App\Models\ProductInventory`: Change triggered by direct inventory adjustment

---

### Get Product Listings for Inventory Item

```http
GET /api/product-inventory/:id/listings?page=1&limit=10&accountId=5&integrationId=2&status=1
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 100
- `accountId` (optional): Filter by account ID
- `integrationId` (optional): Filter by integration ID
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "accountId": 5,
      "integrationId": 2,
      "productId": 10,
      "productVariantId": 15,
      "name": "Product Listing Name",
      "identifiers": {...},
      "options": {...},
      "option1": "Red",
      "option2": "Large",
      "option3": null,
      "stock": 25,
      "syncStock": 1,
      "totalSold": 150,
      "productUrl": "https://marketplace.com/product/123",
      "status": 1,
      "lastImportedAt": "2025-01-15T09:00:00.000Z",
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z",
      "account": {
        "id": 5,
        "name": "My Shopee Account",
        "integrationId": 2
      },
      "variant": {
        "id": 15,
        "name": "Red - Large",
        "sku": "VAR-001",
        "inventoryId": 5
      }
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10
}
```

**Description**: Returns all product listings across different marketplace integrations that are associated with the specified product inventory item. This is useful for seeing where a product is listed (e.g., Shopee, Lazada), tracking stock synchronization status, and managing multi-channel inventory. Each listing represents the product on a specific marketplace account.

---

## Product Variants Endpoints

### List Product Variants

```http
GET /api/product-variants?page=1&limit=10&productInventoryId=5
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `productInventoryId` (optional): Filter by product inventory

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "productInventoryId": 5,
      "productId": 10,
      "name": "Variant Name",
      "sku": "VAR-001",
      "barcode": "1234567890",
      "mainImage": "https://example.com/variant.jpg",
      "stock": 25,
      "currency": "USD",
      "price": "99.99",
      "status": 1,
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 75,
  "page": 1,
  "limit": 10
}
```

---

### Get Product Variant by ID

```http
GET /api/product-variants/:id
```

**Response** (200): Product variant object with relationships

---

### Create Product Variant

```http
POST /api/product-variants
```

**Request Body**:
```json
{
  "productInventoryId": 5,
  "productId": 10,
  "name": "Red - Large",
  "sku": "VAR-002",
  "barcode": "9876543210",
  "stock": 30,
  "currency": "USD",
  "price": "109.99",
  "status": 1
}
```

**Response** (201): Created product variant object

---

### Update Product Variant

```http
PATCH /api/product-variants/:id
```

**Request Body**:
```json
{
  "name": "Red - XL",
  "stock": 35,
  "price": "119.99"
}
```

**Response** (200): Updated product variant object

---

### Delete Product Variant

```http
DELETE /api/product-variants/:id
```

**Response** (204): No content

---

## Product Listings Endpoints

### List Product Listings

```http
GET /api/product-listings?page=1&limit=10&accountId=5&integrationId=2&productId=10&productVariantId=15&status=1
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `accountId` (optional): Filter by account
- `integrationId` (optional): Filter by integration
- `productId` (optional): Filter by product
- `productVariantId` (optional): Filter by variant
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "accountId": 5,
      "integrationId": 2,
      "productId": 10,
      "productVariantId": 15,
      "title": "Product Listing Title",
      "description": "Listing description",
      "integrationCategoryId": 100,
      "accountCategoryId": 200,
      "externalId": "ext-listing-123",
      "externalVariantId": "ext-var-456",
      "externalUrl": "https://marketplace.com/product/123",
      "price": 99.99,
      "compareAtPrice": 129.99,
      "stock": 50,
      "stockSyncEnabled": true,
      "priceSyncEnabled": true,
      "currency": "USD",
      "status": 1,
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 200,
  "page": 1,
  "limit": 10
}
```

---

### Get Product Listing by ID

```http
GET /api/product-listings/:id
```

**Response** (200): Product listing object with relationships

---

### Create Product Listing

```http
POST /api/product-listings
```

**Request Body**:
```json
{
  "accountId": 5,
  "integrationId": 2,
  "productId": 10,
  "productVariantId": 15,
  "title": "New Product Listing",
  "description": "Product description for marketplace",
  "integrationCategoryId": 100,
  "price": 99.99,
  "stock": 50,
  "stockSyncEnabled": true,
  "priceSyncEnabled": true,
  "currency": "USD",
  "status": 1
}
```

**Response** (201): Created product listing object

---

### Update Product Listing

```http
PATCH /api/product-listings/:id
```

**Request Body**:
```json
{
  "title": "Updated Listing Title",
  "price": 89.99,
  "stock": 60
}
```

**Response** (200): Updated product listing object

---

### Delete Product Listing

```http
DELETE /api/product-listings/:id
```

**Response** (204): No content

---

## Accounts Endpoints

### List Accounts

```http
GET /api/accounts?page=1&limit=10&integrationId=2
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `integrationId` (optional): Filter by integration

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "integrationId": 2,
      "name": "My Shopee Account",
      "accessToken": "encrypted_token",
      "refreshToken": "encrypted_refresh",
      "externalId": "shopee-123",
      "metadata": "{...}",
      "shopId": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

---

### Get Account by ID

```http
GET /api/accounts/:id
```

**Response** (200): Account object with integration relationship

---

### Create Account

```http
POST /api/accounts
```

**Request Body**:
```json
{
  "integrationId": 2,
  "name": "New Lazada Account",
  "accessToken": "access_token_here",
  "refreshToken": "refresh_token_here",
  "externalId": "lazada-456",
  "metadata": "{\"sellerId\": \"12345\"}"
}
```

**Response** (201): Created account object

---

### Update Account

```http
PATCH /api/accounts/:id
```

**Request Body**:
```json
{
  "name": "Updated Account Name",
  "accessToken": "new_access_token"
}
```

**Response** (200): Updated account object

---

### Delete Account

```http
DELETE /api/accounts/:id
```

**Response** (204): No content

---

## Batches Endpoints

### List Batches

```http
GET /api/batches?page=1&limit=10&status=1&regionId=5&inventoryId=10
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `regionId` (optional): Filter by region
- `inventoryId` (optional): Filter by inventory item - returns only batches containing this inventory

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Batch January 2025",
      "notes": "New year inventory batch",
      "restockDate": "2025-01-20T00:00:00.000Z",
      "eta": "2025-01-25T00:00:00.000Z",
      "locationId": 10,
      "location": "Warehouse A",
      "mode": "Sea Freight",
      "status": 1,
      "regionId": 5,
      "containerNumber": "CONT-123456",
      "originCurrency": "CNY",
      "currency": "USD",
      "rate": "0.14",
      "shopId": 1,
      "createdBy": 1,
      "lastUpdatedBy": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 10
}
```

---

### Get Batch by ID

```http
GET /api/batches/:id
```

**Response** (200): Batch object with creator, updater, and inventories relationships

---

### Create Batch

```http
POST /api/batches
```

**Request Body**:
```json
{
  "name": "Batch February 2025",
  "notes": "Q1 inventory batch",
  "restockDate": "2025-02-15",
  "eta": "2025-02-20",
  "location": "Warehouse B",
  "mode": "Air Freight",
  "status": 1,
  "regionId": 5,
  "containerNumber": "CONT-789012",
  "originCurrency": "CNY",
  "currency": "USD",
  "rate": "0.14"
}
```

**Response** (201): Created batch object

---

### Update Batch

```http
PATCH /api/batches/:id
```

**Request Body**:
```json
{
  "name": "Updated Batch Name",
  "eta": "2025-02-22",
  "status": 2
}
```

**Response** (200): Updated batch object

---

### Delete Batch

```http
DELETE /api/batches/:id
```

**Response** (204): No content

---

## Orders Endpoints

### List Orders

```http
GET /api/orders?page=1&limit=10&accountId=5&integrationId=2&paymentStatus=paid&fulfillmentStatus=pending&status=1
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `accountId` (optional): Filter by account
- `integrationId` (optional): Filter by integration
- `paymentStatus` (optional): Filter by payment status
- `fulfillmentStatus` (optional): Filter by fulfillment status
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "accountId": 5,
      "integrationId": 2,
      "externalId": "shopee-order-123",
      "externalOrderNumber": "SO123456789",
      "externalSource": "shopee",
      "sourceMarketplace": "Shopee Singapore",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "shippingAddress": {...},
      "billingAddress": {...},
      "shipByDate": "2025-01-20T00:00:00.000Z",
      "currency": "SGD",
      "subTotal": 100.00,
      "shippingFee": 5.00,
      "tax": 7.00,
      "grandTotal": 112.00,
      "buyerPaid": 112.00,
      "paymentStatus": "paid",
      "paymentMethod": "credit_card",
      "fulfillmentStatus": "pending",
      "physicalFulfillmentStatus": "not_started",
      "orderPlacedAt": "2025-01-15T10:00:00.000Z",
      "status": 1,
      "shopId": 1,
      "createdBy": 1,
      "createdAt": "2025-01-15T10:05:00.000Z"
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 10
}
```

---

### Get Order by ID

```http
GET /api/orders/:id
```

**Response** (200): Order object with account, integration, items, alerts, consignee, and customer relationships

---

### Create Order

```http
POST /api/orders
```

**Request Body**:
```json
{
  "accountId": 5,
  "integrationId": 2,
  "externalId": "lazada-order-456",
  "externalOrderNumber": "LZ987654321",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "shippingAddress": {
    "address1": "123 Main St",
    "city": "Singapore",
    "postcode": "123456",
    "country": "SG"
  },
  "currency": "SGD",
  "subTotal": 200.00,
  "shippingFee": 8.00,
  "tax": 14.00,
  "grandTotal": 222.00,
  "paymentStatus": "paid",
  "paymentMethod": "paypal",
  "fulfillmentStatus": "pending",
  "orderPlacedAt": "2025-01-15T12:00:00.000Z"
}
```

**Response** (201): Created order object

---

### Update Order

```http
PATCH /api/orders/:id
```

**Request Body**:
```json
{
  "fulfillmentStatus": "processing",
  "physicalFulfillmentStatus": "picking",
  "notes": "Started processing order"
}
```

**Response** (200): Updated order object

---

### Delete Order

```http
DELETE /api/orders/:id
```

**Response** (204): No content

---

## Order Items Endpoints

### List Order Items

```http
GET /api/order-items?page=1&limit=10&orderId=50&productVariantId=15&fulfillmentStatus=1
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `orderId` (optional): Filter by order
- `productVariantId` (optional): Filter by product variant
- `fulfillmentStatus` (optional): Filter by fulfillment status

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "orderId": 50,
      "productVariantId": 15,
      "productInventoryId": 10,
      "externalId": "item-ext-123",
      "externalProductId": "prod-ext-456",
      "name": "Product Name - Red L",
      "sku": "SKU-001",
      "variationName": "Red - Large",
      "quantity": 2,
      "itemPrice": 50.00,
      "subTotal": 100.00,
      "tax": 7.00,
      "grandTotal": 107.00,
      "fulfillmentStatus": 1,
      "returnStatus": 0,
      "inventoryStatus": 1,
      "costOfGoods": 30.00,
      "shipmentProvider": "DHL",
      "trackingNumber": "DHL123456789",
      "shopId": 1,
      "createdAt": "2025-01-15T10:10:00.000Z"
    }
  ],
  "total": 1000,
  "page": 1,
  "limit": 10
}
```

---

### Get Order Item by ID

```http
GET /api/order-items/:id
```

**Response** (200): Order item object with order, productVariant, productInventory, account, and integration relationships

---

### Create Order Item

```http
POST /api/order-items
```

**Request Body**:
```json
{
  "orderId": 50,
  "productVariantId": 15,
  "productInventoryId": 10,
  "name": "Product Name - Blue M",
  "sku": "SKU-002",
  "variationName": "Blue - Medium",
  "quantity": 1,
  "itemPrice": 60.00,
  "subTotal": 60.00,
  "tax": 4.20,
  "grandTotal": 64.20,
  "fulfillmentStatus": 0,
  "costOfGoods": 35.00
}
```

**Response** (201): Created order item object

---

### Update Order Item

```http
PATCH /api/order-items/:id
```

**Request Body**:
```json
{
  "fulfillmentStatus": 2,
  "shipmentProvider": "FedEx",
  "trackingNumber": "FEDEX987654321"
}
```

**Response** (200): Updated order item object

---

### Delete Order Item

```http
DELETE /api/order-items/:id
```

**Response** (204): No content

---

## Order Alerts Endpoints

### List Order Alerts

```http
GET /api/order-alerts?page=1&limit=10&orderId=50&type=1&status=1
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `orderId` (optional): Filter by order
- `type` (optional): Filter by alert type
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "orderId": 50,
      "message": "Order payment verification needed",
      "type": 1,
      "status": 1,
      "shopId": 1,
      "createdAt": "2025-01-15T10:15:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

---

### Get Order Alert by ID

```http
GET /api/order-alerts/:id
```

**Response** (200): Order alert object with order relationship

---

### Create Order Alert

```http
POST /api/order-alerts
```

**Request Body**:
```json
{
  "orderId": 50,
  "message": "Stock level low for order items",
  "type": 2,
  "status": 1
}
```

**Response** (201): Created order alert object

---

### Update Order Alert

```http
PATCH /api/order-alerts/:id
```

**Request Body**:
```json
{
  "status": 0,
  "message": "Alert resolved - stock replenished"
}
```

**Response** (200): Updated order alert object

---

### Delete Order Alert

```http
DELETE /api/order-alerts/:id
```

**Response** (204): No content

---

## Product Inventory Trails Endpoints

### List Trails by Inventory

```http
GET /api/product-inventory-trails/inventory/:inventoryId?page=1&limit=10&type=0&relatedType=App\Models\Order&batchId=5
```

**Headers**: x-shop-id required

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by trail type (0-4)
- `relatedType` (optional): Filter by related type
- `batchId` (optional): Filter by batch ID

**Response** (200): Paginated list of trail records

---

### Get Trail by ID

```http
GET /api/product-inventory-trails/:id
```

**Response** (200): Trail object with product inventory, batch, and user relationships

---

### Create Trail (Internal Use)

```http
POST /api/product-inventory-trails
```

**Note**: This endpoint is typically used internally by the system when stock changes occur, not manually called.

**Request Body**:
```json
{
  "productInventoryId": 5,
  "batchId": 10,
  "userId": 2,
  "message": "Stock deducted due to order SO123456789",
  "type": 0,
  "relatedId": "50",
  "relatedType": "App\\Models\\Order",
  "uniqueType": "order_fulfillment",
  "uniqueId": 50,
  "old": 100,
  "new": 98,
  "unitCost": 45.50,
  "unitSellingPrice": 99.99
}
```

**Response** (201): Created trail object

---

## Data Models Reference

### User
```typescript
{
  id: number
  name: string
  email: string
  phoneNumber?: string
  status: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### Shop
```typescript
{
  id: number
  name: string
  slug: string
  email: string
  phoneNumber?: string
  address?: object
  country?: string
  currency: string
  status: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### Brand
```typescript
{
  id: number  // bigint
  shopId: number  // bigint
  name: string  // varchar(255)
  visible: number  // tinyint(1) - boolean
  flag: number  // tinyint
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  // Note: No soft delete - hard deletes only
}
```

### Product Type
```typescript
{
  id: number  // bigint
  shopId: number  // bigint
  name: string  // varchar(255)
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  // Note: No soft delete - hard deletes only
}
```

### Product Category
```typescript
{
  id: number  // bigint
  shopId: number  // bigint
  name: string  // varchar(255)
  parentId?: number  // bigint - references parent category
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  // Note: No soft delete - hard deletes only
  // Note: Fields removed: description, position, status
}
```

### Integration
```typescript
{
  id: number
  name: string
  thumbnailImage?: string
  type: number
  visibility: number
  position: number
  regionIds?: number[]
  syncData?: object
  features?: any[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### Region
```typescript
{
  id: number
  name: string
  shortcode: string
  currency: string
  thumbnailImage?: string
  visibility: number
  position: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### Product Inventory
```typescript
{
  id: number
  shopId: number
  createdBy?: number
  brandId?: number
  supplierId?: number
  productTypeId?: number
  categoryId?: number
  subCategoryId?: number
  sku?: string
  name?: string
  shortName?: string
  description?: string
  htmlDescription?: string
  barcode?: string
  color?: string
  stock?: number
  defect?: number
  warehouse?: string
  // Parcel/Shipping dimensions
  parcelWidth?: string  // decimal(18,2)
  parcelLength?: string  // decimal(18,2)
  parcelHeight?: string  // decimal(18,2)
  parcelWeight?: string  // decimal(18,2)
  courierType?: string
  // Packaging
  packagingType?: string
  packagingDetail?: string
  assembly?: number  // tinyint(1) - boolean
  // SKU Material/Origin
  skuMaterial?: string
  skuCountryOfOrigin?: string
  // Images & Pricing
  mainImage?: string
  currency?: string  // varchar(3)
  sellingPrice?: string  // decimal(18,4)
  costPrice?: string  // decimal(18,4)
  specialPrice?: string  // decimal(15,2)
  // Product dimensions
  length?: string  // decimal(18,2)
  width?: string  // decimal(18,2)
  height?: string  // decimal(18,2)
  weight?: string  // decimal(18,2)
  // Packing/Carton details
  packingSizeQtyCtn?: string  // decimal(18,2)
  capacity?: string  // decimal(18,2)
  outerCartonBarcodeNumber?: number
  cartonWidth?: string  // decimal(18,2)
  cartonLength?: string  // decimal(18,2)
  cartonHeight?: string  // decimal(18,2)
  cartonWeight?: string  // decimal(18,2)
  cartonTotalQuantity?: number
  cartonCapacity?: string  // decimal(18,2)
  cartonShippingCostPcs?: string  // decimal(18,4)
  cartonCbm?: string  // decimal(18,4)
  innerPackingNumber?: number
  totalQuantityPerInnerPack?: number  // double(8,2)
  // Notifications & Status
  lowStockNotification?: number
  outOfStockNotification?: number  // tinyint(1)
  onsiteInstallation?: number  // tinyint(1)
  enabled?: number  // tinyint(1)
  status?: number  // tinyint
  features?: any  // JSON field
  statusUpdatedAt?: Date  // timestamp
  // Timestamps
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### Product Variant
```typescript
{
  id: number  // bigint
  productId?: number  // bigint
  shopId: number  // bigint
  name?: string  // varchar(255)
  option1?: string  // varchar(255)
  option2?: string  // varchar(255)
  option3?: string  // varchar(255)
  inventoryId?: number  // bigint
  sku?: string  // varchar(400)
  barcode?: string  // varchar(255)
  mainImage?: string  // varchar(255)
  stock?: number  // int
  currency?: string  // varchar(3)
  price?: string  // decimal(18,4)
  position?: number  // tinyint
  status?: number  // tinyint
  shippingType?: number  // tinyint
  weight?: string  // decimal(10,2)
  weightUnit?: number  // tinyint
  length?: string  // decimal(10,2)
  width?: string  // decimal(10,2)
  height?: string  // decimal(10,2)
  dimensionUnit?: number  // tinyint
  productColour?: string  // varchar(255)
  totalQuantitySold?: number  // int
  totalRevenue?: string  // decimal(10,2)
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  deletedAt?: Date  // timestamp (soft delete enabled)
}
```

### Product Listing
```typescript
{
  id: number  // bigint
  shopId: number  // bigint
  accountId?: number  // bigint
  integrationId?: number  // bigint
  productId?: number  // bigint
  productVariantId?: number  // bigint
  integrationCategoryId?: number  // bigint
  accountCategoryId?: number  // bigint
  identifiers?: any  // JSON
  name?: string  // varchar(255)
  options?: any  // JSON
  option1?: string  // varchar(255)
  option2?: string  // varchar(255)
  option3?: string  // varchar(255)
  stock?: number  // int
  syncStock?: number  // tinyint(1) - boolean
  totalSold?: number  // int
  productUrl?: string  // varchar(255)
  status?: number  // tinyint
  lastImportedAt?: Date  // datetime
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  deletedAt?: Date  // timestamp
}
```

### Account
```typescript
{
  id: number
  shopId: number
  integrationId: number
  name: string
  accessToken: string
  refreshToken?: string
  externalId?: string
  metadata?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### Batch
```typescript
{
  id: number  // bigint
  shopId: number  // bigint
  createdBy?: number  // bigint
  lastUpdatedBy?: number  // bigint
  name: string  // varchar(255)
  notes?: string  // varchar(255)
  restockDate?: Date  // datetime
  mode?: number  // tinyint
  status?: number  // tinyint
  regionId?: number  // bigint
  containerNumber?: string  // varchar(255)
  location?: string  // varchar(255)
  eta?: Date  // date
  originCurrency?: string  // varchar(10)
  currency?: string  // varchar(10)
  rate?: string  // decimal(18,6)
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  // Note: No soft delete - hard deletes only
}
```

### Product Inventory Batch Pivot
```typescript
{
  id: number  // bigint (auto-increment primary key)
  inventoryId: number  // bigint - references product_inventories.id
  batchId: number  // bigint - references batches.id
  locationId?: number  // bigint - references locations.id (nullable)
  stock?: number  // int - quantity in this batch
  cost?: string  // decimal(18,4) - cost per unit
  originCost?: string  // decimal(18,4) - original cost in origin currency
  commission?: string  // decimal(18,4)
  surcharge?: string  // decimal(18,4)
  subtotal?: string  // decimal(18,4)
  shippingCost?: string  // decimal(18,4)
  landedCost?: string  // decimal(18,4) - total cost including shipping
  currency?: string  // varchar(3)
  sold?: number  // int - quantity sold from this batch
  expiryDate?: Date  // timestamp - batch expiry date
  status?: number  // tinyint
  priority?: number  // smallint - batch priority for stock allocation
  completedAt?: Date  // timestamp - when batch is fully processed
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  // Note: No soft delete - pivot table uses hard deletes
  // Relationships: batch, inventory, location
}
```

### Order
```typescript
{
  id: number  // bigint
  shopId: number  // bigint
  createdBy?: number  // bigint
  accountId?: number  // bigint
  sourceMarketplace?: string  // enum('amazon','redmart','zalora','ntuc','wholesale','other')
  integrationId?: number  // bigint
  consigneeId?: number  // bigint
  customerId?: number  // bigint
  parentId?: number  // bigint
  externalId?: string  // varchar(255)
  externalSource?: string  // varchar(255)
  externalOrderNumber?: string  // varchar(255)
  customerName?: string  // varchar(255)
  customerEmail?: string  // varchar(255)
  shippingAddress?: object  // JSON
  billingAddress?: object  // JSON
  shipByDate?: Date  // datetime
  currency?: string  // varchar(3)
  // All monetary fields are decimal(18,4)
  creditCardDiscount?: string
  integrationDiscount?: string
  integrationDiscountVoucher?: string
  integrationDiscountCoin?: string
  sellerDiscount?: string
  sellerDiscountVoucher?: string
  sellerProductDiscount?: string
  sellerRefundAmount?: string
  shippingFee?: string
  actualShippingFee?: string
  integrationShippingFee?: string
  sellerShippingFee?: string
  tax?: string
  tax2?: string
  commissionFee?: string
  transactionFee?: string
  serviceFee?: string
  sponsoredAffiliates?: string
  subTotal?: string
  grandTotal?: string
  buyerPaid?: string
  settlementAmount?: string
  // Status fields are tinyint
  paymentStatus?: number
  paymentMethod?: string  // varchar(255)
  fulfillmentStatus?: number
  physicalFulfillmentStatus?: number
  fulfillmentType?: number
  buyerRemarks?: string  // text
  notes?: string  // text
  type?: number  // tinyint
  flag?: any  // JSON
  data?: any  // JSON
  internalData?: any  // JSON
  orderPlacedAt?: Date  // timestamp
  orderUpdatedAt?: Date  // timestamp
  orderPaidAt?: Date  // timestamp
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  deletedAt?: Date  // timestamp (soft delete enabled)
}
```

### Order Item
```typescript
{
  id: number  // bigint
  orderId: number  // bigint
  shopId: number  // bigint
  accountId?: number  // bigint
  integrationId?: number  // bigint
  productId?: number  // bigint
  productVariantId?: number  // bigint
  productInventoryId?: number  // bigint
  externalId?: string  // varchar(255)
  externalProductId?: string  // varchar(255)
  name?: string  // varchar(255)
  sku?: string  // varchar(255)
  variationName?: string  // varchar(255)
  variationSku?: string  // varchar(400)
  quantity?: number  // int
  // All monetary fields are decimal(18,4)
  itemPrice?: string
  creditCardDiscount?: string
  integrationDiscount?: string
  integrationDiscountVoucher?: string
  integrationDiscountCoin?: string
  sellerDiscount?: string
  sellerDiscountVoucher?: string
  sellerProductDiscount?: string
  shippingFee?: string
  actualShippingFee?: string
  tax?: string
  tax2?: string
  subTotal?: string
  grandTotal?: string
  buyerPaid?: string
  costOfGoods?: string
  // Status fields are tinyint
  fulfillmentStatus?: number
  shipmentProvider?: string  // varchar(255)
  shipmentType?: string  // varchar(255)
  shipmentMethod?: string  // varchar(255)
  trackingNumber?: string  // varchar(255)
  returnStatus?: number
  inventoryStatus?: number
  data?: any  // JSON
  remark?: string  // varchar(255)
  createdAt: Date  // timestamp
  updatedAt: Date  // timestamp
  deletedAt?: Date  // timestamp (soft delete enabled)
}
```

### Order Alert
```typescript
{
  id: number
  shopId: number
  orderId: number
  message: string
  type: number
  status: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

---

## Common Workflows

### Workflow 1: User Registration and Authentication

1. **Register a new user**
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890"
}
```

2. **Receive tokens** in the response
```json
{
  "user": {...},
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

3. **Store tokens securely** (localStorage/sessionStorage for web, secure storage for mobile)

4. **Use access token** in all subsequent requests
```bash
Authorization: Bearer eyJhbGc...
```

5. **When token expires** (401 error), refresh it
```bash
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}
```

---

### Workflow 2: Creating a Product Inventory Item

1. **Get or create dependencies** (Brand, Product Type, Category)
```bash
POST /api/brands
{"name": "Nike", "visible": 1, "flag": 1}

POST /api/product-types
{"name": "Footwear"}

POST /api/product-categories
{"name": "Running Shoes", "status": 1}
```

2. **Create product inventory**
```bash
POST /api/product-inventory
Headers:
  Authorization: Bearer <token>
  x-shop-id: 1

Body:
{
  "sku": "NIKE-RUN-001",
  "name": "Nike Running Shoe",
  "shortName": "Nike Run",
  "description": "Comfortable running shoe",
  "barcode": "1234567890123",
  "stock": 100,
  "currency": "USD",
  "sellingPrice": "129.99",
  "costPrice": "65.00",
  "brandId": 1,
  "productTypeId": 1,
  "categoryId": 1,
  "status": 1
}
```

3. **Create product variants** (if needed)
```bash
POST /api/product-variants
{
  "productInventoryId": 1,
  "name": "Red - Size 10",
  "sku": "NIKE-RUN-001-R-10",
  "stock": 25,
  "currency": "USD",
  "price": "129.99",
  "status": 1
}
```

---

### Workflow 3: Setting Up Marketplace Integration and Creating Listings

1. **Verify available integrations**
```bash
GET /api/integrations
```

2. **Create an account for the integration**
```bash
POST /api/accounts
Headers:
  x-shop-id: 1

Body:
{
  "integrationId": 1,
  "name": "My Shopee SG Account",
  "accessToken": "shopee_access_token",
  "refreshToken": "shopee_refresh_token",
  "externalId": "shopee-seller-123",
  "metadata": "{\"sellerId\": \"123456\"}"
}
```

3. **Create product listings**
```bash
POST /api/product-listings
{
  "accountId": 1,
  "integrationId": 1,
  "productId": 5,
  "productVariantId": 10,
  "title": "Nike Running Shoe - Red Size 10",
  "description": "Brand new Nike running shoe",
  "integrationCategoryId": 100,
  "price": 129.99,
  "stock": 25,
  "stockSyncEnabled": true,
  "priceSyncEnabled": true,
  "currency": "SGD",
  "status": 1
}
```

4. **Monitor listing sync status**
```bash
GET /api/product-listings?accountId=1&status=1
```

---

### Workflow 4: Processing Orders from Marketplace

1. **Fetch orders** (typically via webhook or polling)
```bash
GET /api/orders?accountId=1&integrationId=1&paymentStatus=paid&fulfillmentStatus=pending
```

2. **Get order details** with items
```bash
GET /api/orders/50
```

3. **Update fulfillment status**
```bash
PATCH /api/orders/50
{
  "fulfillmentStatus": "processing",
  "physicalFulfillmentStatus": "picking"
}
```

4. **Update order items** with tracking
```bash
PATCH /api/order-items/100
{
  "fulfillmentStatus": 2,
  "shipmentProvider": "DHL",
  "trackingNumber": "DHL123456789"
}
```

5. **Create alerts** if needed
```bash
POST /api/order-alerts
{
  "orderId": 50,
  "message": "Low stock for order item - need to reorder",
  "type": 2,
  "status": 1
}
```

---

### Workflow 5: Inventory Batch Management

1. **Create a batch** for incoming inventory
```bash
POST /api/batches
Headers:
  Authorization: Bearer <token>
  x-shop-id: 1

Body:
{
  "name": "January 2025 Shipment",
  "notes": "New year inventory from China",
  "restockDate": "2025-01-20",
  "eta": "2025-01-25",
  "location": "Warehouse A",
  "mode": "Sea Freight",
  "status": 1,
  "regionId": 5,
  "containerNumber": "CONT-123456",
  "originCurrency": "CNY",
  "currency": "USD",
  "rate": "0.14"
}
```

2. **Track batch status**
```bash
GET /api/batches/1
```

3. **When batch arrives, update inventory**
```bash
POST /api/product-inventory/1/adjust-stock
{
  "adjustment": 500,
  "reason": "Batch arrival - CONT-123456"
}
```

4. **Update batch status**
```bash
PATCH /api/batches/1
{
  "status": 2,
  "notes": "Batch received and inventory updated"
}
```

---

## Status Code Reference

### Order Payment Status
- `pending` - Payment not yet received
- `paid` - Payment completed
- `refunded` - Payment refunded to customer
- `failed` - Payment failed

### Order Fulfillment Status
- `pending` - Order not yet fulfilled
- `processing` - Order being prepared
- `shipped` - Order shipped to customer
- `delivered` - Order delivered
- `cancelled` - Order cancelled

### Physical Fulfillment Status
- `not_started` - Fulfillment not started
- `picking` - Items being picked from warehouse
- `packing` - Items being packed
- `ready_to_ship` - Package ready for shipment
- `shipped` - Package shipped

### Order Item Fulfillment Status (integer)
- `0` - Not fulfilled
- `1` - Partially fulfilled
- `2` - Fully fulfilled

### Order Item Return Status (integer)
- `0` - No return
- `1` - Return requested
- `2` - Return approved
- `3` - Return completed

### Order Item Inventory Status (integer)
- `0` - Not allocated
- `1` - Allocated
- `2` - Deducted

### Alert Types (integer)
- `1` - Payment verification needed
- `2` - Low stock warning
- `3` - Fulfillment delay
- `4` - Customer inquiry
- `5` - System alert

### General Status Field (integer)
- `0` - Inactive/Disabled
- `1` - Active/Enabled
- `2` - Archived

---

## Troubleshooting

### Issue: 401 Unauthorized

**Cause**: Missing or invalid access token

**Solutions**:
1. Verify the `Authorization` header is present: `Bearer <token>`
2. Check if the token has expired (access tokens expire after 1 hour)
3. Refresh the token using `/api/auth/refresh`
4. If refresh token also expired, user must login again

---

### Issue: 403 Forbidden (Shop Access)

**Cause**: User doesn't have access to the shop specified in `x-shop-id` header

**Solutions**:
1. Verify the `x-shop-id` header matches a shop the user belongs to
2. Get user's accessible shops via `GET /api/users/me/shops`
3. Ensure shop ID is sent as a string, not a number

---

### Issue: 404 Not Found

**Cause**: Resource doesn't exist or has been soft-deleted

**Solutions**:
1. Verify the resource ID is correct
2. Check if the resource belongs to the correct shop
3. Resource may have been deleted (soft-delete) - check with admin

---

### Issue: 409 Conflict

**Cause**: Resource already exists (duplicate email, SKU, slug, etc.)

**Solutions**:
1. Check if the resource already exists in the system
2. Use unique values for fields like email, SKU, slug
3. If updating, use PATCH instead of POST

---

### Issue: 429 Too Many Requests

**Cause**: Rate limit exceeded (100 requests per 60 seconds)

**Solutions**:
1. Implement exponential backoff strategy
2. Cache frequently accessed data
3. Batch requests where possible
4. Check `X-RateLimit-Reset` header for reset time

---

### Issue: Pagination Not Working

**Cause**: Invalid page or limit parameters

**Solutions**:
1. Ensure `page` is >= 1
2. Ensure `limit` is <= 100
3. Both parameters must be integers
4. Use query string format: `?page=1&limit=10`

---

### Issue: Relationships Not Loading

**Cause**: Relationships are lazy-loaded by default

**Solutions**:
1. Use specific GET endpoints that include relationships (e.g., `GET /api/orders/:id`)
2. List endpoints include basic relationships automatically
3. Check the endpoint documentation for which relationships are included

---

### Issue: Token Refresh Loop

**Cause**: Refresh token also expired

**Solutions**:
1. Implement proper token expiry checking
2. Refresh tokens expire after 7 days
3. If refresh fails with 401, redirect user to login
4. Don't auto-retry refresh more than once

---

### Issue: Stock Adjustment Not Reflected

**Cause**: Timing or incorrect endpoint usage

**Solutions**:
1. Use the stock adjustment endpoint: `POST /api/product-inventory/:id/adjust-stock`
2. Use negative values for deductions: `{"adjustment": -10}`
3. Use positive values for additions: `{"adjustment": 50}`
4. Verify the response shows updated stock value

---

### Issue: Multi-Shop Data Isolation

**Cause**: Shop ID not properly scoped

**Solutions**:
1. Always include `x-shop-id` header for shop-scoped endpoints
2. Users can only access shops they belong to
3. Check which shops user has access to via `/api/users/me/shops`
4. Global endpoints (auth, integrations, regions) don't require `x-shop-id`

---

## AI Agent Integration Guide

This section is specifically designed for AI agents building frontend applications or integrating with the ERP API Gateway.

### Quick Start for AI Agents

1. **Authentication Flow**
   - Users authenticate via `/api/auth/login` or `/api/auth/register`
   - Store `accessToken` and `refreshToken` securely
   - Include `Authorization: Bearer <accessToken>` in all authenticated requests
   - Automatically refresh tokens when receiving 401 errors

2. **Shop Context**
   - Most endpoints require `x-shop-id` header
   - Get available shops via `GET /api/users/me/shops`
   - Store current shop context in application state
   - Switch shops by changing the `x-shop-id` header value

3. **Data Fetching Patterns**
   - Use pagination for list endpoints (default: page=1, limit=10)
   - Filter data using query parameters (e.g., `?status=1&brandId=5`)
   - Single resource endpoints include relationships automatically
   - List endpoints return paginated responses with metadata

### Key Endpoints for Dashboard/Frontend

#### Initial App Load
```javascript
// 1. After login, get user profile
GET /api/auth/profile

// 2. Get user's accessible shops
GET /api/users/me/shops

// 3. Set default shop and fetch initial data
Headers: { "x-shop-id": "1" }
GET /api/brands?page=1&limit=100
GET /api/product-types?page=1&limit=100
GET /api/product-categories/tree
GET /api/integrations
GET /api/regions
```

#### Product Management
```javascript
// List products with filters
GET /api/product-inventory?page=1&limit=20&brandId=5&status=1

// Get product details
GET /api/product-inventory/:id

// Create product
POST /api/product-inventory
Body: { sku, name, stock, sellingPrice, ... }

// Update product
PATCH /api/product-inventory/:id
Body: { name, stock, sellingPrice, ... }

// Adjust stock
POST /api/product-inventory/:id/adjust-stock
Body: { adjustment: -10, reason: "Sale" }
```

#### Order Management
```javascript
// List orders with filters
GET /api/orders?page=1&limit=20&paymentStatus=paid&fulfillmentStatus=pending

// Get order with items and alerts
GET /api/orders/:id

// Update order status
PATCH /api/orders/:id
Body: { fulfillmentStatus: "processing" }

// Update order item tracking
PATCH /api/order-items/:id
Body: { trackingNumber: "DHL123", shipmentProvider: "DHL" }
```

### State Management Recommendations

#### Global State (Redux/Zustand/Context)
```javascript
{
  auth: {
    user: { id, name, email },
    accessToken: "...",
    refreshToken: "...",
    isAuthenticated: true
  },
  shop: {
    currentShop: { id: 1, name: "My Shop" },
    availableShops: [...]
  },
  cache: {
    brands: [...],
    productTypes: [...],
    categories: [...],
    integrations: [...],
    regions: [...]
  }
}
```

#### API Client Example (JavaScript/TypeScript)
```javascript
class ApiClient {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.accessToken = null;
    this.refreshToken = null;
    this.currentShopId = null;
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  setShop(shopId) {
    this.currentShopId = shopId;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (this.currentShopId && !options.skipShopHeader) {
      headers['x-shop-id'] = this.currentShopId;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 and refresh token
    if (response.status === 401 && this.refreshToken) {
      const newTokens = await this.refreshAccessToken();
      if (newTokens) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
        return fetch(`${this.baseURL}${endpoint}`, { ...options, headers });
      }
    }

    return response;
  }

  async refreshAccessToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (response.ok) {
      const tokens = await response.json();
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens;
    }

    return null;
  }

  // Convenience methods
  get(endpoint, params, options) {
    const query = new URLSearchParams(params).toString();
    return this.request(`${endpoint}${query ? `?${query}` : ''}`, {
      method: 'GET',
      ...options,
    });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  patch(endpoint, data, options) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Usage
const api = new ApiClient('http://localhost:3000/api');

// Login
const loginResponse = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password',
});
const { tokens, user } = await loginResponse.json();
api.setTokens(tokens.accessToken, tokens.refreshToken);

// Set shop context
api.setShop(1);

// Make authenticated requests
const products = await api.get('/product-inventory', { page: 1, limit: 20 });
```

### Common UI Patterns

#### Multi-Select Filters
```javascript
// Example: Filter products by multiple criteria
const [filters, setFilters] = useState({
  brandId: null,
  categoryId: null,
  status: 1,
  page: 1,
  limit: 20
});

// API call
const { data, total, page, limit } = await api.get('/product-inventory', filters);
```

#### Infinite Scroll
```javascript
const [products, setProducts] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const response = await api.get('/product-inventory', { page, limit: 20 });
  const { data, total } = await response.json();

  setProducts(prev => [...prev, ...data]);
  setHasMore(products.length + data.length < total);
  setPage(prev => prev + 1);
};
```

#### Real-time Search
```javascript
// Debounced search
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);

useEffect(() => {
  const timer = setTimeout(async () => {
    if (searchTerm.length >= 3) {
      const response = await api.get('/product-inventory', {
        search: searchTerm,
        limit: 10
      });
      const { data } = await response.json();
      setSearchResults(data);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);
```

### Form Validation

#### Product Creation Form
```javascript
const productSchema = {
  sku: { required: true, minLength: 3, maxLength: 255 },
  name: { required: true, minLength: 1, maxLength: 255 },
  stock: { required: true, type: 'number', min: 0 },
  currency: { required: true, length: 3 },
  sellingPrice: { required: true, pattern: /^\d+(\.\d{1,2})?$/ },
  costPrice: { required: false, pattern: /^\d+(\.\d{1,2})?$/ },
  brandId: { required: false, type: 'number' },
  status: { required: true, type: 'number', enum: [0, 1, 2] }
};
```

#### Order Update Form
```javascript
const orderUpdateSchema = {
  fulfillmentStatus: {
    required: false,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  physicalFulfillmentStatus: {
    required: false,
    enum: ['not_started', 'picking', 'packing', 'ready_to_ship', 'shipped']
  },
  notes: { required: false, type: 'string', maxLength: 1000 }
};
```

### Error Handling for AI Agents

```javascript
async function handleApiCall(apiFunction) {
  try {
    const response = await apiFunction();

    if (!response.ok) {
      const error = await response.json();

      switch (response.status) {
        case 400:
          // Validation error - show field-specific errors
          return { success: false, errors: error.message };

        case 401:
          // Unauthorized - token expired, refresh handled automatically
          return { success: false, error: 'Please login again' };

        case 403:
          // Forbidden - no access to shop
          return { success: false, error: 'No access to this shop' };

        case 404:
          // Not found
          return { success: false, error: 'Resource not found' };

        case 409:
          // Conflict - duplicate resource
          return { success: false, error: 'Resource already exists' };

        case 429:
          // Rate limit exceeded
          await sleep(1000);
          return handleApiCall(apiFunction); // Retry

        default:
          return { success: false, error: 'An error occurred' };
      }
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
```

### Performance Optimization Tips

1. **Cache static data**: Brands, product types, categories, integrations, regions rarely change
2. **Implement pagination**: Don't fetch all records at once
3. **Use query parameters**: Filter data server-side instead of client-side
4. **Debounce search inputs**: Wait 300ms before making API calls
5. **Batch operations**: Group multiple updates when possible
6. **Lazy load relationships**: Only fetch related data when needed
7. **Implement optimistic updates**: Update UI immediately, sync with server
8. **Use WebSocket/SSE**: For real-time order updates (future feature)

---

## Rate Limiting

- **Default**: 100 requests per 60 seconds
- **Per IP**: Rate limit applies per IP address
- **Headers**: Rate limit info included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

---

## Best Practices

1. **Always include shop context**: Use `x-shop-id` header for shop-scoped operations
2. **Implement token refresh**: Automatically refresh tokens before expiration
3. **Handle rate limits**: Implement exponential backoff for rate limit errors
4. **Use pagination**: Always paginate large result sets
5. **Filter when possible**: Use query parameters to reduce response size
6. **Soft deletes**: Deleted resources return 404 but remain in database
7. **Validate input**: All fields are validated according to DTOs
8. **HTTPS only**: Use HTTPS in production
9. **Store tokens securely**: Never expose tokens in client-side code
10. **Monitor webhooks**: Set up webhook handlers for real-time updates (future feature)

---

## Support & Contact

For API support and integration questions:
- **Documentation**: This document
- **Issues**: Report at your issue tracker
- **Email**: api-support@yourcompany.com

---

## Changelog

### Version 1.0.1 (2025-01-18)
- **Entity Schema Updates**: All entities updated to match actual database schemas
- **Data Type Precision**: Monetary fields now use `decimal(18,4)` precision stored as strings
- **Soft Delete Changes**: Removed soft delete from Brand, ProductType, and ProductCategory entities
- **Field Type Corrections**: Fixed column types (`bigint`, `tinyint`, `varchar` lengths) across all entities
- **Removed Fields**: Removed non-existent fields (external_id from Brand, description/position/status from ProductCategory)
- **Added Fields**: Added missing fields (option1/2/3, dimensions, colors to ProductVariant)

### Version 1.0.0 (2025-01-15)
- Initial API release
- 16 modules with full CRUD operations
- JWT authentication with refresh tokens
- Multi-tenant shop architecture
- Marketplace integrations support
- Inventory and order management

---

**End of Documentation**
