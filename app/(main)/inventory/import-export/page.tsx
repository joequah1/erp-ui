
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Download, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { jobsApi } from '@/services/api';
import { JobMonitor } from '@/types';
import { useRouter } from 'next/navigation';

const TEMPLATES = [
  { value: 'standard', label: 'Standard Template', description: 'Complete inventory data with all fields' },
  { value: 'simplified', label: 'Simplified Template', description: 'Basic inventory data for quick entry' },
  { value: 'marketplace', label: 'Marketplace Sync', description: 'Template for marketplace integrations' }
];

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<JobMonitor[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    try {
      const result = await jobsApi.getAllJobs();
      setJobs(result);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      await jobsApi.startImport(selectedFile, selectedTemplate);
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      await jobsApi.startExport({}, selectedTemplate);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = (template: string) => {
    const link = document.createElement('a');
    link.href = `/templates/inventory-${template}-template.xlsx`;
    link.download = `inventory-${template}-template.xlsx`;
    link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <LoadingSpinner size="sm" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/inventory')} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import & Export</h1>
          <p className="text-gray-600 mt-2">Bulk import and export inventory data using Excel templates</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Import Data
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Export Data
          </button>
        </nav>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'import' ? (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Import Inventory Data</h2>
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Template
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {TEMPLATES.map((template) => (
                      <label
                        key={template.value}
                        className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                          selectedTemplate === template.value
                            ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={template.value}
                          checked={selectedTemplate === template.value}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {template.label}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                downloadTemplate(template.value);
                              }}
                              className="ml-4"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-input"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-input"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileSelect}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Excel files (.xlsx, .xls) or CSV up to 10MB
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 font-medium">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Import Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleImport}
                    disabled={!selectedFile}
                    isLoading={isProcessing}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Start Import</span>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Export Inventory Data</h2>
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Export Template
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {TEMPLATES.map((template) => (
                      <label
                        key={template.value}
                        className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                          selectedTemplate === template.value
                            ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="export-template"
                          value={template.value}
                          checked={selectedTemplate === template.value}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {template.label}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Export Options */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Export Options</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include all inventory items</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include product classifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include dynamic features</span>
                    </label>
                  </div>
                </div>
                {/* Export Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleExport}
                    isLoading={isProcessing}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Start Export</span>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        {/* Job Monitor */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No jobs yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 10).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(job.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.filename}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                          {job.type} • {job.status}
                        </span>
                        {job.status === 'processing' && (
                          <span className="text-xs text-gray-500">
                            {job.progress}%
                          </span>
                        )}
                      </div>
                      {job.status === 'processing' && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
