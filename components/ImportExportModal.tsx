import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface Template {
  value: string;
  label: string;
  description: string;
}

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, template: string) => Promise<boolean>;
  onExport: (template: string) => Promise<boolean>;
  title: string;
  templates: Template[];
}

export function ImportExportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  onExport, 
  title, 
  templates 
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.value || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setMessage(null);
    
    try {
      const success = await onImport(selectedFile, selectedTemplate);
      if (success) {
        setMessage({ type: 'success', text: 'Import started successfully! Check the job monitor for progress.' });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setMessage({ type: 'error', text: 'Import failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Import failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setMessage(null);
    
    try {
      const success = await onExport(selectedTemplate);
      if (success) {
        setMessage({ type: 'success', text: 'Export started successfully! Check the job monitor for progress.' });
      } else {
        setMessage({ type: 'error', text: 'Export failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = (template: string) => {
    // In a real app, this would download the actual template file
    const link = document.createElement('a');
    link.href = `/templates/${title.toLowerCase().replace(/\s+/g, '-')}-${template}-template.xlsx`;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${template}-template.xlsx`;
    link.click();
  };

  const handleClose = () => {
    setMessage(null);
    setSelectedFile(null);
    setActiveTab('import');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <div className="space-y-6">
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

        {/* Message */}
        {message && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Template
          </label>
          <div className="grid grid-cols-1 gap-3">
            {templates.map((template) => (
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

        {/* Import/Export Content */}
        {activeTab === 'import' ? (
          <div className="space-y-4">
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
                      htmlFor="import-file-input"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="import-file-input"
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
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Export Options</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include all records</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include metadata</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === 'import' ? (
            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              isLoading={isProcessing}
              className="flex items-center space-x-2"
            >
              {isProcessing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>Start Import</span>
            </Button>
          ) : (
            <Button
              onClick={handleExport}
              isLoading={isProcessing}
              className="flex items-center space-x-2"
            >
              {isProcessing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Start Export</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
