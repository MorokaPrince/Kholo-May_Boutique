'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ===========================================
// Mock Products Data
// ===========================================

const allProducts = [
  {
    id: '1',
    name: 'Chanel No. 5 Eau de Parfum',
    slug: 'chanel-no-5-eau-de-parfum',
    price: 2850,
    comparePrice: 3200,
    image: '/images/products/perfume-1.jpg',
    category: 'perfumes',
    categoryLabel: 'Perfumes',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '2',
    name: 'Forever Living Aloe Vera Gel',
    slug: 'forever-living-aloe-vera-gel',
    price: 450,
    image: '/images/products/aloe-1.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Silk Evening Dress',
    slug: 'silk-evening-dress',
    price: 1950,
    comparePrice: 2400,
    image: '/images/products/dress-1.jpg',
    category: 'clothing',
    categoryLabel: 'Clothing',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '4',
    name: 'Dior Sauvage Eau de Toilette',
    slug: 'dior-sauvage-eau-de-toilette',
    price: 2100,
    image: '/images/products/perfume-2.jpg',
    category: 'perfumes',
    categoryLabel: 'Perfumes',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: '5',
    name: 'Tom Ford Black Orchid',
    slug: 'tom-ford-black-orchid',
    price: 3200,
    image: '/images/products/perfume-3.jpg',
    category: 'perfumes',
    categoryLabel: 'Perfumes',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '6',
    name: 'Forever Living Bee Pollen',
    slug: 'forever-living-bee-pollen',
    price: 380,
    image: '/images/products/aloe-2.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '7',
    name: 'Linen Blazer Set',
    slug: 'linen-blazer-set',
    price: 1650,
    image: '/images/products/clothing-1.jpg',
    category: 'clothing',
    categoryLabel: 'Clothing',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '8',
    name: 'Jo Malone Peony & Blush Suede',
    slug: 'jo-malone-peony-blush-suede',
    price: 2800,
    image: '/images/products/perfume-4.jpg',
    category: 'perfumes',
    categoryLabel: 'Perfumes',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '9',
    name: 'YSL Libre Eau de Parfum',
    slug: 'ysl-libre-eau-de-parfum',
    price: 2450,
    image: '/images/products/perfume-5.jpg',
    category: 'perfumes',
    categoryLabel: 'Perfumes',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: '10',
    name: 'Forever Living Aloe Vera Gelly',
    slug: 'forever-living-aloe-vera-gelly',
    price: 320,
    image: '/images/products/aloe-3.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: '11',
    name: 'Cashmere Wrap Coat',
    slug: 'cashmere-wrap-coat',
    price: 3200,
    comparePrice: 3800,
    image: '/images/products/clothing-2.jpg',
    category: 'clothing',
    categoryLabel: 'Clothing',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: '12',
    name: 'Creed Aventus',
    slug: 'creed-aventus',
    price: 4500,
    image: '/images/products/perfume-6.jpg',
    category: 'perfumes',
    categoryLabel: 'Perfumes',
    isNew: false,
    isBestSeller: true,
  },
];

