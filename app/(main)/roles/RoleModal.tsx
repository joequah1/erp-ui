"use client";
import React, { useState, useEffect } from 'react';
import { rolesApi } from '@/services/api';
import { Role, Permission } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { roleSchema, type RoleFormData } from '@/validation/schemas';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  role: Role | null;
  mode: 'create' | 'edit' | 'view';
  permissions: Permission[];
}

export function RoleModal({ isOpen, onClose, onSave, role, mode, permissions }: RoleModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: []
  });
  const [errors, setErrors] = useState<Partial<RoleFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions.map(p => p.id)
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
    setErrors({});
  }, [role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RoleFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const handleModuleToggle = (module: string, checked: boolean) => {
    const modulePermissions = permissions.filter(p => p.module === module).map(p => p.id);
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...modulePermissions])]
        : prev.permissions.filter(id => !modulePermissions.includes(id))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    const result = roleSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<RoleFormData> = {};
      (result.error.issues ?? []).forEach((error: any) => {
        if (error.path && error.path[0]) {
          fieldErrors[error.path[0] as keyof RoleFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      // Transform permission IDs to Permission objects
      const selectedPermissions = permissions.filter(p => result.data.permissions.includes(p.id));

      const roleData = {
        name: result.data.name,
        description: result.data.description,
        permissions: selectedPermissions,
        isSystem: false
      };
      if (mode === 'create') {
        await rolesApi.create(roleData);
      } else if (mode === 'edit' && role) {
        await rolesApi.update(role.id, roleData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save role:', error);
      setErrors({
        name: error instanceof Error ? error.message : 'Failed to save role'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Role';
      case 'edit':
        return 'Edit Role';
      case 'view':
        return 'Role Details';
      default:
        return 'Role';
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

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const isModuleFullySelected = (module: string) => {
    const modulePermissions = permissionsByModule[module];
    return modulePermissions.every(p => formData.permissions.includes(p.id));
  };

  const isModulePartiallySelected = (module: string) => {
    const modulePermissions = permissionsByModule[module];
    return modulePermissions.some(p => formData.permissions.includes(p.id)) && !isModuleFullySelected(module);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Role Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter role name"
            disabled={mode === 'view' || Boolean(role?.isSystem)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter role description"
              disabled={mode === 'view' || Boolean(role?.isSystem)}
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
        </div>
        {/* Permissions Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
            {errors.permissions && (
              <p className="text-sm text-red-600">{errors.permissions}</p>
            )}
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
              <div key={module} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id={`module-${module}`}
                    checked={isModuleFullySelected(module)}
                    ref={(input) => {
                      if (input) input.indeterminate = isModulePartiallySelected(module);
                    }}
                    onChange={(e) => handleModuleToggle(module, e.target.checked)}
                    disabled={mode === 'view' || Boolean(role?.isSystem)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor={`module-${module}`}
                    className="text-sm font-medium text-gray-900 capitalize"
                  >
                    {module} Module
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 ml-6">
                  {modulePermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                        disabled={mode === 'view' || Boolean(role?.isSystem)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="capitalize">{permission.action}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Timestamps for view mode */}
        {mode === 'view' && role && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-600 mt-1">
                {role.isSystem ? 'System Role (Cannot be modified)' : 'Custom Role'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(role.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="text-sm text-gray-600 mt-1">{formatDate(role.updatedAt)}</p>
            </div>
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} type="button">
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && !Boolean(role?.isSystem) && (
            <Button type="submit" isLoading={isLoading}>
              {mode === 'create' ? 'Create Role' : 'Save Changes'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
