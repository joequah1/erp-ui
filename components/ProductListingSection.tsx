"use client";
import React, { useState, useEffect } from 'react';
import { Store, ExternalLink, Package, Link as LinkIcon } from 'lucide-react';
import { ProductListing } from '@/types';
import { productListingsApi, ProductListingFilters } from '@/services/productListings';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProductListingSectionProps {
  inventoryId: string;
}

export function ProductListingSection({ inventoryId }: ProductListingSectionProps) {
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters] = useState<ProductListingFilters>({
    page: 1,
    limit: 50,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryId]);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      // Use the new inventory-specific endpoint
      const response = await productListingsApi.getByInventoryId(inventoryId, filters);
      setListings(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load product listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status?: number) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800';
      case 0: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: number) => {
    switch (status) {
      case 1: return 'Active';
      case 0: return 'Inactive';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Store className="h-5 w-5" />
          <span>Marketplace Listings</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Product listings across different marketplaces ({total} listings)
        </p>
      </div>

      {/* Listings Content */}
      <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600">
                This product hasn't been listed on any marketplace
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-3">
                    {/* Integration and Status badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {listing.integration?.thumbnailImage ? (
                        <img
                          src={listing.integration.thumbnailImage}
                          alt={listing.integration.name}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900">
                        {listing.integration?.name || 'Unknown Platform'}
                      </span>
                      {listing.account && (
                        <span className="text-sm text-gray-500">
                          ({listing.account.name})
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(listing.status)}`}>
                        {getStatusLabel(listing.status)}
                      </span>
                      {listing.syncStock === 1 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Stock Sync ON
                        </span>
                      )}
                    </div>

                    {/* Listing Name */}
                    {listing.name && (
                      <p className="text-sm text-gray-900 font-medium">{listing.name}</p>
                    )}

                    {/* Listing Details */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      {listing.stock !== undefined && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Stock:</span>
                          <span className="font-mono font-medium text-gray-900">{listing.stock}</span>
                        </div>
                      )}
                      {listing.totalSold !== undefined && listing.totalSold > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Total Sold:</span>
                          <span className="font-medium text-gray-900">{listing.totalSold}</span>
                        </div>
                      )}
                      {listing.productUrl && (
                        <a
                          href={listing.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span>View on Platform</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Variants (if any) */}
                    {(listing.option1 || listing.option2 || listing.option3) && (
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="text-gray-500">Variants:</span>
                        {listing.option1 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">{listing.option1}</span>
                        )}
                        {listing.option2 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">{listing.option2}</span>
                        )}
                        {listing.option3 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">{listing.option3}</span>
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {formatDate(listing.createdAt)}</span>
                      {listing.lastImportedAt && (
                        <span>Last Synced: {formatDate(listing.lastImportedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
    </Card>
  );
}
