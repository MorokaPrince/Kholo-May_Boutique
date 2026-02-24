import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

// ===========================================
// New Arrivals - Real Catalog
// ===========================================

const newArrivals = [
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
    id: 'fl-003',
    name: 'Forever Bee Pollen',
    slug: 'forever-bee-pollen',
    price: 380,
    image: '/images/products/forever-living/IMG-20260123-WA0052.jpg',
    category: 'Forever Living',
    isNew: true,
  },
  {
    id: 'apc-004',
    name: 'Zulu Warrior',
    slug: 'zulu-warrior',
    price: 720,
    comparePrice: 850,
    image: '/images/products/african-perfume-co/IMG-20251022-WA0060.jpg',
    category: 'African Perfume Co',
    isNew: true,
  },
  {
    id: 'as-007',
    name: 'Dehn Al Oud',
    slug: 'dehn-al-oud',
    price: 1800,
    image: '/images/products/arabic-scents/IMG-20260123-WA0117.jpg',
    category: 'Arabic Scents',
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
