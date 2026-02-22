'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

// ===========================================
// Cart Drawer Component
// ===========================================

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => toggleCart(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-luxury-lightGray">
          <h2 className="font-serif text-xl">
            Shopping Bag ({itemCount})
          </h2>
          <button
            onClick={() => toggleCart(false)}
            className="p-2 hover:bg-luxury-cream rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-180px)] p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-luxury-lightGray mb-4" />
            <h3 className="font-serif text-xl mb-2">Your bag is empty</h3>
            <p className="text-luxury-gray mb-6">
              Looks like you haven't added anything to your bag yet.
            </p>
            <button
              onClick={() => toggleCart(false)}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-280px)]">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 pb-4 border-b border-luxury-lightGray last:border-0"
                >
                  {/* Image */}
                  <div className="relative w-24 h-32 bg-luxury-cream flex-shrink-0">
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-luxury-lightGray" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => toggleCart(false)}
                        className="font-medium hover:text-primary-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1 hover:bg-luxury-cream rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-luxury-gray mt-1">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center border border-luxury-lightGray">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-luxury-cream"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-luxury-cream"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-medium">
                        {formatPrice(Number(item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-luxury-lightGray">
              {/* Subtotal */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-luxury-gray">Subtotal</span>
                <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping Note */}
              <p className="text-xs text-luxury-gray text-center mb-4">
                Shipping and taxes calculated at checkout
              </p>

              {/* Buttons */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => toggleCart(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => toggleCart(false)}
                  className="btn-secondary w-full text-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
