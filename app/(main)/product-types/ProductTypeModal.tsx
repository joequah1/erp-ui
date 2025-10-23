"use client";
import React, { useState, useEffect } from 'react';
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

export function ProductTypeModal({ isOpen, onClose, onSave, productType, mode }: ProductTypeModalProps) {
  const [formData, setFormData] = useState<ProductTypeFormData>({
    name: ''
  });
  const [errors, setErrors] = useState<Partial<ProductTypeFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productType) {
      setFormData({
        name: productType.name
      });
    } else {
      setFormData({
        name: ''
      });
    }
    setErrors({});
  }, [productType, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProductTypeFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    const result = productTypeSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ProductTypeFormData> = {};
      result.error.issues.forEach((error) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Product Type Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., Electronics, Furniture, Clothing"
          disabled={mode === 'view'}
          required
        />

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

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
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
