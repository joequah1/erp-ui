"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Trash2 } from "lucide-react";
import { batchesApi, jobsApi } from "@/services/api";
import { Batch, PaginatedResponse, FilterOptions } from "@/types";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { ImportExportModal } from "@/components/ImportExportModal";
import { SearchFilterBar } from "@/components/SearchFilterBar";

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<PaginatedResponse<Batch>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    perPage: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const result = await batchesApi.getAll(filters);
      setBatches(result);
    } catch (error) {
      console.error('Failed to load batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_transit: 'bg-blue-100 text-blue-800',
      arrived: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pending',
      in_transit: 'In Transit',
      arrived: 'Arrived',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleView = (id: string) => {
    router.push(`/batches/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/batches/${id}/edit`);
  };

  const handleDelete = async (id: string, containerNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete batch "${containerNumber}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await batchesApi.delete(id);
      await loadBatches();
    } catch (error) {
      console.error('Failed to delete batch:', error);
      alert('Failed to delete batch. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleImport = async (file: File, template: string) => {
    try {
      await jobsApi.startImport(file, `batches-${template}`);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const handleExport = async (template: string) => {
    try {
      await jobsApi.startExport({ ...filters }, `batches-${template}`);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  };

  const getPageNumbers = () => {
    const { current_page, last_page } = batches.meta;
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    let end = Math.min(last_page, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batches Management</h1>
          <p className="text-gray-600 mt-2">Manage inventory batches and shipments</p>
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
            onClick={() => router.push('/batches/create')}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Batch</span>
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilterBar
        searchPlaceholder="Search by container number..."
        onSearchChange={(value) => {
          if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = setTimeout(() => {
            handleFilterChange('search', value);
          }, 300);
        }}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(f => !f)}
        hasFilters={true}
        filterContent={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Sort By"
              value={filters.sortBy}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
              options={[
                { value: 'createdAt', label: 'Created At' },
                { value: 'eta', label: 'ETA' },
                { value: 'arrivalDate', label: 'Arrival Date' },
              ]}
            />
            <Select
              label="Order"
              value={filters.sortOrder}
              onChange={e => handleFilterChange('sortOrder', e.target.value)}
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
            />
          </div>
        }
      />

      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : batches.data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search ? 'No batches found' : 'No batches yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.search
                ? 'Try adjusting your search terms or filters'
                : 'Get started by creating your first batch.'
              }
            </p>
            {!filters.search && (
              <Button onClick={() => router.push('/batches/create')}>Create First Batch</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Container #</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">ETA</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Arrival</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Total Value</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Created</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {batches.data.map(batch => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-900">{batch.containerNumber}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{batch.eta ? formatDate(batch.eta) : '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{batch.arrivalDate ? formatDate(batch.arrivalDate) : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(batch.status)}`}>{getStatusLabel(batch.status)}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{formatCurrency((batch as any).totalValue || 0)}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(batch.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <ActionMenu
                        onView={() => handleView(batch.id)}
                        onEdit={() => handleEdit(batch.id)}
                        onDelete={() => handleDelete(batch.id, batch.containerNumber)}
                        isDeleting={deletingId === batch.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Page {batches.meta.current_page} of {batches.meta.last_page}
        </div>
        <div className="flex gap-1">
          {getPageNumbers().map(page => (
            <Button
              key={page}
              size="sm"
              variant={page === batches.meta.current_page ? 'primary' : 'outline'}
              onClick={() => handleFilterChange('page', page)}
            >
              {page}
            </Button>
          ))}
        </div>
      </div>

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        title="Batches"
        templates={[
          { value: 'default', label: 'Default', description: 'Standard batch import/export template.' }
        ]}
      />
    </div>
  );
}
