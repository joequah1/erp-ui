"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload, Shield, Crown, User as UserIcon } from 'lucide-react';
import { User, Role } from '@/types';
import { usersApi, rolesApi, jobsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { UserModal } from './UserModal';
import { ImportExportModal } from '@/components/ImportExportModal';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      const result = await usersApi.getAll();
      setUsers(result);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const result = await rolesApi.getAll();
      setRoles(result);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(user.id);
    try {
      await usersApi.delete(user.id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async () => {
    await loadUsers();
    setIsModalOpen(false);
  };

  const handleImport = async (file: File, template: string) => {
    try {
      await jobsApi.startImport(file, `users-${template}`);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const handleExport = async (template: string) => {
    try {
      await jobsApi.startExport({}, `users-${template}`);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-primary-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-primary-100 text-primary-800',
      admin: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportExportOpen(true)}
            className="flex items-center space-x-2"
            type="button"
          >
            <Upload className="h-4 w-4" />
            <span>Import/Export</span>
          </Button>
          <Button size="sm" onClick={handleCreate} className="flex items-center space-x-2" type="button">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>
      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      {/* Users Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first user.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} type="button">Add First User</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">User</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Phone</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Created</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ActionMenu
                        onView={() => handleView(user)}
                        onEdit={() => handleEdit(user)}
                        onDelete={() => handleDelete(user)}
                        isDeleting={deletingId === user.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        user={selectedUser}
        mode={modalMode}
        roles={roles}
      />
      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        title="Users Import/Export"
        templates={[
          { value: 'standard', label: 'Standard Template', description: 'Complete user data with roles' },
          { value: 'simplified', label: 'Simplified Template', description: 'Basic user information only' }
        ]}
      />
    </div>
  );
}
