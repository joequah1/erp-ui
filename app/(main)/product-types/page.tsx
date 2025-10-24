
"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload } from 'lucide-react';
import { ProductType } from '@/types';
import { productTypesApi, jobsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { ProductTypeModal } from './ProductTypeModal';
import { ImportExportModal } from '@/components/ImportExportModal';

export default function Page() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [filteredProductTypes, setFilteredProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  useEffect(() => {
    loadProductTypes();
  }, []);

  useEffect(() => {
    const filtered = productTypes.filter(productType =>
      productType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (productType.description && productType.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProductTypes(filtered);
  }, [productTypes, searchTerm]);

  const loadProductTypes = async () => {
    try {
      const result = await productTypesApi.getAll();
      setProductTypes(result);
    } catch (error) {
      console.error('Failed to load product types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProductType(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleView = (productType: ProductType) => {
    setSelectedProductType(productType);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (productType: ProductType) => {
    if (!confirm(`Are you sure you want to delete product type "${productType.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(productType.id);
    try {
      await productTypesApi.delete(productType.id);
      await loadProductTypes();
    } catch (error) {
      console.error('Failed to delete product type:', error);
      alert('Failed to delete product type. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async () => {
    await loadProductTypes();
    setIsModalOpen(false);
  };

  const handleImport = async (file: File, template: string) => {
    try {
      await jobsApi.startImport(file, `product-types-${template}`);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const handleExport = async (template: string) => {
    try {
      await jobsApi.startExport({}, `product-types-${template}`);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Types Management</h1>
          <p className="text-gray-600 mt-2">Define product types with custom attributes and properties</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportExportOpen(true)}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import/Export</span>
          </Button>
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Product Type</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search product types by name or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Product Types Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredProductTypes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No product types found' : 'No product types yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first product type.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>Add First Product Type</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Description</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Attributes</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Created</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProductTypes.map((productType) => (
                  <tr key={productType.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <span className="text-blue-600 font-medium text-sm">
                            {productType.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{productType.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {productType.description || 'No description'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(productType.attributes).slice(0, 3).map(key => (
                          <span
                            key={key}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                          >
                            {key}
                          </span>
                        ))}
                        {Object.keys(productType.attributes).length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            +{Object.keys(productType.attributes).length - 3} more
                          </span>
                        )}
                        {Object.keys(productType.attributes).length === 0 && (
                          <span className="text-sm text-gray-400">No attributes</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {formatDate(productType.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ActionMenu
                        onView={() => handleView(productType)}
                        onEdit={() => handleEdit(productType)}
                        onDelete={() => handleDelete(productType)}
                        isDeleting={deletingId === productType.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Product Type Modal */}
      <ProductTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        productType={selectedProductType}
        mode={modalMode}
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        title="Product Types Import/Export"
        templates={[
          { value: 'standard', label: 'Standard Template', description: 'Complete product type data with attributes' },
          { value: 'simplified', label: 'Simplified Template', description: 'Basic product type information only' }
        ]}
      />
    </div>
  );
}
