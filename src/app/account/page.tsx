'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, User, MapPin, Heart, LogOut, ChevronRight } from 'lucide-react';

// Mock order data
const recentOrders = [
  {
    id: '1',
    orderNumber: 'KMB-ABC123-XYZ',
    date: '2024-01-15',
    status: 'DELIVERED',
    total: 2850,
    items: 2,
  },
  {
    id: '2',
    orderNumber: 'KMB-DEF456-ABC',
    date: '2024-01-10',
    status: 'SHIPPED',
    total: 1650,
    items: 1,
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AccountPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 shadow-luxury">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-luxury-lightGray">
                <div className="w-20 h-20 bg-luxury-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-luxury-gray" />
                </div>
                <h2 className="font-serif text-xl">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-luxury-gray">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center justify-between p-3 bg-luxury-cream text-luxury-black rounded-lg"
                >
                  <span className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    My Account
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center justify-between p-3 text-luxury-gray hover:bg-luxury-cream hover:text-luxury-black rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    Orders
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center justify-between p-3 text-luxury-gray hover:bg-luxury-cream hover:text-luxury-black rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    Addresses
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-3 text-luxury-gray hover:bg-luxury-cream hover:text-luxury-black rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 text-luxury-gray hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Welcome */}
            <div className="bg-white p-6 shadow-luxury">
              <h1 className="heading-2 mb-2">Welcome back, {user?.firstName}!</h1>
              <p className="text-luxury-gray">
                Manage your account, view orders, and update your preferences.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 shadow-luxury text-center">
                <p className="text-2xl font-serif">2</p>
                <p className="text-sm text-luxury-gray">Orders</p>
              </div>
              <div className="bg-white p-4 shadow-luxury text-center">
                <p className="text-2xl font-serif">1</p>
                <p className="text-sm text-luxury-gray">Wishlist</p>
              </div>
              <div className="bg-white p-4 shadow-luxury text-center">
                <p className="text-2xl font-serif">2</p>
                <p className="text-sm text-luxury-gray">Addresses</p>
              </div>
              <div className="bg-white p-4 shadow-luxury text-center">
                <p className="text-2xl font-serif">R125</p>
                <p className="text-sm text-luxury-gray">Rewards</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow-luxury">
              <div className="flex items-center justify-between p-6 border-b border-luxury-lightGray">
                <h2 className="font-serif text-xl">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-sm text-luxury-gray hover:text-luxury-black"
                >
                  View All
                </Link>
              </div>
              <div className="divide-y divide-luxury-lightGray">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between p-6 hover:bg-luxury-cream/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-luxury-gray">
                        {formatDate(order.date)} • {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white shadow-luxury">
              <div className="flex items-center justify-between p-6 border-b border-luxury-lightGray">
                <h2 className="font-serif text-xl">Account Details</h2>
                <Link
                  href="/account/edit"
                  className="text-sm text-luxury-gray hover:text-luxury-black"
                >
                  Edit
                </Link>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-luxury-gray">Full Name</p>
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-luxury-gray">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-luxury-gray">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
