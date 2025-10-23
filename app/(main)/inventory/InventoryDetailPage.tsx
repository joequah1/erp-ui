"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard as Edit, Trash2, Package, Tag, Box, MapPin, History, Store, FileText } from 'lucide-react';
import { InventoryItem, Batch, BatchItem } from '@/types';
import { inventoryApi, batchItemsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InventoryTrailSection } from '@/components/InventoryTrailSection';
import { ProductListingSection } from '@/components/ProductListingSection';

interface InventoryDetailPageProps {
  id: string;
}

type TabType = 'details' | 'batches' | 'history' | 'listings';

export default function InventoryDetailPage({ id }: InventoryDetailPageProps) {
  const router = useRouter();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [batches, setBatches] = useState<Array<Batch & { batchItem: BatchItem }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBatchesLoading, setIsBatchesLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('details');

  useEffect(() => {
    if (id) {
      loadItem();
      loadBatches();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadItem = async () => {
    if (!id) return;
    try {
      const result = await inventoryApi.getById(id);
      
      setItem(result);
    } catch (error) {
      console.error('Failed to load inventory item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBatches = async () => {
    if (!id) return;
    try {
      const result = await batchItemsApi.getByInventoryItemId(id);
      setBatches(result);
    } catch (error) {
      console.error('Failed to load batch history:', error);
    } finally {
      setIsBatchesLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await inventoryApi.delete(id);
      router.push('/inventory');
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Item not found</h3>
        <p className="text-gray-600 mb-4">The inventory item you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/inventory')}>Back to Inventory</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'details' as TabType, label: 'Details', icon: FileText },
    { id: 'batches' as TabType, label: 'Batches', icon: Package, count: batches.length },
    { id: 'history' as TabType, label: 'Stock History', icon: History },
    { id: 'listings' as TabType, label: 'Marketplace', icon: Store },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/inventory')} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{item.sku}</h1>
            <p className="text-gray-600 mt-2">{item.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push(`/inventory/${item.id}/edit`)} className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content - DETAILS */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Details */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Basic Information</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <p className="text-lg font-mono bg-gray-50 px-3 py-2 rounded-lg">{item.sku}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <p className="text-lg text-gray-900">{item.name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
                    <p className="text-lg text-gray-900">{item.shortName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                    <p className="text-lg font-mono text-gray-900">{item.barcode || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-2xl font-bold ${
                        item.stock === 0 ? 'text-red-600' : item.stock < 10 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {item.stock}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        item.stock === 0 ? 'bg-red-100 text-red-800' : item.stock < 10 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.stock === 0 ? 'Out of Stock' : item.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(item.costPrice ?? 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(item.sellingPrice ?? 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
                    <p className="text-lg font-semibold text-emerald-600">
                      {formatCurrency((item.sellingPrice ?? 0) - (item.costPrice ?? 0))}
                      <span className="text-sm text-gray-500 ml-2">
                        ({Math.round((((item.sellingPrice ?? 0) - (item.costPrice ?? 0)) / (item.costPrice ?? 1)) * 100)}%)
                      </span>
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-900">{item.description || '-'}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Classifications */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Classifications</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <p className="text-gray-900">{item.brand?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-gray-900">{item.category?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                    <p className="text-gray-900">{item.productType?.name || '-'}</p>
                  </div>
                </div>
              </Card>

              {/* Timestamps */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-sm text-gray-600">{formatDate(item.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-sm text-gray-600">{formatDate(item.updatedAt)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Full width sections */}
          {/* Package Information & Dimensions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Box className="h-5 w-5" />
              <span>Package Information & Dimensions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Courier Type</label>
                <p className="text-lg text-gray-900">{item.courierType || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                <p className="text-lg text-gray-900">{item.packagingType || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Required</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  item.assembly ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.assembly ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Weight (kg)</label>
                <p className="text-lg text-gray-900">{item.parcelWeight || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Length (cm)</label>
                <p className="text-lg text-gray-900">{item.parcelLength || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Width (cm)</label>
                <p className="text-lg text-gray-900">{item.parcelWidth || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Height (cm)</label>
                <p className="text-lg text-gray-900">{item.parcelHeight || '-'}</p>
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Details</label>
                <p className="text-gray-900">{item.packagingDetail || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Product Dimensions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Box className="h-5 w-5" />
              <span>Product Dimensions (Actual Product)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <p className="text-lg text-gray-900">{item.weight || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                <p className="text-lg text-gray-900">{item.length || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                <p className="text-lg text-gray-900">{item.width || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <p className="text-lg text-gray-900">{item.height || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Features</span>
            </h2>
            {item.features && Object.keys(item.features).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(item.features).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 px-4 py-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                    <p className="text-lg text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No features defined</p>
            )}
          </Card>
        </div>
      )}

      {/* Tab Content - BATCHES */}
      {activeTab === 'batches' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Batch History</span>
          </h3>
          {isBatchesLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No batch history available</p>
              <p className="text-sm text-gray-400 mt-1">This item hasn't been included in any batches yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Container #</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">ETA</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Arrival Date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Cost</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span
                          className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                          onClick={() => router.push(`/batches/${batch.id}`)}
                        >
                          {batch.containerNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(batch.eta).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {batch.arrivalDate ? new Date(batch.arrivalDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {batch.batchItem.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {batch.batchItem.currency} {batch.batchItem.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          batch.status === 'completed' ? 'bg-green-100 text-green-800' :
                          batch.status === 'arrived' ? 'bg-blue-100 text-blue-800' :
                          batch.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                          batch.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {batch.status.charAt(0).toUpperCase() + batch.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab Content - HISTORY */}
      {activeTab === 'history' && (
        <InventoryTrailSection inventoryId={id} />
      )}

      {/* Tab Content - LISTINGS */}
      {activeTab === 'listings' && (
        <ProductListingSection inventoryId={id} />
      )}
    </div>
  );
}
