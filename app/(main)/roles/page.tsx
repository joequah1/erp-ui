
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Shield, Lock } from 'lucide-react';
import { Role, Permission } from '@/types';
import { rolesApi, permissionsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { RoleModal } from './RoleModal';

export default function Page() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRoles(filtered);
  }, [roles, searchTerm]);

  const loadRoles = async () => {
    try {
      const result = await rolesApi.getAll();
      setRoles(result);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const result = await permissionsApi.getAll();
      setPermissions(result);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) {
      alert('Cannot delete system roles.');
      return;
    }

    if (!confirm(`Are you sure you want to delete role "${role.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(role.id);
    try {
      await rolesApi.delete(role.id);
      await loadRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert('Failed to delete role. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async () => {
    await loadRoles();
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Memoize permission grouping for performance
  const groupPermissionsByModule = useMemo(() => {
    return (permissions: Permission[]) =>
      permissions.reduce((acc, permission) => {
        if (!acc[permission.module]) {
          acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
      }, {} as Record<string, Permission[]>);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-2">Manage user roles and their permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Role</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search roles by name or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Roles Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛡️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No roles found' : 'No roles yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first role.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>Add First Role</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Description</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Permissions</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Created</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoles.map((role) => {
                  const permsByModule = groupPermissionsByModule(role.permissions);
                  return (
                    <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{role.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                        {role.description || 'No description'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(permsByModule).slice(0, 3).map(([module, perms]) => (
                            <span
                              key={module}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              {module} ({perms.length})
                            </span>
                          ))}
                          {Object.keys(permsByModule).length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              +{Object.keys(permsByModule).length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          role.isSystem 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {role.isSystem ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              System
                            </>
                          ) : (
                            'Custom'
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm">
                        {formatDate(role.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <ActionMenu
                          onView={() => handleView(role)}
                          onEdit={!role.isSystem ? () => handleEdit(role) : undefined}
                          onDelete={!role.isSystem ? () => handleDelete(role) : undefined}
                          isDeleting={deletingId === role.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Role Modal */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        role={selectedRole}
        mode={modalMode}
        permissions={permissions}
      />
    </div>
  );
}
