import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// ===========================================
// Promotional Section Component
// ===========================================

export function PromotionalSection() {
  return (
    <section className="section bg-white">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Promo */}
          <div className="relative h-80 md:h-96 overflow-hidden bg-luxury-cream">
            <div className="absolute inset-0">
              <Image
                src="/images/promo/promo-1.jpg"
                alt="Special Offer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-luxury-black/30" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <p className="text-xs uppercase tracking-widest mb-2 text-white/70">
                Limited Time Offer
              </p>
              <h3 className="font-display text-3xl md:text-4xl mb-4">
                20% Off All Perfumes
              </h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Discover our exclusive collection of luxury fragrances at special prices.
              </p>
              <Link
                href="/shop?category=perfumes"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Promo */}
          <div className="relative h-80 md:h-96 overflow-hidden bg-luxury-cream">
            <div className="absolute inset-0">
              <Image
                src="/images/promo/promo-2.jpg"
                alt="New Collection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-luxury-black/30" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <p className="text-xs uppercase tracking-widest mb-2 text-white/70">
                New Season
              </p>
              <h3 className="font-display text-3xl md:text-4xl mb-4">
                Summer Collection 2024
              </h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Explore our latest arrivals in fashion and accessories.
              </p>
              <Link
                href="/shop?new=true"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
