
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard as Edit, Trash2, Package, Tag, Box, MapPin } from 'lucide-react';
import { InventoryItem, Batch, BatchItem } from '@/types';
import { inventoryApi, batchItemsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [batches, setBatches] = useState<Array<Batch & { batchItem: BatchItem }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBatchesLoading, setIsBatchesLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!id || !item) return;
    if (!confirm(`Are you sure you want to delete item "${item.sku}"? This action cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await inventoryApi.delete(id);
      router.push('/inventory');
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
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
            <p className="text-gray-600 mt-2">Inventory item details and stock information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push(`/inventory/${item.id}/edit`)} className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            isLoading={isDeleting}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-bold ${
                    item.stock === 0 
                      ? 'text-red-600' 
                      : item.stock < 10 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                  }`}>
                    {item.stock}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    item.stock === 0 
                      ? 'bg-red-100 text-red-800' 
                      : item.stock < 10 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.stock === 0 ? 'Out of Stock' : item.stock < 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(item.costPrice ?? 0)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(item.sellingPrice)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
                <p className="text-lg font-semibold text-emerald-600">
                  {formatCurrency(item.sellingPrice - (item.costPrice ?? 0))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round(((item.sellingPrice - (item.costPrice ?? 0)) / (item.costPrice ?? 1)) * 100)}%)
                  </span>
                </p>
              </div>
            </div>
          </Card>
          {/* Classifications */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Classifications</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <p className="text-lg text-gray-900">{item.brand?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <p className="text-lg text-gray-900">{item.category?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <p className="text-lg text-gray-900">{item.productType?.name || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Product Information</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  item.status === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status === 1 ? 'Active' : 'Inactive'}
                </span>
              </div>
              {item.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{item.description}</p>
                </div>
              )}
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
      {/* Package Information */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Box className="h-5 w-5" />
          <span>Package Information</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Courier Type</label>
            <p className="text-lg text-gray-900">{item.courierType || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Required</label>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              item.assembly
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.assembly ? 'Yes' : 'No'}
            </span>
          </div>
          {item.packagingDetail && (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Details</label>
              <p className="text-gray-900">{item.packagingDetail}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Package Dimensions & Weight */}
      {(item.parcelWeight || item.parcelLength || item.parcelWidth || item.parcelHeight || item.packagingType) && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Box className="h-5 w-5" />
            <span>Package Dimensions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {item.packagingType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Packing Type</label>
                  <p className="text-lg text-gray-900">{item.packagingType}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <p className="text-lg text-gray-900">{item.parcelWeight ? `${item.parcelWeight} kg` : 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                <p className="text-lg text-gray-900">{item.parcelLength ? `${item.parcelLength} cm` : 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <p className="text-lg text-gray-900">{item.parcelWidth ? `${item.parcelWidth} cm` : 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <p className="text-lg text-gray-900">{item.parcelHeight ? `${item.parcelHeight} cm` : 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Product Dimensions & Weight */}
      {(item.weight || item.length || item.width || item.height) && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Box className="h-5 w-5" />
            <span>Product Dimensions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <p className="text-lg text-gray-900">{item.weight ? `${item.weight} kg` : 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
              <p className="text-lg text-gray-900">{item.length ? `${item.length} cm` : 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <p className="text-lg text-gray-900">{item.width ? `${item.width} cm` : 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <p className="text-lg text-gray-900">{item.height ? `${item.height} cm` : 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Features */}
      {item.features && Object.keys(item.features).length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(item.features).map(([key, value]) => (
              <div key={key} className="bg-gray-50 px-4 py-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                <p className="text-lg text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Batches Section */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Batch History</span>
        </h2>
        {isBatchesLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No batch history available</p>
            <p className="text-sm text-gray-400 mt-1">
              This item hasn't been included in any batches yet
            </p>
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
    </div>
  );
}
