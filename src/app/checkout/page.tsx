'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPrice, SA_PROVINCES } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Lock, CreditCard, Truck, Check } from 'lucide-react';

// ===========================================
// Checkout Page Component
// ===========================================

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<'information' | 'shipping' | 'payment'>('information');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    saveInfo: !isAuthenticated,
    differentBilling: false,
    billingFirstName: '',
    billingLastName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingProvince: '',
    billingPostalCode: '',
    paymentMethod: 'payfast',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    couponCode: '',
    customerNotes: '',
  });

  // Shipping cost calculation
  const shippingCost = subtotal >= 500 ? 0 : 99;
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shippingCost + tax;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'information') {
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('payment');
    } else {
      // Process payment
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      await clearCart();
      setOrderComplete(true);
      setIsProcessing(false);
    }
  };

  // If cart is empty and order not complete, redirect to cart
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-2 mb-4">Your cart is empty</h1>
          <p className="text-luxury-gray mb-6">Add some items to your cart to checkout.</p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Order complete screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="heading-2 mb-2">Thank you for your order!</h1>
          <p className="text-luxury-gray mb-6">
            We've sent a confirmation email to {formData.email}. Your order number is{' '}
            <span className="font-medium">KMB-{Date.now().toString(36).toUpperCase()}</span>
          </p>
          <p className="text-sm text-luxury-gray mb-6">
            You will receive another email when your order has been shipped.
          </p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Header */}
      <header className="bg-white border-b border-luxury-lightGray">
        <div className="container-luxury py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-2xl">
              Kholo & May
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-luxury-gray hover:text-luxury-black"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to cart
            </Link>
          </div>
        </div>
      </header>

      <div className="container-luxury py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              {['information', 'shipping', 'payment'].map((s, i) => (
                <React.Fragment key={s}>
                  <button
                    onClick={() => {
                      const steps = ['information', 'shipping', 'payment'];
                      const currentIndex = steps.indexOf(step);
                      const targetIndex = steps.indexOf(s);
                      if (targetIndex < currentIndex) {
                        setStep(s as typeof step);
                      }
                    }}
                    className={cn(
                      'text-sm uppercase tracking-wider',
                      step === s ? 'text-luxury-black font-medium' : 'text-luxury-gray'
                    )}
                    disabled={['shipping', 'payment'].indexOf(s) > ['information', 'shipping', 'payment'].indexOf(step)}
                  >
                    {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                  {i < 2 && <span className="text-luxury-lightGray">→</span>}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Information Step */}
              {step === 'information' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="heading-3 mb-4">Contact Information</h2>
                    {!isAuthenticated && (
                      <p className="text-sm text-luxury-gray mb-4">
                        Already have an account?{' '}
                        <Link href="/login?redirect=/checkout" className="text-primary-600 hover:underline">
                          Log in
                        </Link>
                      </p>
                    )}
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <h2 className="heading-3 mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="input"
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="input"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="input"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        placeholder="Address"
                        className="input"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder="Apartment, suite, etc. (optional)"
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="input"
                        required
                      />
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="input"
                        required
                        title="Select province"
                      >
                        <option value="">Select Province</option>
                        {SA_PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal code"
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Save this information for next time</span>
                  </label>

                  <button type="submit" className="btn-primary w-full">
                    Continue to Shipping
                  </button>
                </div>
              )}

              {/* Shipping Step */}
              {step === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="heading-3 mb-4">Shipping Method</h2>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 border border-luxury-lightGray cursor-pointer hover:border-luxury-black">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            defaultChecked
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">Standard Shipping</p>
                            <p className="text-sm text-luxury-gray">5-7 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">
                          {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                        </span>
                      </label>
                      <label className="flex items-center justify-between p-4 border border-luxury-lightGray cursor-pointer hover:border-luxury-black">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">Express Shipping</p>
                            <p className="text-sm text-luxury-gray">2-3 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">R199</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('information')}
                      className="btn-outline flex-1"
                    >
                      Return to Information
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="heading-3 mb-4">Payment Method</h2>
                    <div className="space-y-3">
                      {/* PayFast */}
                      <label className="flex items-center justify-between p-4 border border-luxury-lightGray cursor-pointer hover:border-luxury-black">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="payfast"
                            checked={formData.paymentMethod === 'payfast'}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">PayFast</p>
                            <p className="text-sm text-luxury-gray">Visa, Mastercard, Instant EFT</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <span className="px-2 py-0.5 bg-luxury-cream text-xs">VISA</span>
                          <span className="px-2 py-0.5 bg-luxury-cream text-xs">MC</span>
                        </div>
                      </label>

                      {/* Payflex */}
                      <label className="flex items-center justify-between p-4 border border-luxury-lightGray cursor-pointer hover:border-luxury-black">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="payflex"
                            checked={formData.paymentMethod === 'payflex'}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">Payflex</p>
                            <p className="text-sm text-luxury-gray">Pay in 4 interest-free installments</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-luxury-cream text-xs">Payflex</span>
                      </label>

                      {/* PayJustNow */}
                      <label className="flex items-center justify-between p-4 border border-luxury-lightGray cursor-pointer hover:border-luxury-black">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="payjustnow"
                            checked={formData.paymentMethod === 'payjustnow'}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">PayJustNow</p>
                            <p className="text-sm text-luxury-gray">Buy now, pay later</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-luxury-cream text-xs">PayJustNow</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                    <textarea
                      name="customerNotes"
                      value={formData.customerNotes}
                      onChange={handleChange}
                      placeholder="Special instructions for your order..."
                      className="input h-24 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-luxury-gray">
                    <Lock className="w-4 h-4" />
                    Your payment information is encrypted and secure
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="btn-outline flex-1"
                    >
                      Return to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay {formatPrice(total)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:pl-8">
            <div className="bg-white p-6 sticky top-24">
              <h2 className="heading-3 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-luxury-cream flex-shrink-0">
                      {item.product.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Truck className="w-6 h-6 text-luxury-lightGray" />
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-luxury-black text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-luxury-gray">{formatPrice(item.product.price)}</p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  placeholder="Coupon code"
                  className="input flex-1"
                />
                <button type="button" className="btn-outline">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-2 py-4 border-t border-luxury-lightGray">
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-gray">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-gray">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-gray">VAT (15%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-luxury-lightGray">
                <span className="font-medium">Total</span>
                <span className="font-serif text-2xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
