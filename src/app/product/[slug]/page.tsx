'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Star,
  Check,
} from 'lucide-react';

// ===========================================
// Mock Product Data
// ===========================================

const mockProduct = {
  id: '1',
  name: 'Chanel No. 5 Eau de Parfum',
  slug: 'chanel-no-5-eau-de-parfum',
  sku: 'CHN-N5-EDP-100',
  price: 2850,
  comparePrice: 3200,
  description: `
    <p>Chanel No. 5 is the world's most iconic fragrance. Created in 1921 by Ernest Beaux, 
    it remains the ultimate symbol of femininity and luxury. This legendary scent opens with 
    a bouquet of May Rose and Jasmine, layered with sparkling Aldehydes that create an 
    unforgettable first impression.</p>
    <p>The heart reveals a rich floral bouquet of Grasse Jasmine, May Rose, and Ylang-Ylang, 
    while the base notes of Sandalwood, Vanilla, and Vetiver provide a warm, sensual finish 
    that lingers for hours.</p>
  `,
  shortDescription: 'The iconic fragrance that defines luxury and femininity.',
  stockQuantity: 15,
  stockStatus: 'IN_STOCK' as const,
  category: { id: 'perfumes', name: 'Perfumes', slug: 'perfumes' },
  brand: 'Chanel',
  images: [
    { id: '1', url: '/images/products/perfume-1.jpg', isPrimary: true },
    { id: '2', url: '/images/products/perfume-1-2.jpg', isPrimary: false },
    { id: '3', url: '/images/products/perfume-1-3.jpg', isPrimary: false },
    { id: '4', url: '/images/products/perfume-1-4.jpg', isPrimary: false },
  ],
  isNew: true,
  isBestSeller: false,
  tags: ['perfume', 'luxury', 'womens', 'fragrance'],
  weight: '0.5 kg',
  dimensions: '10 x 8 x 15 cm',
};

const relatedProducts = [
  {
    id: '4',
    name: 'Dior Sauvage Eau de Toilette',
    slug: 'dior-sauvage-eau-de-toilette',
    price: 2100,
    image: '/images/products/perfume-2.jpg',
    category: 'Perfumes',
  },
  {
    id: '5',
    name: 'Tom Ford Black Orchid',
    slug: 'tom-ford-black-orchid',
    price: 3200,
    image: '/images/products/perfume-3.jpg',
    category: 'Perfumes',
  },
  {
    id: '8',
    name: 'Jo Malone Peony & Blush Suede',
    slug: 'jo-malone-peony-blush-suede',
    price: 2800,
    image: '/images/products/perfume-4.jpg',
    category: 'Perfumes',
  },
  {
    id: '9',
    name: 'YSL Libre Eau de Parfum',
    slug: 'ysl-libre-eau-de-parfum',
    price: 2450,
    image: '/images/products/perfume-5.jpg',
    category: 'Perfumes',
  },
];

const reviews = [
  {
    id: '1',
    author: 'Thandi M.',
    rating: 5,
    date: '2024-01-15',
    title: 'Absolutely divine!',
    content: 'This perfume is everything I hoped for and more. The scent lasts all day and I constantly receive compliments. Worth every cent.',
    verified: true,
  },
  {
    id: '2',
    author: 'Sarah K.',
    rating: 5,
    date: '2024-01-10',
    title: 'Classic and timeless',
    content: 'Chanel No. 5 never disappoints. The quality is exceptional and the packaging from Kholo & May was beautiful.',
    verified: true,
  },
  {
    id: '3',
    author: 'Michelle P.',
    rating: 4,
    date: '2024-01-05',
    title: 'Beautiful fragrance',
    content: 'Love the scent, though I wish it lasted a bit longer on my skin. Still a stunning perfume.',
    verified: true,
  },
];

// ===========================================
// Product Page Component
// ===========================================

