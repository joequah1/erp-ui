"use client";
import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2 } from 'lucide-react';
import { Shop } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
}

interface SettingField {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
}

const SETTING_TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'inventory', label: 'Inventory', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Settings },
  { id: 'integrations', label: 'Integrations', icon: Settings },
];

export function ShopSettingsModal({ isOpen, onClose, shop }: ShopSettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Record<string, SettingField[]>>({
    general: [
      { key: 'timezone', value: 'UTC', type: 'select', options: ['UTC', 'EST', 'PST', 'GMT'] },
      { key: 'currency', value: 'USD', type: 'select', options: ['USD', 'EUR', 'GBP', 'CAD'] },
      { key: 'language', value: 'en', type: 'select', options: ['en', 'es', 'fr', 'de'] },
    ],
    inventory: [
      { key: 'lowStockThreshold', value: 10, type: 'number' },
      { key: 'autoReorder', value: false, type: 'boolean' },
      { key: 'trackSerialNumbers', value: true, type: 'boolean' },
    ],
    notifications: [
      { key: 'emailNotifications', value: true, type: 'boolean' },
      { key: 'smsNotifications', value: false, type: 'boolean' },
      { key: 'lowStockAlerts', value: true, type: 'boolean' },
    ],
    integrations: [
      { key: 'apiKey', value: '', type: 'string' },
      { key: 'webhookUrl', value: '', type: 'string' },
      { key: 'enableWebhooks', value: false, type: 'boolean' },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shop && shop.settings) {
      // Load existing settings from shop
      const loadedSettings = { ...settings };
      Object.entries(shop.settings).forEach(([key, value]) => {
        // Find which tab this setting belongs to and update it
        Object.keys(loadedSettings).forEach(tab => {
          const settingIndex = loadedSettings[tab].findIndex(s => s.key === key);
          if (settingIndex !== -1) {
            loadedSettings[tab][settingIndex].value = value;
          }
        });
      });
      setSettings(loadedSettings);
    }
  }, [shop, isOpen]);

  const updateSetting = (tab: string, index: number, field: keyof SettingField, value: any) => {
    setSettings(prev => ({
      ...prev,
      [tab]: prev[tab].map((setting, i) => 
        i === index ? { ...setting, [field]: value } : setting
      )
    }));
  };

  const addSetting = (tab: string) => {
    setSettings(prev => ({
      ...prev,
      [tab]: [...prev[tab], { key: '', value: '', type: 'string' }]
    }));
  };

  const removeSetting = (tab: string, index: number) => {
    setSettings(prev => ({
      ...prev,
      [tab]: prev[tab].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Flatten all settings into a single object
      const flatSettings: Record<string, any> = {};
      Object.values(settings).flat().forEach(setting => {
        if (setting.key.trim()) {
          flatSettings[setting.key] = setting.value;
        }
      });
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving settings:', flatSettings);
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettingField = (setting: SettingField, tabId: string, index: number) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => updateSetting(tabId, index, 'value', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              {setting.value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(tabId, index, 'value', Number(e.target.value))}
            placeholder="Enter number"
          />
        );
      case 'select':
        return (
          <Select
            value={setting.value}
            onChange={(e) => updateSetting(tabId, index, 'value', e.target.value)}
            options={setting.options?.map(opt => ({ value: opt, label: opt })) || []}
            placeholder="Select option"
          />
        );
      default:
        return (
          <Input
            value={setting.value}
            onChange={(e) => updateSetting(tabId, index, 'value', e.target.value)}
            placeholder="Enter value"
          />
        );
    }
  };

  if (!shop) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shop Settings" size="xl">
      <div className="flex h-96">
        {/* Tabs Sidebar */}
        <div className="w-48 border-r border-gray-200 pr-4">
          <nav className="space-y-1">
            {SETTING_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        {/* Settings Content */}
        <div className="flex-1 pl-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 capitalize">
              {activeTab} Settings
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSetting(activeTab)}
              className="flex items-center space-x-1"
              type="button"
            >
              <Plus className="h-3 w-3" />
              <span>Add Setting</span>
            </Button>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {settings[activeTab]?.map((setting, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Input
                    placeholder="Setting name"
                    value={setting.key}
                    onChange={(e) => updateSetting(activeTab, index, 'key', e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="flex-1">
                  <select
                    value={setting.type}
                    onChange={(e) => updateSetting(activeTab, index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
                  >
                    <option value="string">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="select">Select</option>
                  </select>
                </div>
                <div className="flex-1">
                  {renderSettingField(setting, activeTab, index)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSetting(activeTab, index)}
                  className="p-2 text-red-600 hover:bg-red-50"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {settings[activeTab]?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No settings configured</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSetting(activeTab)}
                  className="mt-2"
                  type="button"
                >
                  Add First Setting
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button onClick={handleSave} isLoading={isLoading} className="flex items-center space-x-2" type="button">
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </Button>
      </div>
    </Modal>
  );
}
