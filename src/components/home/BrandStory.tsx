import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// ===========================================
// Brand Story Component
// ===========================================

export function BrandStory() {
  return (
    <section className="section bg-white">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 lg:h-[500px]">
            <Image
              src="/images/about/brand-story.jpg"
              alt="Kholo & May Boutique Story"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-caption mb-3">Our Story</p>
            <h2 className="heading-2 mb-6">
              Curating Luxury for the Modern Lifestyle
            </h2>
            <div className="space-y-4 text-luxury-gray mb-8">
              <p>
                Kholo & May Boutique was born from a passion for bringing world-class luxury 
                products to South Africa. We believe that everyone deserves access to premium 
                fragrances, wellness products, and fashion that elevates their daily life.
              </p>
              <p>
                Our carefully curated collection features renowned perfume houses, authentic 
                Forever Living wellness products, and our exclusive clothing line designed 
                for the modern South African lifestyle.
              </p>
              <p>
                Every product in our store is selected with care, ensuring authenticity, 
                quality, and the promise of a luxurious experience.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