export default function ProductPage() {
  const params = useParams();
  const { addItem } = useCart();

  // State
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const product = mockProduct; // In real app, fetch by slug
  const discount = product.comparePrice
    ? calculateDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await addItem(product as any, quantity);
    setIsAddingToCart(false);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-luxury-cream py-4">
        <div className="container-luxury">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-luxury-gray hover:text-luxury-black">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-luxury-gray" />
            <Link href="/shop" className="text-luxury-gray hover:text-luxury-black">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-luxury-gray" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-luxury-gray hover:text-luxury-black"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-luxury-gray" />
            <span className="text-luxury-black">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="container-luxury py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-luxury-cream overflow-hidden">
              <Image
                src={product.images[selectedImage].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="badge bg-luxury-black text-white px-3 py-1">New</span>
                )}
                {discount > 0 && (
                  <span className="badge bg-red-500 text-white px-3 py-1">-{discount}%</span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative w-20 h-20 flex-shrink-0 bg-luxury-cream overflow-hidden border-2 transition-colors',
                    selectedImage === index ? 'border-luxury-black' : 'border-transparent'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pl-4">
            {/* Brand */}
            <Link
              href={`/shop?brand=${product.brand}`}
              className="text-sm text-luxury-gray hover:text-luxury-black uppercase tracking-wider"
            >
              {product.brand}
            </Link>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl mt-2 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-4 h-4',
                      star <= 5 ? 'fill-gold-400 text-gold-400' : 'text-luxury-lightGray'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-luxury-gray">({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-lg text-luxury-gray line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-luxury-gray mb-6">{product.shortDescription}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stockStatus === 'IN_STOCK' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">In Stock ({product.stockQuantity} available)</span>
                </div>
              ) : (
                <span className="text-sm text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-luxury-lightGray">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-luxury-cream disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stockQuantity}
                  className="p-3 hover:bg-luxury-cream disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stockStatus !== 'IN_STOCK'}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {showAddedMessage ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : isAddingToCart ? (
                  'Adding...'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                className="p-3 border border-luxury-lightGray hover:border-luxury-black transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-luxury-gray">Share:</span>
              <button className="p-2 hover:bg-luxury-cream rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b border-luxury-lightGray">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-luxury-gray" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-luxury-gray">Orders over R500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-luxury-gray" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-luxury-gray">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-luxury-gray" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-luxury-gray">30 Day Policy</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <span className="text-luxury-gray">SKU:</span> {product.sku}
              </p>
              <p>
                <span className="text-luxury-gray">Category:</span>{' '}
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="hover:text-primary-600"
                >
                  {product.category.name}
                </Link>
              </p>
              {product.weight && (
                <p>
                  <span className="text-luxury-gray">Weight:</span> {product.weight}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container-luxury py-8 border-t border-luxury-lightGray">
        {/* Tab Headers */}
        <div className="flex gap-8 border-b border-luxury-lightGray mb-8">
          <button
            onClick={() => setActiveTab('description')}
            className={cn(
              'pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 -mb-px',
              activeTab === 'description'
                ? 'border-luxury-black text-luxury-black'
                : 'border-transparent text-luxury-gray hover:text-luxury-black'
            )}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={cn(
              'pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 -mb-px',
              activeTab === 'reviews'
                ? 'border-luxury-black text-luxury-black'
                : 'border-transparent text-luxury-gray hover:text-luxury-black'
            )}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' ? (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : (
          <div className="space-y-8">
            {/* Reviews List */}
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-luxury-lightGray pb-8 last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.author}</span>
                      {review.verified && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'w-3 h-3',
                              star <= review.rating
                                ? 'fill-gold-400 text-gold-400'
                                : 'text-luxury-lightGray'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-luxury-gray">{review.date}</span>
                    </div>
                  </div>
                </div>
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-luxury-gray">{review.content}</p>
              </div>
            ))}

            {/* Write Review Button */}
            <button className="btn-secondary">Write a Review</button>
          </div>
        )}
      </section>

      {/* Related Products */}
      <section className="section bg-luxury-cream">
        <div className="container-luxury">
          <h2 className="heading-2 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
