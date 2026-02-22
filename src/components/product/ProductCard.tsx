'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

// ===========================================
// Product Card Props
// ===========================================

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    image: string;
    category?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    stockStatus?: string;
  };
  className?: string;
}

// ===========================================
// Product Card Component
// ===========================================

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const discount = product.comparePrice
    ? calculateDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    await addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: [{ id: '1', url: product.image, isPrimary: true, productId: product.id, sortOrder: 0, createdAt: new Date() }],
      stockQuantity: 10,
      stockStatus: 'IN_STOCK',
    } as any, 1);
    
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-luxury-cream overflow-hidden mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="badge bg-luxury-black text-white text-xs px-3 py-1">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="badge bg-gold-500 text-white text-xs px-3 py-1">
                Best Seller
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-red-500 text-white text-xs px-3 py-1">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex items-center gap-2 bg-white text-luxury-black px-4 py-2 text-xs uppercase tracking-wider hover:bg-luxury-cream transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                className="p-2 bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {product.category && (
            <p className="text-xs text-luxury-gray uppercase tracking-wider">
              {product.category}
            </p>
          )}
          <h3 className="font-serif text-base line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-luxury-gray line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
