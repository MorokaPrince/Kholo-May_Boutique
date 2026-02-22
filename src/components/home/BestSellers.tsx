import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

// ===========================================
// Mock Best Sellers
// ===========================================

const bestSellers = [
  {
    id: '9',
    name: 'YSL Libre Eau de Parfum',
    slug: 'ysl-libre-eau-de-parfum',
    price: 2450,
    image: '/images/products/perfume-5.jpg',
    category: 'Perfumes',
    isBestSeller: true,
  },
  {
    id: '10',
    name: 'Forever Living Aloe Vera Gelly',
    slug: 'forever-living-aloe-vera-gelly',
    price: 320,
    image: '/images/products/aloe-3.jpg',
    category: 'Forever Living',
    isBestSeller: true,
  },
  {
    id: '11',
    name: 'Cashmere Wrap Coat',
    slug: 'cashmere-wrap-coat',
    price: 3200,
    comparePrice: 3800,
    image: '/images/products/clothing-2.jpg',
    category: 'Clothing',
    isBestSeller: true,
  },
  {
    id: '12',
    name: 'Creed Aventus',
    slug: 'creed-aventus',
    price: 4500,
    image: '/images/products/perfume-6.jpg',
    category: 'Perfumes',
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
