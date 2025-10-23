"use client";
import React, { useState, useEffect } from 'react';
import { usersApi } from '@/services/api';
import { User, Role } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { userSchema, type UserFormData } from '@/validation/schemas';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User | null;
  mode: 'create' | 'edit' | 'view';
  roles: Role[];
}

export function UserModal({ isOpen, onClose, onSave, user, mode, roles }: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData & { role: string }>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'user'
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || '',
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        role: 'user'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    const result = userSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<UserFormData> = {};
      result.error.issues.forEach(error => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof UserFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      const userData = {
        ...result.data,
        role: formData.role as 'owner' | 'admin' | 'user'
      };
      if (mode === 'create') {
        await usersApi.create(userData);
      } else if (mode === 'edit' && user) {
        await usersApi.update(user.id, userData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save user:', error);
      setErrors({
        email: error instanceof Error ? error.message : 'Failed to save user'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New User';
      case 'edit':
        return 'Edit User';
      case 'view':
        return 'User Details';
      default:
        return 'User';
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
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter full name"
            disabled={mode === 'view'}
          />
          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email address"
            disabled={mode === 'view'}
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="Enter phone number"
            disabled={mode === 'view'}
          />
          <Input
            label="Avatar URL"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            error={errors.avatar}
            placeholder="https://example.com/avatar.png"
            disabled={mode === 'view'}
            helperText="Optional: URL to user avatar"
          />
          <Select
            label="Role *"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roles.map(r => ({ value: r.name, label: r.name }))}
            disabled={mode === 'view'}
          />
          {/* Avatar Preview */}
          {formData.avatar && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Preview</label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={formData.avatar}
                  alt="User avatar preview"
                  className="h-20 w-20 object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Timestamps for view mode */}
        {mode === 'view' && user && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(user.updatedAt)}</p>
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
              {mode === 'create' ? 'Add User' : 'Save Changes'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
