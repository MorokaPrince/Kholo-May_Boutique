'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error } = useAuth();
  
  const redirect = searchParams.get('redirect') || '/account';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      router.push(redirect);
    } catch (err) {
      setFormError('Invalid email or password');
    }
  };

  return (
    <div className="bg-white p-8 shadow-luxury">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {(error || formError) && (
          <div className="bg-red-50 text-red-600 p-4 text-sm">
            {formError || error}
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input pl-10"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-luxury-black"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-luxury-gray hover:text-luxury-black"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-luxury-lightGray" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-luxury-gray">New to Kholo & May?</span>
        </div>
      </div>

      {/* Register Link */}
      <Link
        href="/register"
        className="btn-secondary w-full text-center block"
      >
        Create an Account
      </Link>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="bg-white p-8 shadow-luxury animate-pulse">
      <div className="space-y-6">
        <div className="h-12 bg-luxury-cream rounded" />
        <div className="h-12 bg-luxury-cream rounded" />
        <div className="h-12 bg-luxury-cream rounded" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-display text-3xl mb-6">
            Kholo & May
          </Link>
          <h1 className="heading-2 mb-2">Welcome Back</h1>
          <p className="text-luxury-gray">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form with Suspense */}
        <Suspense fallback={<LoginLoading />}>
          <LoginForm />
        </Suspense>

        {/* Guest Checkout */}
        <div className="text-center mt-6">
          <Link
            href="/shop"
            className="text-sm text-luxury-gray hover:text-luxury-black"
          >
            Continue as Guest →
          </Link>
        </div>
      </div>
    </div>
  );
}
