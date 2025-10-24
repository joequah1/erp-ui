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
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className="flex gap-2">
          <Button onClick={handleCreate} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Brand
          </Button>
          <Button onClick={() => setIsImportExportOpen(true)} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" /> Import/Export
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          className="w-64"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <Card className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No brands found.</td>
                </tr>
              ) : (
                filteredBrands.map(brand => (
                  <tr key={brand.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-semibold">{brand.name}</td>
                    <td className="px-3 py-2">{brand.description}</td>
                    <td className="px-3 py-2">{formatDate(brand.createdAt)}</td>
                    <td className="px-3 py-2">
                      <ActionMenu
                        onView={() => handleView(brand)}
                        onEdit={() => handleEdit(brand)}
                        onDelete={() => handleDelete(brand)}
                        isDeleting={deletingId === brand.id}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
