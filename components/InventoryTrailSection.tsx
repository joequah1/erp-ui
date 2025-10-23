"use client";
import React, { useState, useEffect } from 'react';
import { History, Package, ShoppingCart, RefreshCcw, TrendingUp, TrendingDown, Minus, ArrowRightLeft, AlertCircle, Box } from 'lucide-react';
import { ProductInventoryTrail, InventoryTrailType } from '@/types';
import { inventoryTrailsApi, InventoryTrailFilters } from '@/services/inventoryTrails';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Select } from './ui/Select';

interface InventoryTrailSectionProps {
  inventoryId: string;
}

export function InventoryTrailSection({ inventoryId }: InventoryTrailSectionProps) {
  const [trails, setTrails] = useState<ProductInventoryTrail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<InventoryTrailFilters>({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTrails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadTrails = async () => {
    setIsLoading(true);
    try {
      const response = await inventoryTrailsApi.getByInventoryId(inventoryId, filters);
      setTrails(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load inventory trails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof InventoryTrailFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: key !== 'page' ? 1 : value,
    }));
  };

  const getTypeIcon = (type: InventoryTrailType) => {
    switch (type) {
      case 0: return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 1: return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 2: return <RefreshCcw className="h-5 w-5 text-blue-600" />;
      case 3: return <ArrowRightLeft className="h-5 w-5 text-purple-600" />;
      case 4: return <Minus className="h-5 w-5 text-gray-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: InventoryTrailType) => {
    switch (type) {
      case 0: return 'Deduction';
      case 1: return 'Addition';
      case 2: return 'Set';
      case 3: return 'Transfer';
      case 4: return 'No Change';
      default: return 'Unknown';
    }
  };

  const getTypeBadgeClass = (type: InventoryTrailType) => {
    switch (type) {
      case 0: return 'bg-red-100 text-red-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-purple-100 text-purple-800';
      case 4: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelatedTypeIcon = (relatedType?: string | null) => {
    if (!relatedType) return null;
    if (relatedType.includes('Order')) return <ShoppingCart className="h-4 w-4" />;
    if (relatedType.includes('ProductListing')) return <Package className="h-4 w-4" />;
    if (relatedType.includes('ProductInventory') || relatedType.includes('ProductVariant')) return <Box className="h-4 w-4" />;
    return null;
  };

  const getRelatedTypeLabel = (relatedType?: string | null) => {
    if (!relatedType) return 'Manual Update';
    if (relatedType.includes('Order')) return 'Order';
    if (relatedType.includes('ProductListing')) return 'Listing Sync';
    if (relatedType.includes('ProductInventory')) return 'Inventory Update';
    if (relatedType.includes('ProductVariant')) return 'Product';
    return 'System';
  };

  const getRelatedTypeBadgeClass = (relatedType?: string | null) => {
    if (!relatedType) return 'bg-gray-100 text-gray-800';
    if (relatedType.includes('Order')) return 'bg-blue-100 text-blue-800';
    if (relatedType.includes('ProductListing')) return 'bg-purple-100 text-purple-800';
    if (relatedType.includes('ProductInventory')) return 'bg-orange-100 text-orange-800';
    if (relatedType.includes('ProductVariant')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStockChange = (trail: ProductInventoryTrail) => {
    const diff = trail.new - trail.old;
    if (diff === 0) return 'No change';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff}`;
  };

  const totalPages = Math.ceil(total / (filters.limit || 20));

  return (
    <Card>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Stock History & Activity Log</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Track all stock changes, orders, and updates ({total} records)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Trail Type"
          value={filters.type?.toString() || ''}
          onChange={(e) => handleFilterChange('type', e.target.value ? parseInt(e.target.value) : undefined)}
          options={[
            { value: '0', label: 'Deduction' },
            { value: '1', label: 'Addition' },
            { value: '2', label: 'Set' },
            { value: '3', label: 'Transfer' },
            { value: '4', label: 'No Change' },
          ]}
          placeholder="All types"
        />
        <Select
          label="Related To"
          value={filters.relatedType || ''}
          onChange={(e) => handleFilterChange('relatedType', e.target.value || undefined)}
          options={[
            { value: 'App\\Models\\Order', label: 'Order' },
            { value: 'App\\Models\\ProductListing', label: 'Listing Sync' },
            { value: 'App\\Models\\ProductInventory', label: 'Inventory Update' },
            { value: 'App\\Models\\ProductVariant', label: 'Product' },
          ]}
          placeholder="All sources"
        />
        <Select
          label="Per Page"
          value={filters.limit?.toString() || '20'}
          onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          options={[
            { value: '10', label: '10' },
            { value: '20', label: '20' },
            { value: '50', label: '50' },
            { value: '100', label: '100' },
          ]}
        />
      </div>

      {/* Trails List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : trails.length === 0 ? (
        <div className="text-center py-12">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
          <p className="text-gray-600">
            {filters.type !== undefined || filters.relatedType
              ? 'No trails found with the selected filters'
              : 'Stock changes will appear here'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {trails.map((trail) => (
              <div key={trail.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  {/* Type and Related Type badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center">
                      {getTypeIcon(trail.type)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(trail.type)}`}>
                      {getTypeLabel(trail.type)}
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelatedTypeBadgeClass(trail.relatedType)}`}>
                      {getRelatedTypeIcon(trail.relatedType)}
                      <span>{getRelatedTypeLabel(trail.relatedType)}</span>
                    </span>
                    {trail.batch && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Batch: {trail.batch.containerNumber || trail.batch.name}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-sm text-gray-900 font-medium">{trail.message}</p>

                  {/* Stock change and details */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Stock:</span>
                      <span className="font-mono font-medium text-gray-900">{trail.old}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono font-medium text-gray-900">{trail.new}</span>
                      <span className={`font-medium ${trail.new > trail.old ? 'text-green-600' : trail.new < trail.old ? 'text-red-600' : 'text-gray-600'}`}>
                        ({getStockChange(trail)})
                      </span>
                    </div>
                    {trail.unitCost && (
                      <div className="text-gray-500">
                        <span>Cost: </span>
                        <span className="font-medium text-gray-900">${trail.unitCost}</span>
                      </div>
                    )}
                    {trail.unitSellingPrice && (
                      <div className="text-gray-500">
                        <span>Price: </span>
                        <span className="font-medium text-gray-900">${trail.unitSellingPrice}</span>
                      </div>
                    )}
                  </div>

                  {/* User and date */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {trail.user && (
                      <span>By: <span className="font-medium text-gray-700">{trail.user.name}</span></span>
                    )}
                    <span>{formatDate(trail.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-500">
                Showing {((filters.page || 1) - 1) * (filters.limit || 20) + 1} to{' '}
                {Math.min((filters.page || 1) * (filters.limit || 20), total)} of {total} records
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                  disabled={(filters.page || 1) === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {filters.page || 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                  disabled={(filters.page || 1) >= totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
