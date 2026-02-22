import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// ===========================================
// Categories Data
// ===========================================

const categories = [
  {
    id: 'perfumes',
    name: 'Perfumes',
    description: 'Luxury fragrances from world-renowned brands',
    image: '/images/categories/perfumes.jpg',
    count: 45,
  },
  {
    id: 'forever-living',
    name: 'Forever Living',
    description: 'Natural aloe vera wellness products',
    image: '/images/categories/forever-living.jpg',
    count: 32,
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Exclusive fashion from our own brand',
    image: '/images/categories/clothing.jpg',
    count: 28,
  },
];

// ===========================================
// Categories Section Component
// ===========================================

export function CategoriesSection() {
  return (
    <section className="section bg-luxury-cream">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-caption mb-3">Browse By</p>
          <h2 className="heading-2">Shop Categories</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative h-80 md:h-96 overflow-hidden"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-6">
                <h3 className="font-display text-3xl md:text-4xl mb-2">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-4 max-w-xs">
                  {category.description}
                </p>
                <span className="text-xs uppercase tracking-widest text-white/60">
                  {category.count} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
