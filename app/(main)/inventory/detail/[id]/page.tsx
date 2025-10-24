
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard as Edit, Trash2, Package, Tag, Box, MapPin } from 'lucide-react';
import { InventoryItem } from '../../../../../types';
import { inventoryApi } from '../../../../../services/api';
import { Button } from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { LoadingSpinner } from '../../../../../components/ui/LoadingSpinner';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadItem();
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
                    item.quantity === 0 
                      ? 'text-red-600' 
                      : item.quantity < 10 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                  }`}>
                    {item.quantity}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    item.quantity === 0 
                      ? 'bg-red-100 text-red-800' 
                      : item.quantity < 10 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.quantity === 0 ? 'Out of Stock' : item.quantity < 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(item.cost)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Retail Price</label>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(item.retailPrice)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Oriental Price</label>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(item.orientalPrice)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
                <p className="text-lg font-semibold text-emerald-600">
                  {formatCurrency(item.retailPrice - item.cost)} 
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round(((item.retailPrice - item.cost) / item.cost) * 100)}%)
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
                {item.brand?.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.brand.description}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <p className="text-lg text-gray-900">{item.category?.name || 'N/A'}</p>
                {item.category?.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.category.description}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <p className="text-lg text-gray-900">{item.productType?.name || 'N/A'}</p>
                {item.productType?.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.productType.description}</p>
                )}
              </div>
            </div>
          </Card>
          {/* Dynamic Features */}
          {item.dynamicFeatures && Object.keys(item.dynamicFeatures).length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Box className="h-5 w-5" />
                <span>Product Features</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(item.dynamicFeatures).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <p className="text-gray-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Warehouse Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                <p className="text-gray-900">{item.warehouse}</p>
              </div>
              {item.courier && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Courier</label>
                  <p className="text-gray-900">{item.courier}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assembly Required</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  item.assembly 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.assembly ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </Card>
          {/* Physical Properties */}
          {(item.weight || item.dimensions) && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Properties</h3>
              <div className="space-y-3">
                {item.weight && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <p className="text-gray-900">{item.weight} kg</p>
                  </div>
                )}
                {item.dimensions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <p className="text-gray-900">
                      {item.dimensions.length} × {item.dimensions.width} × {item.dimensions.height} cm
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Volume: {(item.dimensions.length * item.dimensions.width * item.dimensions.height).toLocaleString()} cm³
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
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
      {/* Batches Section */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Batch History</span>
        </h2>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No batch history available</p>
          <p className="text-sm text-gray-400 mt-1">
            This item hasn't been included in any batches yet
          </p>
        </div>
      </Card>
    </div>
  );
}
