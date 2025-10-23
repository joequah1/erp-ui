"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Tag,
  Box,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
  FileText,
  Home,
  Store,
  User
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['inventory', 'management']);
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      label: 'Dashboard',
      items: [
        { path: '/dashboard', label: 'Overview', icon: Home },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'Inventory',
      items: [
        { path: '/inventory', label: 'Items', icon: Package },
        { path: '/inventory/import-export', label: 'Import/Export', icon: FileText },
      ]
    },
    {
      label: 'Management',
      items: [
        { path: '/brands', label: 'Brands', icon: Tag },
        { path: '/categories', label: 'Categories', icon: Box },
        { path: '/product-types', label: 'Product Types', icon: Settings },
        { path: '/batches', label: 'Batches', icon: Package },
      ]
    },
    {
      label: 'Shop',
      items: [
        { path: '/shops', label: 'Shop Management', icon: Store },
      ]
    },
    {
      label: 'System',
      items: [
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/roles', label: 'Roles', icon: Settings },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupLabel)
        ? prev.filter(g => g !== groupLabel)
        : [...prev, groupLabel]
    );
  };

  // Use Next.js usePathname for active state
  const isActive = (path: string) => {
    // Exact match or starts with for subroutes
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/inventory" className="flex items-center space-x-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Package className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ShopFlow</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.label.toLowerCase());
          return (
            <div key={group.label} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.label.toLowerCase())}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>{group.label}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isExpanded && (
                <div className="ml-3 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                          active
                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
