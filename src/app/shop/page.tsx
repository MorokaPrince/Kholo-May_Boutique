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
// Products Data - Real Catalog
// ===========================================

const allProducts = [
  // Arabic Scents
  {
    id: 'as-001',
    name: 'Oud Al Mubakhar',
    slug: 'oud-al-mubakhar',
    price: 850,
    comparePrice: 950,
    image: '/images/products/arabic-scents/IMG-20260121-WA0060.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 'as-002',
    name: 'Musk Al Arab',
    slug: 'musk-al-arab',
    price: 650,
    image: '/images/products/arabic-scents/IMG-20260121-WA0061.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'as-003',
    name: 'Bakhoor Al Noor',
    slug: 'bakhoor-al-noor',
    price: 750,
    image: '/images/products/arabic-scents/IMG-20260121-WA0062.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'as-004',
    name: 'Amir Al Oud',
    slug: 'amir-al-oud',
    price: 1200,
    comparePrice: 1400,
    image: '/images/products/arabic-scents/IMG-20260121-WA0064.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'as-005',
    name: 'Rose Al Haramain',
    slug: 'rose-al-haramain',
    price: 780,
    image: '/images/products/arabic-scents/IMG-20260121-WA0066.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'as-006',
    name: 'Sandalwood Al Safa',
    slug: 'sandalwood-al-safa',
    price: 680,
    image: '/images/products/arabic-scents/IMG-20260121-WA0067.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'as-007',
    name: 'Dehn Al Oud',
    slug: 'dehn-al-oud',
    price: 1800,
    image: '/images/products/arabic-scents/IMG-20260123-WA0117.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'as-008',
    name: 'Attar Al Nabeel',
    slug: 'attar-al-nabeel',
    price: 550,
    image: '/images/products/arabic-scents/IMG-20260123-WA0120.jpg',
    category: 'arabic-scents',
    categoryLabel: 'Arabic Scents',
    brand: 'Arabic Scents',
    isNew: false,
    isBestSeller: false,
  },
  // African Perfume Co
  {
    id: 'apc-001',
    name: 'Savannah Sunset',
    slug: 'savannah-sunset',
    price: 650,
    image: '/images/products/african-perfume-co/IMG-20250930-WA0047.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 'apc-002',
    name: 'Cape Floral',
    slug: 'cape-floral',
    price: 580,
    image: '/images/products/african-perfume-co/IMG-20250930-WA0048.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'apc-003',
    name: 'Baobab Bliss',
    slug: 'baobab-bliss',
    price: 620,
    image: '/images/products/african-perfume-co/IMG-20250930-WA0049.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'apc-004',
    name: 'Zulu Warrior',
    slug: 'zulu-warrior',
    price: 720,
    comparePrice: 850,
    image: '/images/products/african-perfume-co/IMG-20251022-WA0060.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'apc-005',
    name: 'Madikwe Musk',
    slug: 'madikwe-musk',
    price: 680,
    image: '/images/products/african-perfume-co/IMG-20251022-WA0061.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'apc-006',
    name: 'Table Mountain Mist',
    slug: 'table-mountain-mist',
    price: 590,
    image: '/images/products/african-perfume-co/IMG-20251022-WA0062.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'apc-007',
    name: 'Marula Gold',
    slug: 'marula-gold',
    price: 640,
    image: '/images/products/african-perfume-co/IMG-20251212-WA0085.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'apc-008',
    name: 'Serengeti Soul',
    slug: 'serengeti-soul',
    price: 750,
    image: '/images/products/african-perfume-co/IMG-20260124-WA0589.jpg',
    category: 'african-perfume-co',
    categoryLabel: 'African Perfume Co',
    brand: 'The African Perfume Co.',
    isNew: false,
    isBestSeller: false,
  },
  // Forever Living Products
  {
    id: 'fl-001',
    name: 'Aloe Vera Gel',
    slug: 'aloe-vera-gel',
    price: 380,
    image: '/images/products/forever-living/IMG-20260123-WA0050.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'fl-002',
    name: 'Aloe Berry Nectar',
    slug: 'aloe-berry-nectar',
    price: 420,
    image: '/images/products/forever-living/IMG-20260123-WA0051.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'fl-003',
    name: 'Forever Bee Pollen',
    slug: 'forever-bee-pollen',
    price: 380,
    image: '/images/products/forever-living/IMG-20260123-WA0052.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'fl-004',
    name: 'Aloe Vera Gelly',
    slug: 'aloe-vera-gelly',
    price: 320,
    image: '/images/products/forever-living/IMG-20260123-WA0053.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'fl-005',
    name: 'Forever Propolis Cream',
    slug: 'forever-propolis-cream',
    price: 350,
    image: '/images/products/forever-living/IMG-20260123-WA0054.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'fl-006',
    name: 'Aloe Moisturizing Lotion',
    slug: 'aloe-moisturizing-lotion',
    price: 380,
    image: '/images/products/forever-living/IMG-20260123-WA0055.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'fl-007',
    name: 'Forever Bright Toothgel',
    slug: 'forever-bright-toothgel',
    price: 180,
    image: '/images/products/forever-living/IMG-20260123-WA0056.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'fl-008',
    name: 'Aloe Heat Lotion',
    slug: 'aloe-heat-lotion',
    price: 340,
    image: '/images/products/forever-living/IMG-20260123-WA0057.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'fl-009',
    name: 'Forever Multi-Maca',
    slug: 'forever-multi-maca',
    price: 450,
    image: '/images/products/forever-living/IMG-20260123-WA0058.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'fl-010',
    name: 'Aloe Sunscreen',
    slug: 'aloe-sunscreen',
    price: 280,
    image: '/images/products/forever-living/IMG-20260123-WA0059.jpg',
    category: 'forever-living',
    categoryLabel: 'Forever Living',
    brand: 'Forever Living',
    isNew: false,
    isBestSeller: false,
  },
];

const categories = [
  { id: 'all', name: 'All Products', count: allProducts.length },
  { id: 'arabic-scents', name: 'Arabic Scents', count: allProducts.filter(p => p.category === 'arabic-scents').length },
  { id: 'african-perfume-co', name: 'African Perfume Co', count: allProducts.filter(p => p.category === 'african-perfume-co').length },
  { id: 'forever-living', name: 'Forever Living', count: allProducts.filter(p => p.category === 'forever-living').length },
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
