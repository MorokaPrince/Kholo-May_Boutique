'use client';

import React from 'react';
import Link from 'next/link';
import { cn, formatPrice, formatDate } from '@/lib/utils';
import {
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

// ===========================================
// Mock Dashboard Data
// ===========================================

const stats = [
  {
    name: 'Total Revenue',
    value: 'R 125,450',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingBag,
  },
  {
    name: 'Products',
    value: '89',
    change: '+3',
    trend: 'up',
    icon: Package,
  },
  {
    name: 'Customers',
    value: '1,245',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
  },
];

const recentOrders = [
  {
    id: '1',
    orderNumber: 'KMB-ABC123-XYZ',
    customer: 'Thandi Mokoena',
    email: 'thandi@email.com',
    total: 2850,
    status: 'PROCESSING',
    date: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: 'KMB-DEF456-ABC',
    customer: 'David Nkosi',
    email: 'david@email.com',
    total: 1650,
    status: 'SHIPPED',
    date: '2024-01-14',
  },
  {
    id: '3',
    orderNumber: 'KMB-GHI789-DEF',
    customer: 'Sarah van der Berg',
    email: 'sarah@email.com',
    total: 4500,
    status: 'PENDING',
    date: '2024-01-14',
  },
  {
    id: '4',
    orderNumber: 'KMB-JKL012-GHI',
    customer: 'Michael Johnson',
    email: 'michael@email.com',
    total: 980,
    status: 'DELIVERED',
    date: '2024-01-13',
  },
  {
    id: '5',
    orderNumber: 'KMB-MNO345-JKL',
    customer: 'Nomsa Dlamini',
    email: 'nomsa@email.com',
    total: 3200,
    status: 'PROCESSING',
    date: '2024-01-13',
  },
];

const lowStockProducts = [
  {
    id: '1',
    name: 'Chanel No. 5 Eau de Parfum',
    sku: 'CHN-N5-EDP-100',
    stock: 3,
    status: 'LOW_STOCK',
  },
  {
    id: '2',
    name: 'Forever Living Aloe Vera Gel',
    sku: 'FL-AVG-001',
    stock: 0,
    status: 'OUT_OF_STOCK',
  },
  {
    id: '3',
    name: 'Silk Evening Dress - Size M',
    sku: 'KMB-SED-M-001',
    stock: 2,
    status: 'LOW_STOCK',
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// ===========================================
// Admin Dashboard Page
// ===========================================

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="heading-2">Dashboard</h1>
        <p className="text-luxury-gray">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 shadow-luxury">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-luxury-cream rounded-lg">
                <stat.icon className="w-6 h-6 text-luxury-gray" />
              </div>
              <span
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-serif">{stat.value}</p>
            <p className="text-sm text-luxury-gray">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white shadow-luxury">
          <div className="flex items-center justify-between p-6 border-b border-luxury-lightGray">
            <h2 className="font-serif text-xl">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm text-luxury-gray hover:text-luxury-black"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-luxury-lightGray">
                  <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-luxury-lightGray/50 hover:bg-luxury-cream/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:text-primary-600"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-luxury-gray">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded', statusColors[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-sm text-luxury-gray">{formatDate(order.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white shadow-luxury">
          <div className="flex items-center justify-between p-6 border-b border-luxury-lightGray">
            <h2 className="font-serif text-xl">Low Stock Alert</h2>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="p-6 space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-luxury-lightGray/50 last:border-0">
                <div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium hover:text-primary-600 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-luxury-gray">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'font-medium',
                      product.status === 'OUT_OF_STOCK' ? 'text-red-600' : 'text-yellow-600'
                    )}
                  >
                    {product.stock} units
                  </p>
                  <p className="text-xs text-luxury-gray">
                    {product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock'}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/admin/products?filter=low_stock"
              className="block text-center text-sm text-luxury-gray hover:text-luxury-black py-2"
            >
              View all low stock products
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 shadow-luxury">
        <h2 className="font-serif text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center gap-2 p-4 bg-luxury-cream hover:bg-luxury-lightGray transition-colors rounded-lg"
          >
            <Package className="w-8 h-8 text-luxury-gray" />
            <span className="text-sm font-medium">Add Product</span>
          </Link>
          <Link
            href="/admin/orders?status=PENDING"
            className="flex flex-col items-center gap-2 p-4 bg-luxury-cream hover:bg-luxury-lightGray transition-colors rounded-lg"
          >
            <ShoppingBag className="w-8 h-8 text-luxury-gray" />
            <span className="text-sm font-medium">Pending Orders</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex flex-col items-center gap-2 p-4 bg-luxury-cream hover:bg-luxury-lightGray transition-colors rounded-lg"
          >
            <Users className="w-8 h-8 text-luxury-gray" />
            <span className="text-sm font-medium">Categories</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center gap-2 p-4 bg-luxury-cream hover:bg-luxury-lightGray transition-colors rounded-lg"
          >
            <DollarSign className="w-8 h-8 text-luxury-gray" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
