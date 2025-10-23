"use client";
import { useState, useEffect } from "react";
import { brandsApi } from "@/services/api";
import { Brand } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { brandSchema, type BrandFormData } from "@/validation/schemas";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  brand: Brand | null;
  mode: 'create' | 'edit' | 'view';
}

export function BrandModal({ isOpen, onClose, onSave, brand, mode }: BrandModalProps) {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    visible: 1,
    flag: 0
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BrandFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        visible: brand.visible ?? 1,
        flag: brand.flag ?? 0
      });
    } else {
      setFormData({
        name: '',
        visible: 1,
        flag: 0
      });
    }
    setErrors({});
  }, [brand, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked ? 1 : 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name as keyof BrandFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    const result = brandSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BrandFormData, string>> = {};
      result.error.issues.forEach((error) => {
        if (typeof error.path[0] === 'string' || typeof error.path[0] === 'number') {
          fieldErrors[error.path[0] as keyof BrandFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await brandsApi.create(result.data);
      } else if (mode === 'edit' && brand) {
        await brandsApi.update(brand.id, result.data);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save brand:', error);
      setErrors({
        name: 'Failed to save brand. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Create Brand' : mode === 'edit' ? 'Edit Brand' : 'View Brand'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={mode === 'view'}
          required
        />
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible === 1}
              onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked ? 1 : 0 }))}
              disabled={mode === 'view'}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Visible</span>
          </label>
        </div>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="flag"
              checked={formData.flag === 1}
              onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.checked ? 1 : 0 }))}
              disabled={mode === 'view'}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Flag for attention</span>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button type="submit" isLoading={isLoading}>
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
