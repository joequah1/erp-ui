"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Upload, Package, Calendar, TrendingUp, Trash2 } from "lucide-react";
import { batchesApi, jobsApi } from "@/services/api";
import { Batch, PaginatedResponse, FilterOptions } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { ImportExportModal } from "@/components/ImportExportModal";

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeout(() => {
      handleFilterChange('search', value || undefined);
    }, 300);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6" /> Batches
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportExportOpen(true)} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" /> Import/Export
          </Button>
          <Button onClick={() => router.push('/batches/create')} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Batch
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Input
          className="w-64"
          placeholder="Search by container number..."
          onChange={handleSearch}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(f => !f)}
        >
          <Filter className="w-4 h-4 mr-1" /> Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4 flex flex-wrap gap-4 items-center">
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
        </Card>
      )}

      <Card className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Container #</th>
                <th className="px-3 py-2 text-left">ETA</th>
                <th className="px-3 py-2 text-left">Arrival</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Total Value</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">No batches found.</td>
                </tr>
              ) : (
                batches.data.map(batch => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono">{batch.containerNumber}</td>
                    <td className="px-3 py-2">{batch.eta ? formatDate(batch.eta) : '-'}</td>
                    <td className="px-3 py-2">{batch.arrivalDate ? formatDate(batch.arrivalDate) : '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(batch.status)}`}>{getStatusLabel(batch.status)}</span>
                    </td>
                    <td className="px-3 py-2">{formatCurrency((batch as any).totalValue || 0)}</td>
                    <td className="px-3 py-2">{formatDate(batch.createdAt)}</td>
                    <td className="px-3 py-2">
                      <ActionMenu
                        onView={() => handleView(batch.id)}
                        onEdit={() => handleEdit(batch.id)}
                        onDelete={() => handleDelete(batch.id, batch.containerNumber)}
                        isDeleting={deletingId === batch.id}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
