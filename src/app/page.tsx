import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { PromotionalSection } from '@/components/home/PromotionalSection';
import { NewArrivals } from '@/components/home/NewArrivals';
import { BestSellers } from '@/components/home/BestSellers';
import { BrandStory } from '@/components/home/BrandStory';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

// ===========================================
// Homepage
// ===========================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories */}
      <CategoriesSection />

      {/* Promotional Banner */}
      <PromotionalSection />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Best Sellers */}
      <BestSellers />

      {/* Brand Story */}
      <BrandStory />

      {/* Testimonials */}
      <TestimonialsSection />
    </>
  );
}
