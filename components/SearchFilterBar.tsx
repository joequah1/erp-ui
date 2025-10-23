"use client";
import React, { ReactNode } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface SearchFilterBarProps {
  // Search props
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;

  // Filter props
  showFilters: boolean;
  onToggleFilters: () => void;
  filterContent?: ReactNode;

  // Optional: hide filter button if no filters
  hasFilters?: boolean;
}

export function SearchFilterBar({
  searchPlaceholder = "Search...",
  onSearchChange,
  showFilters,
  onToggleFilters,
  filterContent,
  hasFilters = true,
}: SearchFilterBarProps) {
  return (
    <Card>
      <div className="space-y-4">
        {/* Search and Filter Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && filterContent && (
          <div className="pt-4 border-t border-gray-200">
            {filterContent}
          </div>
        )}
      </div>
    </Card>
  );
}
