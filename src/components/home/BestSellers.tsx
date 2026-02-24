import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

// ===========================================
// Best Sellers - Real Catalog
// ===========================================

const bestSellers = [
  {
    id: 'as-002',
    name: 'Musk Al Arab',
    slug: 'musk-al-arab',
    price: 650,
    image: '/images/products/arabic-scents/IMG-20260121-WA0061.jpg',
    category: 'Arabic Scents',
    isBestSeller: true,
  },
  {
    id: 'fl-004',
    name: 'Aloe Vera Gelly',
    slug: 'aloe-vera-gelly',
    price: 320,
    image: '/images/products/forever-living/IMG-20260123-WA0053.jpg',
    category: 'Forever Living',
    isBestSeller: true,
  },
  {
    id: 'apc-002',
    name: 'Cape Floral',
    slug: 'cape-floral',
    price: 580,
    image: '/images/products/african-perfume-co/IMG-20250930-WA0048.jpg',
    category: 'African Perfume Co',
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
// Best Sellers Component
// ===========================================

export function BestSellers() {
  return (
    <section className="section bg-luxury-cream">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-caption mb-3">Customer Favorites</p>
            <h2 className="heading-2">Best Sellers</h2>
          </div>
          <Link
            href="/shop?bestseller=true"
            className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:gap-3 transition-all"
          >
            View All <span>→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-8 md:hidden">
          <Link href="/shop?bestseller=true" className="btn-secondary">
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
