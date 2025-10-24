
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { inventoryApi, brandsApi, categoriesApi, productTypesApi } from '../../../../services/api';
import { Brand, Category, ProductType } from '../../../../types';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Card } from '../../../../components/ui/Card';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { inventoryItemSchema, type InventoryItemFormData } from '../../../../validation/schemas';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [formData, setFormData] = useState<InventoryItemFormData & { 
    dimensionsEnabled: boolean;
    dynamicFeaturesJson: string;
  }>({
    sku: '',
    quantity: 0,
    cost: 0,
    retailPrice: 0,
    orientalPrice: 0,
    brandId: '',
    categoryId: '',
    productTypeId: '',
    warehouse: '',
    weight: undefined,
    dimensions: undefined,
    courier: '',
    assembly: false,
    dynamicFeatures: {},
    dimensionsEnabled: false,
    dynamicFeaturesJson: '{}'
  });
  const [errors, setErrors] = useState<Partial<InventoryItemFormData>>({});

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
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
      console.error('Failed to load options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = value === '' ? undefined : Number(value);
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (errors[name as keyof InventoryItemFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDimensionChange = (field: 'length' | 'width' | 'height', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({
      ...prev,
      dimensions: {
        length: prev.dimensions?.length || 0,
        width: prev.dimensions?.width || 0,
        height: prev.dimensions?.height || 0,
        [field]: numValue
      }
    }));
  };

  const handleDynamicFeaturesChange = (value: string) => {
    setFormData(prev => ({ ...prev, dynamicFeaturesJson: value }));
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, dynamicFeatures: parsed }));
    } catch {
      // Invalid JSON, keep the string for editing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      ...formData,
      dimensions: formData.dimensionsEnabled ? formData.dimensions : undefined,
      weight: formData.weight || undefined
    };
    const result = inventoryItemSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Partial<InventoryItemFormData> = {};
      (result.error.issues ?? []).forEach((error: any) => {
        if (error.path && error.path[0]) {
          fieldErrors[error.path[0] as keyof InventoryItemFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      await inventoryApi.create(result.data);
      router.push('/inventory');
    } catch (error) {
      console.error('Failed to create inventory item:', error);
      setErrors({
        sku: error instanceof Error ? error.message : 'Failed to create item'
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isLoadingOptions) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/inventory')} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Inventory Item</h1>
          <p className="text-gray-600 mt-2">Create a new inventory item with complete details</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SKU *"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                error={errors.sku}
                placeholder="e.g., APL-IPH15-BLK"
              />
              <Input
                label="Quantity *"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity ? String(errors.quantity) : undefined}
                placeholder="0"
              />
              <Input
                label="Cost *"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                error={errors.cost ? String(errors.cost) : undefined}
                placeholder="0.00"
              />
              <Input
                label="Retail Price *"
                name="retailPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.retailPrice}
                onChange={handleChange}
                error={errors.retailPrice ? String(errors.retailPrice) : undefined}
                placeholder="0.00"
              />
              <Input
                label="Oriental Price *"
                name="orientalPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.orientalPrice}
                onChange={handleChange}
                error={errors.orientalPrice ? String(errors.orientalPrice) : undefined}
                placeholder="0.00"
              />
              <Input
                label="Warehouse *"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                error={errors.warehouse}
                placeholder="Main Warehouse"
              />
            </div>
          </Card>
          {/* Classifications */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Classifications</h2>
            <div className="space-y-4">
              <Select
                label="Brand *"
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                options={brands.map(brand => ({ value: brand.id, label: brand.name }))}
                placeholder="Select brand"
                error={errors.brandId}
              />
              <Select
                label="Category *"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={flattenCategories(categories).map(cat => ({ value: cat.id, label: cat.name }))}
                placeholder="Select category"
                error={errors.categoryId}
              />
              <Select
                label="Product Type *"
                name="productTypeId"
                value={formData.productTypeId}
                onChange={handleChange}
                options={productTypes.map(pt => ({ value: pt.id, label: pt.name }))}
                placeholder="Select product type"
                error={errors.productTypeId}
              />
            </div>
          </Card>
        </div>
        {/* Additional Details */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Weight (kg)"
                name="weight"
                type="number"
                min="0"
                step="0.01"
                value={formData.weight || ''}
                onChange={handleChange}
                placeholder="0.00"
                helperText="Optional weight in kilograms"
              />
              <Input
                label="Courier"
                name="courier"
                value={formData.courier || ''}
                onChange={handleChange}
                placeholder="DHL, FedEx, etc."
                helperText="Preferred shipping courier"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="assembly"
                  name="assembly"
                  checked={formData.assembly}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="assembly" className="text-sm font-medium text-gray-700">
                  Requires Assembly
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dimensionsEnabled"
                  checked={formData.dimensionsEnabled}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dimensionsEnabled: e.target.checked,
                    dimensions: e.target.checked ? { length: 0, width: 0, height: 0 } : undefined
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="dimensionsEnabled" className="text-sm font-medium text-gray-700">
                  Include Dimensions
                </label>
              </div>
              {formData.dimensionsEnabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Length"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions?.length || ''}
                      onChange={(e) => handleDimensionChange('length', e.target.value)}
                    />
                    <Input
                      placeholder="Width"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions?.width || ''}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                    />
                    <Input
                      placeholder="Height"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions?.height || ''}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        {/* Dynamic Features */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dynamic Features</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Features (JSON Format)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              value={formData.dynamicFeaturesJson}
              onChange={(e) => handleDynamicFeaturesChange(e.target.value)}
              placeholder='{"color": "Black", "storage": "128GB", "connectivity": "WiFi"}'
            />
            <p className="text-sm text-gray-500">
              Enter product features as JSON key-value pairs. Example: "color": "Black", "storage": "128GB"
            </p>
          </div>
        </Card>
        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push('/inventory')}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Item</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
