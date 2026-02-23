'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// ===========================================
// Hero Slides Data
// ===========================================

const heroSlides = [
  {
    id: 1,
    title: 'Discover Luxury',
    subtitle: 'Perfumes & Fragrances',
    description: 'Explore our curated collection of premium perfumes from world-renowned brands.',
    image: '/images/hero/hero-1.svg',
    link: '/shop?category=perfumes',
    buttonText: 'Shop Perfumes',
  },
  {
    id: 2,
    title: 'Forever Living',
    subtitle: 'Natural Wellness',
    description: 'Transform your life with Forever Living\'s premium aloe vera products.',
    image: '/images/hero/hero-2.svg',
    link: '/shop?category=forever-living',
    buttonText: 'Explore Now',
  },
  {
    id: 3,
    title: 'Exclusive Fashion',
    subtitle: 'Our Brand Collection',
    description: 'Discover our exclusive clothing line designed for the modern lifestyle.',
    image: '/images/hero/hero-3.svg',
    link: '/shop?category=clothing',
    buttonText: 'View Collection',
  },
];

// ===========================================
// Hero Section Component
// ===========================================

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-advance slides
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-luxury-cream">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-luxury flex items-center">
            <div className="max-w-xl text-white">
              <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-white/80 animate-fade-in">
                {slide.subtitle}
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 animate-slide-up">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-md animate-slide-up animation-delay-200">
                {slide.description}
              </p>
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 bg-white text-luxury-black px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-luxury-cream transition-colors animate-slide-up animation-delay-300"
              >
                {slide.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
