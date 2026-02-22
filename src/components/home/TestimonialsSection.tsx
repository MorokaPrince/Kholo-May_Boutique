'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

// ===========================================
// Testimonials Data
// ===========================================

const testimonials = [
  {
    id: 1,
    name: 'Thandi Mokoena',
    role: 'Loyal Customer',
    content: 'Kholo & May Boutique has become my go-to destination for luxury perfumes. The selection is incredible, and the customer service is exceptional. I always receive my orders promptly and beautifully packaged.',
    image: '/images/testimonials/customer-1.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'David Nkosi',
    role: 'Forever Living Enthusiast',
    content: 'I\'ve been buying Forever Living products from Kholo & May for over a year now. The authenticity and quality are unmatched. Their team is knowledgeable and always ready to help with product recommendations.',
    image: '/images/testimonials/customer-2.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sarah van der Berg',
    role: 'Fashion Lover',
    content: 'The clothing collection from Kholo & May is absolutely stunning. The quality of fabrics and attention to detail in their own brand pieces rival international designers. I\'m constantly receiving compliments on my outfits.',
    image: '/images/testimonials/customer-3.jpg',
    rating: 5,
  },
];

// ===========================================
// Testimonials Section Component
// ===========================================

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section bg-luxury-cream">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-caption mb-3">What Our Customers Say</p>
          <h2 className="heading-2">Customer Reviews</h2>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-luxury-lightGray" />

            {/* Testimonial Content */}
            <div className="bg-white p-8 md:p-12 shadow-luxury">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    'transition-opacity duration-500',
                    index === currentIndex ? 'opacity-100' : 'opacity-0 hidden'
                  )}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-gold-400 text-gold-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-lg md:text-xl text-luxury-gray mb-8 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-luxury-gray">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 border border-luxury-lightGray hover:border-luxury-black transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentIndex
                        ? 'bg-luxury-black w-6'
                        : 'bg-luxury-lightGray hover:bg-luxury-gray'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 border border-luxury-lightGray hover:border-luxury-black transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
