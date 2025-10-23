"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react';
import { inventoryApi, brandsApi, categoriesApi, productTypesApi } from '@/services/api';
import { Brand, Category, ProductType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Toggle } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { inventoryItemSchema, type InventoryItemFormData } from '@/validation/schemas';
import { useRouter } from 'next/navigation';

export default function InventoryCreatePage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [formData, setFormData] = useState<InventoryItemFormData>({
    sku: '',
    name: '',
    shortName: '',
    description: '',
    barcode: '',
    stock: 0,
    currency: 'USD',
    sellingPrice: 0,
    costPrice: 0,
    mainImage: '',
    brandId: '',
    categoryId: '',
    productTypeId: '',
    status: 1,
    courierType: undefined,
    assembly: false,
    packagingDetail: '',
  packagingType: '',
    parcelWeight: undefined,
    parcelLength: undefined,
    parcelWidth: undefined,
    parcelHeight: undefined,
    weight: undefined,
    length: undefined,
    width: undefined,
    height: undefined,
    features: {}
  });
  const [errors, setErrors] = useState<Partial<InventoryItemFormData>>({});
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = inventoryItemSchema.safeParse(formData);
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
      // Convert nulls to undefined for all nullable fields
      const cleanData = { ...result.data };
  const nullableFields = ['weight','length','width','height','parcelWeight','parcelLength','parcelWidth','parcelHeight','sellingPrice','costPrice'] as const;
      nullableFields.forEach(key => {
        if (cleanData[key] === null) {
          (cleanData as any)[key] = undefined;
        }
      });
      await inventoryApi.create(cleanData as any);
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

  const handleAddFeature = () => {
    if (featureKey.trim() && featureValue.trim()) {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [featureKey.trim()]: featureValue.trim()
        }
      }));
      setFeatureKey('');
      setFeatureValue('');
    }
  };

  const handleRemoveFeature = (key: string) => {
    setFormData(prev => {
      const newFeatures = { ...prev.features };
      delete newFeatures[key];
      return { ...prev, features: newFeatures };
    });
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
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g., iPhone 15 Black"
              />
              <Input
                label="Short Name"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                error={errors.shortName}
                placeholder="e.g., IP15-BLK"
              />
              <Input
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                error={errors.barcode}
                placeholder="e.g., 123456789012"
              />
              <Input
                label="Stock Quantity *"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock ? String(errors.stock) : undefined}
                placeholder="0"
              />
              <Input
                label="Currency *"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                error={errors.currency}
                placeholder="USD"
                maxLength={3}
              />
              <Input
                label="Cost Price"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice ?? ''}
                onChange={handleChange}
                error={errors.costPrice ? String(errors.costPrice) : undefined}
                placeholder="0.00"
              />
              <Input
                label="Selling Price *"
                name="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellingPrice ?? ''}
                onChange={handleChange}
                error={errors.sellingPrice ? String(errors.sellingPrice) : undefined}
                placeholder="0.00"
              />
              <Input
                label="Main Image URL"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                error={errors.mainImage}
                placeholder="https://example.com/image.jpg"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Product description..."
                />
              </div>
            </div>
          </Card>
          {/* Classifications */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Classifications</h2>
            <div className="space-y-4">
              <SearchableSelect
                label="Brand *"
                name="brandId"
                value={formData.brandId || ''}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, brandId: value }));
                  if (errors.brandId) setErrors(prev => ({ ...prev, brandId: undefined }));
                }}
                options={brands.map(brand => ({ value: brand.id, label: brand.name }))}
                placeholder="Select brand"
                error={errors.brandId}
              />
              <SearchableSelect
                label="Category *"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, categoryId: value }));
                  if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: undefined }));
                }}
                options={flattenCategories(categories).map(cat => ({ value: cat.id, label: cat.name }))}
                placeholder="Select category"
                error={errors.categoryId}
              />
              <SearchableSelect
                label="Product Type *"
                name="productTypeId"
                value={formData.productTypeId || ''}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, productTypeId: value }));
                  if (errors.productTypeId) setErrors(prev => ({ ...prev, productTypeId: undefined }));
                }}
                options={productTypes.map(pt => ({ value: pt.id, label: pt.name }))}
                placeholder="Select product type"
                error={errors.productTypeId}
              />
            </div>
          </Card>
        </div>

        {/* Package Information */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Courier Type"
              name="courierType"
              value={formData.courierType || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, courierType: value as any }))}
              options={[
                { value: 'Van', label: 'Van' },
                { value: 'White Glove', label: 'White Glove' },
                { value: 'Bulky', label: 'Bulky' }
              ]}
              placeholder="Select courier type"
              error={errors.courierType ? String(errors.courierType) : undefined}
            />
            <Input
              label="Packaging Type"
              name="packagingType"
              value={formData.packagingType ?? ''}
              onChange={handleChange}
              error={errors.packagingType ?? undefined}
              placeholder="e.g., Box, Crate, Pallet"
            />
            <Input
              label="Parcel Weight (kg)"
              name="parcelWeight"
              type="number"
              step="0.01"
              min="0"
              value={formData.parcelWeight ?? ''}
              onChange={handleChange}
              error={errors.parcelWeight ? String(errors.parcelWeight) : undefined}
              placeholder="0.00"
            />
            <Input
              label="Parcel Length (cm)"
              name="parcelLength"
              type="number"
              step="0.01"
              min="0"
              value={formData.parcelLength ?? ''}
              onChange={handleChange}
              error={errors.parcelLength ? String(errors.parcelLength) : undefined}
              placeholder="0.00"
            />
            <Input
              label="Parcel Width (cm)"
              name="parcelWidth"
              type="number"
              step="0.01"
              min="0"
              value={formData.parcelWidth ?? ''}
              onChange={handleChange}
              error={errors.parcelWidth ? String(errors.parcelWidth) : undefined}
              placeholder="0.00"
            />
            <Input
              label="Parcel Height (cm)"
              name="parcelHeight"
              type="number"
              step="0.01"
              min="0"
              value={formData.parcelHeight ?? ''}
              onChange={handleChange}
              error={errors.parcelHeight ? String(errors.parcelHeight) : undefined}
              placeholder="0.00"
            />
            <div className="flex items-end pb-2">
              <Toggle
                label="Requires Assembly"
                checked={formData.assembly || false}
                onChange={(checked) => setFormData(prev => ({ ...prev, assembly: checked }))}
                name="assembly"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Details</label>
              <textarea
                name="packagingDetail"
                value={formData.packagingDetail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional packaging information..."
              />
            </div>
          </div>
        </Card>

        {/* Product Information - Product Dimensions & Weight */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Product Weight (kg)"
              name="weight"
              type="number"
              step="0.01"
              min="0"
              value={formData.weight ?? ''}
              onChange={handleChange}
              error={errors.weight ? String(errors.weight) : undefined}
              placeholder="0.00"
            />
            <Input
              label="Product Length (cm)"
              name="length"
              type="number"
              step="0.01"
              min="0"
              value={formData.length ?? ''}
              onChange={handleChange}
              error={errors.length ? String(errors.length) : undefined}
              placeholder="0.00"
            />
            <Input
              label="Product Width (cm)"
              name="width"
              type="number"
              step="0.01"
              min="0"
              value={formData.width ?? ''}
              onChange={handleChange}
              error={errors.width ? String(errors.width) : undefined}
              placeholder="0.00"
            />
            <Input
              label="Product Height (cm)"
              name="height"
              type="number"
              step="0.01"
              min="0"
              value={formData.height ?? ''}
              onChange={handleChange}
              error={errors.height ? String(errors.height) : undefined}
              placeholder="0.00"
            />
          </div>
        </Card>

        {/* Features */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Features</h2>
            <Button
              type="button"
              size="sm"
              onClick={handleAddFeature}
              className="flex items-center space-x-2"
              disabled={!featureKey || !featureValue}
            >
              <Plus className="h-4 w-4" />
              <span>Add Feature</span>
            </Button>
          </div>

          <div className="space-y-4">
            {/* Add New Feature Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Feature Type"
                value={featureKey}
                onChange={(e) => setFeatureKey(e.target.value)}
                placeholder="e.g., Warranty, Color, Size"
              />
              <Input
                label="Feature Value"
                value={featureValue}
                onChange={(e) => setFeatureValue(e.target.value)}
                placeholder="e.g., 2 years, Black, Large"
              />
            </div>

            {/* Display Features List */}
            {formData.features && Object.keys(formData.features).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Added Features</h3>
                <div className="space-y-2">
                  {Object.entries(formData.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-700">{key}:</span>
                        <span className="text-sm text-gray-900">{String(value)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(key)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove feature"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
