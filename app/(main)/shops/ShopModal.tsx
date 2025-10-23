"use client";
import React, { useState, useEffect } from 'react';
import { Shop } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  shop: Shop | null;
  mode: 'create' | 'edit' | 'view';
}

export function ShopModal({ isOpen, onClose, onSave, shop, mode }: ShopModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name,
        description: shop.description || '',
        logo: shop.logo || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        logo: ''
      });
    }
    setErrors({});
  }, [shop, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave();
    } catch (error) {
      console.error('Failed to save shop:', error);
      setErrors({ name: 'Failed to save shop' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Shop';
      case 'edit':
        return 'Edit Shop';
      case 'view':
        return 'Shop Details';
      default:
        return 'Shop';
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
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Shop Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter shop name"
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
              placeholder="Enter shop description"
              disabled={mode === 'view'}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
                errors.description 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
          <Input
            label="Logo URL"
            name="logo"
            type="url"
            value={formData.logo}
            onChange={handleChange}
            error={errors.logo}
            placeholder="https://example.com/logo.png"
            disabled={mode === 'view'}
            helperText="Optional: URL to shop logo"
          />
          {/* Logo Preview */}
          {formData.logo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Preview
              </label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={formData.logo}
                  alt="Shop logo preview"
                  className="h-20 w-20 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Timestamps for view mode */}
        {mode === 'view' && shop && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(shop.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(shop.updatedAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                shop.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {shop.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} type="button">
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button type="submit" isLoading={isLoading}>
              {mode === 'create' ? 'Create Shop' : 'Save Changes'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
