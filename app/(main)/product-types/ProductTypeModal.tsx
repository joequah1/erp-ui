
"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { productTypesApi } from '@/services/api';
import { ProductType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productTypeSchema, type ProductTypeFormData } from '../../../validation/schemas';

interface ProductTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  productType: ProductType | null;
  mode: 'create' | 'edit' | 'view';
}

interface AttributeField {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean';
}

export function ProductTypeModal({ isOpen, onClose, onSave, productType, mode }: ProductTypeModalProps) {
  const [formData, setFormData] = useState<ProductTypeFormData>({
    name: '',
    description: '',
    attributes: {}
  });
  const [attributeFields, setAttributeFields] = useState<AttributeField[]>([]);
  const [errors, setErrors] = useState<Partial<ProductTypeFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productType) {
      setFormData({
        name: productType.name,
        description: productType.description || '',
        attributes: productType.attributes
      });
      // Convert attributes to editable fields
      const fields = Object.entries(productType.attributes).map(([key, value]) => ({
        key,
        value,
        type: typeof value as 'string' | 'number' | 'boolean'
      }));
      setAttributeFields(fields);
    } else {
      setFormData({
        name: '',
        description: '',
        attributes: {}
      });
      setAttributeFields([]);
    }
    setErrors({});
  }, [productType, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ProductTypeFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addAttributeField = () => {
    setAttributeFields(prev => [...prev, { key: '', value: '', type: 'string' }]);
  };

  const removeAttributeField = (index: number) => {
    setAttributeFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateAttributeField = (index: number, field: keyof AttributeField, value: any) => {
    setAttributeFields(prev => prev.map((attr, i) => 
      i === index ? { ...attr, [field]: value } : attr
    ));
  };

  const convertAttributeValue = (value: string, type: string) => {
    switch (type) {
      case 'number':
        return value === '' ? 0 : Number(value);
      case 'boolean':
        return value === 'true';
      default:
        return value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    // Convert attribute fields to attributes object
    const attributes: Record<string, any> = {};
    attributeFields.forEach(field => {
      if (field.key.trim()) {
        attributes[field.key.trim()] = convertAttributeValue(field.value, field.type);
      }
    });
    const dataToValidate = {
      ...formData,
      attributes
    };
    // Validate form
    const result = productTypeSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Partial<ProductTypeFormData> = {};
      (result.error.issues as Array<{ path: (string | number)[]; message: string }>).forEach((error) => {
        if (error.path[0]) {
          (fieldErrors as any)[error.path[0]] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await productTypesApi.create(result.data);
      } else if (mode === 'edit' && productType) {
        await productTypesApi.update(productType.id, result.data);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save product type:', error);
      setErrors({
        name: error instanceof Error ? error.message : 'Failed to save product type'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Product Type';
      case 'edit':
        return 'Edit Product Type';
      case 'view':
        return 'Product Type Details';
      default:
        return 'Product Type';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Product Type Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter product type name"
            disabled={mode === 'view'}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product type description"
              disabled={mode === 'view'}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
                errors.description 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
        </div>
        {/* Attributes Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Attributes</h3>
            {mode !== 'view' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttributeField}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Attribute</span>
              </Button>
            )}
          </div>
          {attributeFields.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No attributes defined</p>
              {mode !== 'view' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttributeField}
                  className="mt-2"
                >
                  Add First Attribute
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {attributeFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Input
                      placeholder="Attribute name"
                      value={field.key}
                      onChange={(e) => updateAttributeField(index, 'key', e.target.value)}
                      disabled={mode === 'view'}
                      className="mb-2"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={field.type}
                      onChange={(e) => updateAttributeField(index, 'type', e.target.value)}
                      disabled={mode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 mb-2"
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    {field.type === 'boolean' ? (
                      <select
                        value={field.value.toString()}
                        onChange={(e) => updateAttributeField(index, 'value', e.target.value)}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 mb-2"
                      >
                        <option value="false">False</option>
                        <option value="true">True</option>
                      </select>
                    ) : (
                      <Input
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder="Default value"
                        value={field.value}
                        onChange={(e) => updateAttributeField(index, 'value', e.target.value)}
                        disabled={mode === 'view'}
                        className="mb-2"
                      />
                    )}
                  </div>
                  {mode !== 'view' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttributeField(index)}
                      className="p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Timestamps for view mode */}
        {mode === 'view' && productType && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(productType.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(productType.updatedAt)}</p>
            </div>
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button type="submit" isLoading={isLoading}>
              {mode === 'create' ? 'Create Product Type' : 'Save Changes'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
