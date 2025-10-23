"use client";
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Search, Filter } from 'lucide-react';
import { InventoryItem, PaginatedResponse, FilterOptions, Brand, Category, ProductType } from '@/types';
import { inventoryApi, brandsApi, categoriesApi, productTypesApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { useRouter } from 'next/navigation';

export default function InventoryListPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<PaginatedResponse<InventoryItem>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    }
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    perPage: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
    loadFilterOptions();
    // eslint-disable-next-line
  }, [filters]);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const result = await inventoryApi.getAll(filters);
      setInventory(result);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [brandsResult, categoriesResult, productTypesResult] = await Promise.all([
        brandsApi.getAll(),
        categoriesApi.getAll(),
        productTypesApi.getAll()
      ]);
      setBrands(brandsResult);
      setCategories(categoriesResult);
      setProductTypes(productTypesResult);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to first page unless changing page
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeout(() => {
      handleFilterChange('search', value || undefined);
    }, 300);
  };

  const flattenCategories = (categories: Category[]): Category[] => {
    const result: Category[] = [];
    const flatten = (cats: Category[]) => {
      cats.forEach(cat => {
        result.push(cat);
        if (cat.children) {
          flatten(cat.children);
        }
      });
    };
    flatten(categories);
    return result;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPageNumbers = () => {
    const { current_page, last_page } = inventory.meta;
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    let end = Math.min(last_page, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleView = (id: string) => {
    router.push(`/inventory/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/inventory/${id}/edit`);
  };

  const handleDelete = async (id: string, sku: string) => {
    if (!confirm(`Are you sure you want to delete item "${sku}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await inventoryApi.delete(id);
      await loadInventory();
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory, stock levels, and pricing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/inventory/import-export')} className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import/Export</span>
          </Button>
          <Button onClick={() => router.push('/inventory/create')} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>
      {/* Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by SKU or warehouse..."
                className="pl-10"
                onChange={handleSearch}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Brand"
                value={filters.brandId || ''}
                onChange={(e) => handleFilterChange('brandId', e.target.value || undefined)}
                options={brands.map(brand => ({ value: brand.id, label: brand.name }))}
                placeholder="All brands"
              />
              <Select
                label="Category"
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                options={flattenCategories(categories).map(cat => ({ value: cat.id, label: cat.name }))}
                placeholder="All categories"
              />
              <Select
                label="Product Type"
                value={filters.productTypeId || ''}
                onChange={(e) => handleFilterChange('productTypeId', e.target.value || undefined)}
                options={productTypes.map(pt => ({ value: pt.id, label: pt.name }))}
                placeholder="All types"
              />
              <Select
                label="Sort By"
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
                options={[
                  { value: 'createdAt', label: 'Date Created' },
                  { value: 'sku', label: 'SKU' },
                  { value: 'quantity', label: 'Quantity' },
                  { value: 'cost', label: 'Cost' },
                  { value: 'retailPrice', label: 'Retail Price' }
                ]}
              />
            </div>
          )}
        </div>
      </Card>
      {/* Inventory Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : inventory.data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first inventory item.</p>
            <Button onClick={() => router.push('/inventory/create')}>Add First Item</Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">SKU</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Brand</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-900">Quantity</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-900">Cost</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-900">Retail Price</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Warehouse</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventory.data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer" onClick={() => handleView(item.id)}>
                          {item.sku}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{item.brand?.name || 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-900">{item.category?.name || 'N/A'}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-medium ${
                          item.stock === 0 
                            ? 'text-red-600' 
                            : item.stock < 10 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-medium">{formatCurrency(item.costPrice ?? 0)}</td>
                      <td className="py-4 px-6 text-right font-medium">{formatCurrency(item.sellingPrice)}</td>
                      <td className="py-4 px-6 text-gray-900">{item.name}</td>
                      <td className="py-4 px-6 text-center">
                        <ActionMenu
                          onView={() => handleView(item.id)}
                          onEdit={() => handleEdit(item.id)}
                          onDelete={() => handleDelete(item.id, item.sku)}
                          isDeleting={deletingId === item.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {inventory.meta.last_page > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((inventory.meta.current_page - 1) * inventory.meta.per_page) + 1} to{' '}
                  {Math.min(inventory.meta.current_page * inventory.meta.per_page, inventory.meta.total)} of{' '}
                  {inventory.meta.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={inventory.meta.current_page === 1}
                    onClick={() => handleFilterChange('page', inventory.meta.current_page - 1)}
                  >
                    Previous
                  </Button>
                  {getPageNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      variant={pageNum === inventory.meta.current_page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('page', pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={inventory.meta.current_page === inventory.meta.last_page}
                    onClick={() => handleFilterChange('page', inventory.meta.current_page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
