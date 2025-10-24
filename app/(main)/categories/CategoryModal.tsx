"use client";
import { useState, useEffect } from "react";
import { categoriesApi } from "@/services/api";
import { Category } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { categorySchema, type CategoryFormData } from "@/validation/schemas";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  category: Category | null;
  mode: 'create' | 'edit' | 'view';
  categories: Category[];
}

export function CategoryModal({ isOpen, onClose, onSave, category, mode, categories }: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parentId: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        parentId: category.parentId || '',
        description: category.description || ''
      });
    } else {
      setFormData({
        name: '',
        parentId: '',
        description: ''
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CategoryFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    const result = categorySchema.safeParse({
      ...formData,
      parentId: formData.parentId || undefined
    });
    if (!result.success) {
      const fieldErrors: Partial<CategoryFormData> = {};
      result.error.issues.forEach((error) => {
        if (typeof error.path[0] === 'string' || typeof error.path[0] === 'number') {
          fieldErrors[error.path[0] as keyof CategoryFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await categoriesApi.create(result.data);
      } else if (mode === 'edit' && category) {
        await categoriesApi.update(category.id, result.data);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save category:', error);
      setErrors({
        name: 'Failed to save category. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Create Category' : mode === 'edit' ? 'Edit Category' : 'View Category'} size="md">
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
        <Select
          label="Parent Category"
          name="parentId"
          value={formData.parentId}
          onChange={handleChange}
          options={categories.filter(c => !category || c.id !== category.id).map(c => ({ value: c.id, label: c.name }))}
          error={errors.parentId}
          disabled={mode === 'view'}
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
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
