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
    description: '',
    image: ''
  });
  const [errors, setErrors] = useState<Partial<BrandFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description || '',
        image: brand.image || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: ''
      });
    }
    setErrors({});
  }, [brand, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BrandFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    const result = brandSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<BrandFormData> = {};
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
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          disabled={mode === 'view'}
        />
        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          error={errors.image}
          disabled={mode === 'view'}
        />
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
