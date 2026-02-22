'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';

// ===========================================
// Mock Products Data
// ===========================================

const mockProducts = [
  {
    id: '1',
    name: 'Chanel No. 5 Eau de Parfum',
    sku: 'CHN-N5-EDP-100',
    price: 2850,
    comparePrice: 3200,
    stockQuantity: 15,
    stockStatus: 'IN_STOCK',
    category: 'Perfumes',
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    image: '/images/products/perfume-1.jpg',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Forever Living Aloe Vera Gel',
    sku: 'FL-AVG-001',
    price: 450,
    stockQuantity: 0,
    stockStatus: 'OUT_OF_STOCK',
    category: 'Forever Living',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    image: '/images/products/aloe-1.jpg',
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    name: 'Silk Evening Dress',
    sku: 'KMB-SED-001',
    price: 1950,
    comparePrice: 2400,
    stockQuantity: 8,
    stockStatus: 'IN_STOCK',
    category: 'Clothing',
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    image: '/images/products/dress-1.jpg',
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    name: 'Dior Sauvage Eau de Toilette',
    sku: 'DIO-SAV-EDT-100',
    price: 2100,
    stockQuantity: 3,
    stockStatus: 'LOW_STOCK',
    category: 'Perfumes',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    image: '/images/products/perfume-2.jpg',
    createdAt: '2024-01-03',
  },
  {
    id: '5',
    name: 'Tom Ford Black Orchid',
    sku: 'TF-BO-100',
    price: 3200,
    stockQuantity: 12,
    stockStatus: 'IN_STOCK',
    category: 'Perfumes',
    isActive: false,
    isFeatured: false,
    isNewArrival: true,
    image: '/images/products/perfume-3.jpg',
    createdAt: '2024-01-01',
  },
];

const stockStatusColors: Record<string, string> = {
  IN_STOCK: 'bg-green-100 text-green-800',
  LOW_STOCK: 'bg-yellow-100 text-yellow-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
  ON_BACKORDER: 'bg-blue-100 text-blue-800',
};

// ===========================================
// Admin Products Page
// ===========================================

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.stockStatus === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2">Products</h1>
          <p className="text-luxury-gray">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow-luxury">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input w-full md:w-48"
            title="Select category"
          >
            <option value="all">All Categories</option>
            <option value="Perfumes">Perfumes</option>
            <option value="Forever Living">Forever Living</option>
            <option value="Clothing">Clothing</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-full md:w-48"
            title="Select status"
          >
            <option value="all">All Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-luxury-lightGray bg-luxury-cream">
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Product
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  SKU
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Price
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Stock
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Category
                </th>
                <th className="text-right text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-luxury-lightGray/50 hover:bg-luxury-cream/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-luxury-cream flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.isFeatured && (
                            <span className="text-xs bg-gold-100 text-gold-800 px-2 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-luxury-gray">{product.sku}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{formatPrice(product.price)}</p>
                      {product.comparePrice && (
                        <p className="text-sm text-luxury-gray line-through">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded',
                        stockStatusColors[product.stockStatus]
                      )}
                    >
                      {product.stockQuantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <Eye className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-luxury-gray text-sm">
                        <EyeOff className="w-4 h-4" />
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 hover:bg-luxury-cream rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-luxury-gray mb-4">No products found</p>
            <Link href="/admin/products/new" className="btn-primary">
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
