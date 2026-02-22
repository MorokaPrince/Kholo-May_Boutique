'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

// ===========================================
// Mock Featured Products
// ===========================================

const featuredProducts = [
  {
    id: '1',
    name: 'Chanel No. 5 Eau de Parfum',
    slug: 'chanel-no-5-eau-de-parfum',
    price: 2850,
    comparePrice: 3200,
    image: '/images/products/perfume-1.jpg',
    category: 'Perfumes',
    isNew: true,
  },
  {
    id: '2',
    name: 'Forever Living Aloe Vera Gel',
    slug: 'forever-living-aloe-vera-gel',
    price: 450,
    image: '/images/products/aloe-1.jpg',
    category: 'Forever Living',
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Silk Evening Dress',
    slug: 'silk-evening-dress',
    price: 1950,
    comparePrice: 2400,
    image: '/images/products/dress-1.jpg',
    category: 'Clothing',
    isNew: true,
  },
  {
    id: '4',
    name: 'Dior Sauvage Eau de Toilette',
    slug: 'dior-sauvage-eau-de-toilette',
    price: 2100,
    image: '/images/products/perfume-2.jpg',
    category: 'Perfumes',
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
