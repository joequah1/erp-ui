
"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload, Settings, Users, Crown } from 'lucide-react';
import { Shop, ShopUser } from '@/types';
import { jobsApi } from '../../../services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { ShopModal } from './ShopModal';
import { ShopSettingsModal } from './ShopSettingsModal';
import { ShopUsersModal } from './ShopUsersModal';
import { ImportExportModal } from '@/components/ImportExportModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const { user, userShops, currentShop } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  useEffect(() => {
    loadShops();
  }, []);

  useEffect(() => {
    const filtered = shops.filter(shop =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredShops(filtered);
  }, [shops, searchTerm]);

  const loadShops = async () => {
    try {
      setShops(userShops);
    } catch (error) {
      console.error('Failed to load shops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedShop(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleView = (shop: Shop) => {
    setSelectedShop(shop);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSettings = (shop: Shop) => {
    setSelectedShop(shop);
    setIsSettingsOpen(true);
  };

  const handleUsers = (shop: Shop) => {
    setSelectedShop(shop);
    setIsUsersOpen(true);
  };

  const handleDelete = async (shop: Shop) => {
    if (!confirm(`Are you sure you want to delete shop "${shop.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(shop.id);
    try {
      // await shopsApi.delete(shop.id);
      await loadShops();
    } catch (error) {
      console.error('Failed to delete shop:', error);
      alert('Failed to delete shop. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async () => {
    await loadShops();
    setIsModalOpen(false);
  };

  const handleImport = async (file: File, template: string) => {
    try {
      await jobsApi.startImport(file, `shops-${template}`);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const handleExport = async (template: string) => {
    try {
      // Pass an empty object or valid FilterOptions for shops export
      await jobsApi.startExport({}, `shops-${template}`);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOwner = (shop: Shop) => {
    return shop.ownerId === user?.id;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
          <p className="text-gray-600 mt-2">Manage your shops, settings, and team members</p>
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
          <Button onClick={handleCreate} className="flex items-center space-x-2" type="button">
            <Plus className="h-4 w-4" />
            <span>Create Shop</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search shops by name or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Shops Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No shops found' : 'No shops yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first shop.'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleCreate} type="button">Create First Shop</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <Card key={shop.id} className="relative">
              {/* Current Shop Badge */}
              {currentShop?.id === shop.id && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                    Current
                  </span>
                </div>
              )}

              {/* Shop Logo */}
              <div className="flex items-center space-x-4 mb-4">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xl">
                      {shop.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                    {isOwner(shop) && (
                      <Crown className="h-4 w-4 text-primary-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{shop.description}</p>
                </div>
              </div>

              {/* Shop Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-600">Products</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-xs text-gray-600">Users</p>
                </div>
              </div>

              {/* Shop Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  shop.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {shop.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">
                  Created {formatDate(shop.createdAt)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {isOwner(shop) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSettings(shop)}
                        className="flex items-center space-x-1"
                        type="button"
                      >
                        <Settings className="h-3 w-3" />
                        <span>Settings</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUsers(shop)}
                        className="flex items-center space-x-1"
                        type="button"
                      >
                        <Users className="h-3 w-3" />
                        <span>Users</span>
                      </Button>
                    </>
                  )}
                </div>
                <ActionMenu
                  onView={() => handleView(shop)}
                  onEdit={isOwner(shop) ? () => handleEdit(shop) : undefined}
                  onDelete={isOwner(shop) ? () => handleDelete(shop) : undefined}
                  isDeleting={deletingId === shop.id}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Shop Modal */}
      <ShopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        shop={selectedShop}
        mode={modalMode}
      />

      {/* Shop Settings Modal */}
      <ShopSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shop={selectedShop}
      />

      {/* Shop Users Modal */}
      <ShopUsersModal
        isOpen={isUsersOpen}
        onClose={() => setIsUsersOpen(false)}
        shop={selectedShop}
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        title="Shops Import/Export"
        templates={[
          { value: 'standard', label: 'Standard Template', description: 'Complete shop data with settings' },
          { value: 'simplified', label: 'Simplified Template', description: 'Basic shop information only' }
        ]}
      />
    </div>
  );
}
