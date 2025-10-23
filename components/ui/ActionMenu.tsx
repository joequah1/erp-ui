import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface ActionMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function ActionMenu({ onView, onEdit, onDelete, isDeleting }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border-none hover:bg-gray-100"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {onView && (
            <button
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              disabled={isDeleting}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
