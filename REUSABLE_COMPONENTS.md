# Reusable Components Documentation

This document contains all reusable components available in the application for consistent UI/UX across modules.

---

## Table of Contents

1. [UI Components](#ui-components)
2. [Layout Components](#layout-components)
3. [Feature Components](#feature-components)
4. [Best Practices](#best-practices)

---

## UI Components

### Button (`/components/ui/Button.tsx`)

Pre-styled button component with multiple variants.

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="sm" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: `'primary'` | `'outline'` | `'ghost'` | `'danger'`
- `size`: `'sm'` | `'md'` | `'lg'`
- `disabled`: boolean
- `className`: string (for custom styling)
- All standard HTML button props

**Examples:**
```tsx
// Primary button
<Button>Submit</Button>

// Small outline button
<Button variant="outline" size="sm">Cancel</Button>

// Button with icon
<Button className="flex items-center space-x-2">
  <Plus className="h-4 w-4" />
  <span>Add Item</span>
</Button>
```

---

### Card (`/components/ui/Card.tsx`)

Container component for grouping related content.

**Usage:**
```tsx
import { Card } from '@/components/ui/Card';

<Card padding="default">
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>
```

**Props:**
- `padding`: `'none'` | `'default'` | `'lg'`
- `className`: string
- `children`: ReactNode

**Examples:**
```tsx
// Card with default padding
<Card>Content</Card>

// Card with no padding (for tables)
<Card padding="none">
  <table>...</table>
</Card>
```

---

### Input (`/components/ui/Input.tsx`)

Styled input field component.

**Usage:**
```tsx
import { Input } from '@/components/ui/Input';

<Input
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Props:**
- `label`: string (optional label above input)
- `error`: string (error message to display)
- `className`: string
- All standard HTML input props

**Examples:**
```tsx
// Simple input
<Input placeholder="Search..." onChange={handleChange} />

// Input with label
<Input label="Email" type="email" />

// Input with search icon
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
  <Input placeholder="Search..." className="pl-10" />
</div>
```

---

### Select (`/components/ui/Select.tsx`)

Styled select dropdown component.

**Usage:**
```tsx
import { Select } from '@/components/ui/Select';

<Select
  label="Category"
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  placeholder="Select an option"
/>
```

**Props:**
- `label`: string
- `value`: string
- `onChange`: (e: ChangeEvent<HTMLSelectElement>) => void
- `options`: Array<{ value: string; label: string }>
- `placeholder`: string
- `error`: string

**Examples:**
```tsx
// Basic select
<Select
  label="Status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>

// Select with placeholder
<Select
  label="Brand"
  value={brandId}
  onChange={handleChange}
  options={brands.map(b => ({ value: b.id, label: b.name }))}
  placeholder="All brands"
/>
```

---

### Toggle (`/components/ui/Toggle.tsx`)

Toggle switch component for boolean values.

**Usage:**
```tsx
import { Toggle } from '@/components/ui/Toggle';

<Toggle
  label="Enable notifications"
  checked={isEnabled}
  onChange={setIsEnabled}
/>
```

**Props:**
- `label`: string
- `checked`: boolean
- `onChange`: (checked: boolean) => void

---

### Modal (`/components/ui/Modal.tsx`)

Modal dialog component for overlays.

**Usage:**
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Item"
>
  <div>Modal content</div>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: ReactNode
- `size`: `'sm'` | `'md'` | `'lg'` | `'xl'`

---

### LoadingSpinner (`/components/ui/LoadingSpinner.tsx`)

Loading indicator component.

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="lg" />
```

**Props:**
- `size`: `'sm'` | `'md'` | `'lg'`

**Examples:**
```tsx
// Centered loading state
<div className="flex items-center justify-center py-12">
  <LoadingSpinner size="lg" />
</div>
```

---

### ActionMenu (`/components/ui/ActionMenu.tsx`)

Dropdown menu for table row actions (View, Edit, Delete).

**Usage:**
```tsx
import { ActionMenu } from '@/components/ui/ActionMenu';

<ActionMenu
  onView={() => handleView(item)}
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item)}
  isDeleting={deletingId === item.id}
/>
```

**Props:**
- `onView`: () => void
- `onEdit`: () => void
- `onDelete`: () => void
- `isDeleting`: boolean

**Examples:**
```tsx
// In a table cell
<td className="px-6 py-4 text-center">
  <ActionMenu
    onView={() => router.push(`/items/${item.id}`)}
    onEdit={() => handleEdit(item)}
    onDelete={() => handleDelete(item)}
    isDeleting={deletingId === item.id}
  />
</td>
```

---

## Layout Components

### SearchFilterBar (`/components/SearchFilterBar.tsx`)

**NEW** - Reusable search and filter component with consistent layout.

**Usage:**
```tsx
import { SearchFilterBar } from '@/components/SearchFilterBar';

<SearchFilterBar
  searchPlaceholder="Search by name..."
  onSearchChange={(value) => handleSearch(value)}
  showFilters={showFilters}
  onToggleFilters={() => setShowFilters(!showFilters)}
  hasFilters={true}
  filterContent={
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Select label="Category" ... />
      <Select label="Status" ... />
    </div>
  }
/>
```

**Props:**
- `searchPlaceholder`: string - Placeholder text for search input
- `onSearchChange`: (value: string) => void - Search handler
- `showFilters`: boolean - Whether filters are expanded
- `onToggleFilters`: () => void - Toggle filter visibility
- `hasFilters`: boolean - Show/hide filter button (default: true)
- `filterContent`: ReactNode - Custom filter fields (optional)

**Features:**
- ✅ Search input with icon (left side)
- ✅ Filter toggle button (right side, inline with search)
- ✅ Collapsible filter section
- ✅ Consistent spacing and layout
- ✅ Fully customizable filter fields

**Examples:**

**Search Only (No Filters):**
```tsx
<SearchFilterBar
  searchPlaceholder="Search users..."
  onSearchChange={handleSearch}
  showFilters={false}
  onToggleFilters={() => {}}
  hasFilters={false}  // Hides the filter button
/>
```

**Search with 2-Column Filters:**
```tsx
<SearchFilterBar
  searchPlaceholder="Search batches..."
  onSearchChange={handleSearch}
  showFilters={showFilters}
  onToggleFilters={() => setShowFilters(!showFilters)}
  filterContent={
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label="Sort By"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        options={[
          { value: 'date', label: 'Date' },
          { value: 'name', label: 'Name' }
        ]}
      />
      <Select
        label="Order"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        options={[
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' }
        ]}
      />
    </div>
  }
/>
```

**Search with 4-Column Filters:**
```tsx
<SearchFilterBar
  searchPlaceholder="Search inventory..."
  onSearchChange={handleSearch}
  showFilters={showFilters}
  onToggleFilters={() => setShowFilters(!showFilters)}
  filterContent={
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Select label="Brand" ... />
      <Select label="Category" ... />
      <Select label="Type" ... />
      <Select label="Sort" ... />
    </div>
  }
/>
```

**With Debounced Search:**
```tsx
const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

<SearchFilterBar
  searchPlaceholder="Search products..."
  onSearchChange={(value) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      handleFilterChange('search', value);
    }, 300);
  }}
  showFilters={showFilters}
  onToggleFilters={() => setShowFilters(!showFilters)}
  filterContent={...}
/>
```

**Best Practices:**
- Use debouncing (300ms) for search to avoid excessive API calls
- Use responsive grid layouts: `grid-cols-1 md:grid-cols-X` for filters
- Keep filter labels concise and clear
- Group related filters together in the grid

---

## Feature Components

### ImportExportModal (`/components/ImportExportModal.tsx`)

Modal for importing/exporting data with template selection.

**Usage:**
```tsx
import { ImportExportModal } from '@/components/ImportExportModal';

<ImportExportModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onImport={handleImport}
  onExport={handleExport}
  title="Products Import/Export"
  templates={[
    { value: 'standard', label: 'Standard Template', description: 'Full data export' },
    { value: 'simple', label: 'Simple Template', description: 'Basic fields only' }
  ]}
/>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `onImport`: (file: File, template: string) => Promise<boolean>
- `onExport`: (template: string) => Promise<boolean>
- `title`: string
- `templates`: Array<{ value: string; label: string; description: string }>

---

## Best Practices

### Standard Module Page Structure

Every module page should follow this consistent structure:

```tsx
export default function ModulePage() {
  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">[Module] Management</h1>
          <p className="text-gray-600 mt-2">[Description]</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import/Export</span>
          </Button>
          <Button size="sm" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      {/* 2. Search & Filters */}
      <SearchFilterBar
        searchPlaceholder="Search..."
        onSearchChange={handleSearch}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterContent={...}
      />

      {/* 3. Data Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data.length === 0 ? (
          {/* Empty state */}
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No items found' : 'No items yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first item.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>Add First Item</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-900">Column</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
```

### Button Conventions

**Header Buttons:**
- Always use `size="sm"` for consistency
- Order: Import/Export button first, then Add/Create button
- Container: `space-x-3` spacing
- Icon spacing: `space-x-2` within button
- Icons: `h-4 w-4` size

```tsx
<div className="flex items-center space-x-3">
  <Button variant="outline" size="sm" className="flex items-center space-x-2">
    <Upload className="h-4 w-4" />
    <span>Import/Export</span>
  </Button>
  <Button size="sm" className="flex items-center space-x-2">
    <Plus className="h-4 w-4" />
    <span>Add Item</span>
  </Button>
</div>
```

### Empty State Pattern

All empty states should follow this pattern:

```tsx
<div className="text-center py-12">
  <div className="text-gray-400 text-6xl mb-4">[Emoji]</div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    {hasSearchOrFilter ? 'No items found' : 'No items yet'}
  </h3>
  <p className="text-gray-600 mb-4">
    {hasSearchOrFilter
      ? 'Try adjusting your search terms or filters'
      : 'Get started by adding your first item.'
    }
  </p>
  {!hasSearchOrFilter && (
    <Button onClick={handleCreate}>Add First Item</Button>
  )}
</div>
```

### Table Styling

**Standard table structure:**
```tsx
<Card padding="none">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-left font-medium text-gray-900">Header</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4">Content</td>
        </tr>
      </tbody>
    </table>
  </div>
</Card>
```

### Icon Usage

**Recommended icons from `lucide-react`:**
- Add/Create: `Plus`
- Upload/Import: `Upload`
- Search: `Search`
- Filter: `Filter`
- Edit: `Edit`
- Delete: `Trash2`
- View: `Eye`
- Close: `X`
- Check: `Check`

**Size standards:**
- Table/small icons: `h-4 w-4`
- Header icons: `h-4 w-4`
- Large icons (empty states): `h-16 w-16` or emoji with `text-6xl`

---

## Component Maintenance

When creating new reusable components:

1. **Location:** Place in `/components/` (UI) or `/components/ui/` (basic UI primitives)
2. **Naming:** Use PascalCase, descriptive names
3. **TypeScript:** Always provide proper type definitions
4. **Props:** Keep props interface clear and documented
5. **Documentation:** Update this file with usage examples
6. **Consistency:** Follow existing component patterns

---

## Version

**Last Updated:** 2025-10-19
**Components Count:** 12

---

## Questions?

For questions or suggestions about reusable components, please refer to the component source code or consult the development team.
