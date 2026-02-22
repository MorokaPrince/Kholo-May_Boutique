'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';

// ===========================================
// Navigation Items
// ===========================================

const navigation = [
  { label: 'Home', href: '/' },
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'All Products', href: '/shop' },
      { label: 'Perfumes', href: '/shop?category=perfumes' },
      { label: 'Forever Living', href: '/shop?category=forever-living' },
      { label: 'Clothing', href: '/shop?category=clothing' },
    ],
  },
  { label: 'New Arrivals', href: '/shop?new=true' },
  { label: 'Best Sellers', href: '/shop?bestseller=true' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ===========================================
// Header Component
// ===========================================

export function Header() {
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-luxury-black text-white text-center py-2 text-xs tracking-wider">
        FREE SHIPPING ON ORDERS OVER R500 | USE CODE: LUXURY20 FOR 20% OFF
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-40 bg-white transition-all duration-300',
          isScrolled ? 'shadow-luxury' : 'border-b border-luxury-lightGray/50'
        )}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-display text-2xl md:text-3xl tracking-tight">
                Kholo & May
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      'text-sm tracking-wide uppercase transition-colors hover:text-luxury-black',
                      pathname === item.href
                        ? 'text-luxury-black font-medium'
                        : 'text-luxury-gray'
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="inline-block w-4 h-4 ml-1" />
                    )}
                  </Link>
                  {item.children && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white border border-luxury-lightGray shadow-luxury py-2 min-w-[180px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-luxury-cream rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:block p-2 hover:bg-luxury-cream rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 hover:bg-luxury-cream rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-luxury-lightGray shadow-luxury py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-luxury-lightGray">
                          <p className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-luxury-gray">{user?.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          Orders
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-sm text-luxury-gray hover:text-luxury-black hover:bg-luxury-cream"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => toggleCart(true)}
                className="relative p-2 hover:bg-luxury-cream rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-black text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-80 max-w-[calc(100vw-4rem)] bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-luxury-lightGray">
              <span className="font-display text-xl">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4">
              {navigation.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block py-3 text-lg border-b border-luxury-lightGray/50',
                      pathname === item.href ? 'font-medium' : ''
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-2 text-sm text-luxury-gray"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-luxury-lg">
            <div className="container-luxury">
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <Search className="w-6 h-6 text-luxury-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-lg border-none outline-none bg-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