const categories = [
  { id: 'all', name: 'All Products', count: allProducts.length },
  { id: 'perfumes', name: 'Perfumes', count: allProducts.filter(p => p.category === 'perfumes').length },
  { id: 'forever-living', name: 'Forever Living', count: allProducts.filter(p => p.category === 'forever-living').length },
  { id: 'clothing', name: 'Clothing', count: allProducts.filter(p => p.category === 'clothing').length },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

const priceRanges = [
  { min: 0, max: 500, label: 'Under R500' },
  { min: 500, max: 1000, label: 'R500 - R1,000' },
  { min: 1000, max: 2000, label: 'R1,000 - R2,000' },
  { min: 2000, max: 3000, label: 'R2,000 - R3,000' },
  { min: 3000, max: Infinity, label: 'Over R3,000' },
];

// ===========================================
// Shop Content Component
// ===========================================

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial values from URL
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialNew = searchParams.get('new') === 'true';
  const initialBestseller = searchParams.get('bestseller') === 'true';

  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number; label: string } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter products
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(query) || p.categoryLabel.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (priceRange) {
      products = products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }

    // New arrivals filter
    if (initialNew) {
      products = products.filter(p => p.isNew);
    }

    // Best sellers filter
    if (initialBestseller) {
      products = products.filter(p => p.isBestSeller);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'bestselling':
        products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'newest':
      default:
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return products;
  }, [selectedCategory, searchQuery, sortBy, priceRange, initialNew, initialBestseller]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update URL params
  const updateUrl = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/shop?${newParams.toString()}`);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    updateUrl({ category: categoryId === 'all' ? null : categoryId });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrl({ search: searchQuery || null });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(null);
    setSortBy('newest');
    setCurrentPage(1);
    router.push('/shop');
  };

  // Get page title
  const getPageTitle = () => {
    if (initialNew) return 'New Arrivals';
    if (initialBestseller) return 'Best Sellers';
    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.id === selectedCategory);
      return cat?.name || 'Shop';
    }
    return 'All Products';
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-luxury-cream py-12">
        <div className="container-luxury">
          <h1 className="heading-1 text-center">{getPageTitle()}</h1>
          <p className="text-center text-luxury-gray mt-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      <div className="container-luxury py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Search</h3>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 text-luxury-gray" />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className={cn(
                          'flex items-center justify-between w-full py-2 text-sm transition-colors',
                          selectedCategory === category.id
                            ? 'text-luxury-black font-medium'
                            : 'text-luxury-gray hover:text-luxury-black'
                        )}
                      >
                        {category.name}
                        <span className="text-xs">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Price Range</h3>
                <ul className="space-y-2">
                  {priceRanges.map((range) => (
                    <li key={range.label}>
                      <button
                        onClick={() => setPriceRange(priceRange?.label === range.label ? null : range)}
                        className={cn(
                          'flex items-center gap-2 w-full py-2 text-sm transition-colors',
                          priceRange?.label === range.label
                            ? 'text-luxury-black font-medium'
                            : 'text-luxury-gray hover:text-luxury-black'
                        )}
                      >
                        <span
                          className={cn(
                            'w-4 h-4 border rounded-sm flex items-center justify-center',
                            priceRange?.label === range.label && 'bg-luxury-black border-luxury-black'
                          )}
                        >
                          {priceRange?.label === range.label && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                              <path
                                fill="currentColor"
                                d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z"
                              />
                            </svg>
                          )}
                        </span>
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || searchQuery || priceRange) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-luxury-gray hover:text-luxury-black underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-luxury-lightGray">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Sort */}
              <div className="flex items-center gap-4">
                <label htmlFor="sort-select" className="text-sm text-luxury-gray">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none bg-transparent focus:outline-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid View Toggle */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setGridView('grid')}
                  className={cn(
                    'p-2',
                    gridView === 'grid' ? 'text-luxury-black' : 'text-luxury-gray'
                  )}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridView('list')}
                  className={cn(
                    'p-2',
                    gridView === 'list' ? 'text-luxury-black' : 'text-luxury-gray'
                  )}
                  aria-label="List view"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || searchQuery || priceRange || initialNew || initialBestseller) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-luxury-gray">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="flex items-center gap-1 px-3 py-1 bg-luxury-cream text-sm"
                  >
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      updateUrl({ search: null });
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-luxury-cream text-sm"
                  >
                    &ldquo;{searchQuery}&rdquo;
                    <X className="w-3 h-3" />
                  </button>
                )}
                {priceRange && (
                  <button
                    onClick={() => setPriceRange(null)}
                    className="flex items-center gap-1 px-3 py-1 bg-luxury-cream text-sm"
                  >
                    {priceRange.label}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {initialNew && (
                  <button
                    onClick={() => router.push('/shop')}
                    className="flex items-center gap-1 px-3 py-1 bg-luxury-cream text-sm"
                  >
                    New Arrivals
                    <X className="w-3 h-3" />
                  </button>
                )}
                {initialBestseller && (
                  <button
                    onClick={() => router.push('/shop')}
                    className="flex items-center gap-1 px-3 py-1 bg-luxury-cream text-sm"
                  >
                    Best Sellers
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div
                className={cn(
                  gridView === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                    : 'flex flex-col gap-6'
                )}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-luxury-gray mb-4">No products found matching your criteria.</p>
                <button onClick={clearFilters} className="btn-secondary">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-luxury-lightGray disabled:opacity-50 disabled:cursor-not-allowed hover:border-luxury-black transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-10 h-10 text-sm transition-colors',
                      currentPage === page
                        ? 'bg-luxury-black text-white'
                        : 'border border-luxury-lightGray hover:border-luxury-black'
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-luxury-lightGray disabled:opacity-50 disabled:cursor-not-allowed hover:border-luxury-black transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute top-0 right-0 h-full w-80 max-w-full bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-luxury-lightGray">
              <h3 className="font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-8">
              {/* Search */}
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Search</h4>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 text-luxury-gray" />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Categories</h4>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          handleCategoryChange(category.id);
                          setShowFilters(false);
                        }}
                        className={cn(
                          'flex items-center justify-between w-full py-2 text-sm',
                          selectedCategory === category.id
                            ? 'text-luxury-black font-medium'
                            : 'text-luxury-gray'
                        )}
                      >
                        {category.name}
                        <span className="text-xs">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Price Range</h4>
                <ul className="space-y-2">
                  {priceRanges.map((range) => (
                    <li key={range.label}>
                      <button
                        onClick={() => setPriceRange(priceRange?.label === range.label ? null : range)}
                        className={cn(
                          'flex items-center gap-2 w-full py-2 text-sm',
                          priceRange?.label === range.label
                            ? 'text-luxury-black font-medium'
                            : 'text-luxury-gray'
                        )}
                      >
                        <span
                          className={cn(
                            'w-4 h-4 border rounded-sm flex items-center justify-center',
                            priceRange?.label === range.label && 'bg-luxury-black border-luxury-black'
                          )}
                        >
                          {priceRange?.label === range.label && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                              <path
                                fill="currentColor"
                                d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z"
                              />
                            </svg>
                          )}
                        </span>
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-luxury-lightGray">
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShopLoading() {
  return (
    <>
      <div className="bg-luxury-cream py-12">
        <div className="container-luxury">
          <div className="h-10 w-64 mx-auto bg-luxury-lightGray animate-pulse rounded" />
          <div className="h-5 w-32 mx-auto mt-2 bg-luxury-lightGray animate-pulse rounded" />
        </div>
      </div>
      <div className="container-luxury py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 w-24 bg-luxury-cream animate-pulse rounded" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 w-full bg-luxury-cream animate-pulse rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <main className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-luxury-cream animate-pulse rounded" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// ===========================================
// Shop Page Component
// ===========================================

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<ShopLoading />}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
