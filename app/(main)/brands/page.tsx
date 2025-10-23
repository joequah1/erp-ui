"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Upload, Download } from "lucide-react";
import { brandsApi, jobsApi } from "@/services/api";
import { Brand } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { BrandModal } from "./BrandModal";
import { ImportExportModal } from "@/components/ImportExportModal";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [brands, searchTerm]);

  const loadBrands = async () => {
    try {
      const result = await brandsApi.getAll();
      setBrands(result);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBrand(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (!window.confirm(`Are you sure you want to delete brand "${brand.name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(brand.id);
    try {
      await brandsApi.delete(brand.id);
      await loadBrands();
    } catch (error) {
      console.error('Failed to delete brand:', error);
      alert('Failed to delete brand. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async () => {
    await loadBrands();
    setIsModalOpen(false);
  };

  const handleImport = async (file: File, template: string) => {
    try {
      await jobsApi.startImport(file, `brands-${template}`);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const handleExport = async (template: string) => {
    try {
      await jobsApi.startExport({}, `brands-${template}`);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands Management</h1>
          <p className="text-gray-600 mt-2">Manage product brands and their information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportExportOpen(true)}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import/Export</span>
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Brand</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search brands..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No brands found' : 'No brands yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first brand.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => handleCreate()}>Add First Brand</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Name</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-900">Visible</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-900">Flag</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Created</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBrands.map(brand => (
                  <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        brand.visible === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {brand.visible === 1 ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {brand.flag === 1 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Flagged
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(brand.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <ActionMenu
                        onView={() => handleView(brand)}
                        onEdit={() => handleEdit(brand)}
                        onDelete={() => handleDelete(brand)}
                        isDeleting={deletingId === brand.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        brand={selectedBrand}
        mode={modalMode}
      />
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        title="Brands"
        templates={[
          { value: 'default', label: 'Default', description: 'Standard brand import/export template.' }
        ]}
      />
    </div>
  );
}
