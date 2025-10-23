"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Plus, Search, Upload, ChevronRight, ChevronDown } from "lucide-react";
import { categoriesApi, jobsApi } from "@/services/api";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { CategoryModal } from "./CategoryModal";
import { ImportExportModal } from "@/components/ImportExportModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = flattenCategories(categories).filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else{
      setFilteredCategories(categories);
    }
  }, [categories, searchTerm]);

  const loadCategories = async () => {
    try {
      const result = await categoriesApi.getAll();
      setCategories(result);
      // Expand root categories by default
      const rootIds = result.filter(cat => !cat.parentId).map(cat => cat.id);
      setExpandedCategories(new Set(rootIds));
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const flattenCategories = (categories: Category[]): Category[] => {
    const result: (Category & { level: number })[] = [];
    const flatten = (cats: Category[], level = 0) => {
      cats.forEach(cat => {
        result.push({ ...cat, level });
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, level + 1);
        }
      });
    };
    flatten(categories);
    return result;
  };

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCreate = (parentId?: string) => {
    setSelectedCategory(parentId ? { parentId } as Category : null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (category.children && category.children.length > 0) {
      alert('Cannot delete category with subcategories. Please delete subcategories first.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete category "${category.name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(category.id);
    try {
      await categoriesApi.delete(category.id);
      await loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async () => {
    await loadCategories();
    setIsModalOpen(false);
  };

  const handleImport = async (file: File, template: string) => {
    try {
      await jobsApi.startImport(file, `categories-${template}`);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const handleExport = async (template: string) => {
    try {
      await jobsApi.startExport({}, `categories-${template}`);
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

  // Render category rows recursively for tree view
  const renderCategoryRows = (cats: (Category & { level?: number })[], parentId: string | null = null, level = 0): React.ReactNode[] => {
    return cats
      .filter(cat => (cat.parentId || null) === parentId)
      .map(cat => (
        <React.Fragment key={cat.id}>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center" style={{ paddingLeft: `${level * 1.5}rem` }}>
                {cats.some(c => c.parentId === cat.id) && (
                  <button
                    type="button"
                    className="mr-2 text-gray-400 hover:text-gray-700"
                    onClick={() => toggleExpanded(cat.id)}
                  >
                    {expandedCategories.has(cat.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
                <span className="font-medium text-gray-900">{cat.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(cat.createdAt)}</td>
            <td className="px-6 py-4">
              <div className="flex gap-2 items-center">
                <Button size="sm" variant="outline" onClick={() => handleCreate(cat.id)}>
                  <Plus className="w-4 h-4 mr-1" /> Subcategory
                </Button>
                <ActionMenu
                  onView={() => handleView(cat)}
                  onEdit={() => handleEdit(cat)}
                  onDelete={() => handleDelete(cat)}
                  isDeleting={deletingId === cat.id}
                />
              </div>
            </td>
          </tr>
          {expandedCategories.has(cat.id) && renderCategoryRows(cats, cat.id, level + 1)}
        </React.Fragment>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage product categories and their hierarchy</p>
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
            onClick={() => handleCreate()}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
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
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first category.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => handleCreate()}>Add First Category</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Created</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renderCategoryRows(flattenCategories(filteredCategories))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        category={selectedCategory}
        mode={modalMode}
        categories={categories}
      />
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        title="Categories"
        templates={[
          { value: 'default', label: 'Default', description: 'Standard category import/export template.' }
        ]}
      />
    </div>
  );
}
