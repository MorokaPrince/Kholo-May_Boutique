'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

// ===========================================
// Featured Products - Real Catalog
// ===========================================

const featuredProducts = [
  {
    id: 'as-001',
    name: 'Oud Al Mubakhar',
    slug: 'oud-al-mubakhar',
    price: 850,
    comparePrice: 950,
    image: '/images/products/arabic-scents/IMG-20260121-WA0060.jpg',
    category: 'Arabic Scents',
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 'fl-001',
    name: 'Aloe Vera Gel',
    slug: 'aloe-vera-gel',
    price: 380,
    image: '/images/products/forever-living/IMG-20260123-WA0050.jpg',
    category: 'Forever Living',
    isBestSeller: true,
  },
  {
    id: 'apc-001',
    name: 'Savannah Sunset',
    slug: 'savannah-sunset',
    price: 650,
    image: '/images/products/african-perfume-co/IMG-20250930-WA0047.jpg',
    category: 'African Perfume Co',
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 'as-004',
    name: 'Amir Al Oud',
    slug: 'amir-al-oud',
    price: 1200,
    comparePrice: 1400,
    image: '/images/products/arabic-scents/IMG-20260121-WA0064.jpg',
    category: 'Arabic Scents',
    isBestSeller: true,
  },
];

// ===========================================
// Featured Products Component
// ===========================================

export function FeaturedProducts() {
  return (
    <section className="section bg-white">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-caption mb-3">Handpicked Selection</p>
          <h2 className="heading-2">Featured Products</h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/shop" className="btn-secondary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
