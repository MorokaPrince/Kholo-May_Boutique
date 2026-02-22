import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

// ===========================================
// Mock New Arrivals
// ===========================================

const newArrivals = [
  {
    id: '5',
    name: 'Tom Ford Black Orchid',
    slug: 'tom-ford-black-orchid',
    price: 3200,
    image: '/images/products/perfume-3.jpg',
    category: 'Perfumes',
    isNew: true,
  },
  {
    id: '6',
    name: 'Forever Living Bee Pollen',
    slug: 'forever-living-bee-pollen',
    price: 380,
    image: '/images/products/aloe-2.jpg',
    category: 'Forever Living',
    isNew: true,
  },
  {
    id: '7',
    name: 'Linen Blazer Set',
    slug: 'linen-blazer-set',
    price: 1650,
    image: '/images/products/clothing-1.jpg',
    category: 'Clothing',
    isNew: true,
  },
  {
    id: '8',
    name: 'Jo Malone Peony & Blush Suede',
    slug: 'jo-malone-peony-blush-suede',
    price: 2800,
    image: '/images/products/perfume-4.jpg',
    category: 'Perfumes',
    isNew: true,
  },
];

// ===========================================
// New Arrivals Component
// ===========================================

export function NewArrivals() {
  return (
    <section className="section bg-white">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-caption mb-3">Just In</p>
            <h2 className="heading-2">New Arrivals</h2>
          </div>
          <Link
            href="/shop?new=true"
            className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:gap-3 transition-all"
          >
            View All <span>→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-8 md:hidden">
          <Link href="/shop?new=true" className="btn-secondary">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
