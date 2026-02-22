'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn, formatPrice, formatDate } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
} from 'lucide-react';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'KMB-ABC123-XYZ',
    customer: {
      name: 'Thandi Mokoena',
      email: 'thandi@email.com',
    },
    total: 2850,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'payfast',
    items: 2,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'KMB-DEF456-ABC',
    customer: {
      name: 'David Nkosi',
      email: 'david@email.com',
    },
    total: 1650,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'payflex',
    items: 1,
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    orderNumber: 'KMB-GHI789-DEF',
    customer: {
      name: 'Sarah van der Berg',
      email: 'sarah@email.com',
    },
    total: 4500,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'payjustnow',
    items: 3,
    createdAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '4',
    orderNumber: 'KMB-JKL012-GHI',
    customer: {
      name: 'Michael Johnson',
      email: 'michael@email.com',
    },
    total: 980,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'payfast',
    items: 1,
    createdAt: '2024-01-13T16:45:00Z',
  },
  {
    id: '5',
    orderNumber: 'KMB-MNO345-JKL',
    customer: {
      name: 'Nomsa Dlamini',
      email: 'nomsa@email.com',
    },
    total: 3200,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    paymentMethod: 'payfast',
    items: 2,
    createdAt: '2024-01-12T11:00:00Z',
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const exportOrders = () => {
    // In production, this would generate a CSV/Excel file
    console.log('Exporting orders...', filteredOrders);
    alert('Orders exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2">Orders</h1>
          <p className="text-luxury-gray">Manage and track customer orders</p>
        </div>
        <button onClick={exportOrders} className="btn-secondary inline-flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow-luxury">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full md:w-48"
            title="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="input w-full md:w-48"
            title="Filter by payment status"
          >
            <option value="all">All Payments</option>
            <option value="PENDING">Payment Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-luxury-lightGray bg-luxury-cream">
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Order
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Customer
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Payment
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Total
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Date
                </th>
                <th className="text-right text-xs uppercase tracking-wider text-luxury-gray font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-luxury-lightGray/50 hover:bg-luxury-cream/30">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium hover:text-primary-600"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-sm text-luxury-gray">{order.items} items</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-luxury-gray">{order.customer.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded',
                        statusColors[order.status]
                      )}
                    >
                      {order.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {order.status === 'PROCESSING' && <Truck className="w-3 h-3" />}
                      {order.status === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded',
                        paymentStatusColors[order.paymentStatus]
                      )}
                    >
                      {order.paymentStatus}
                    </span>
                    <p className="text-xs text-luxury-gray mt-1 capitalize">
                      {order.paymentMethod}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 text-sm text-luxury-gray">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 hover:bg-luxury-cream rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-luxury-gray mb-4">No orders found</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 shadow-luxury text-center">
          <p className="text-2xl font-serif">{mockOrders.length}</p>
          <p className="text-sm text-luxury-gray">Total Orders</p>
        </div>
        <div className="bg-white p-4 shadow-luxury text-center">
          <p className="text-2xl font-serif text-yellow-600">
            {mockOrders.filter((o) => o.status === 'PENDING').length}
          </p>
          <p className="text-sm text-luxury-gray">Pending</p>
        </div>
        <div className="bg-white p-4 shadow-luxury text-center">
          <p className="text-2xl font-serif text-blue-600">
            {mockOrders.filter((o) => o.status === 'PROCESSING').length}
          </p>
          <p className="text-sm text-luxury-gray">Processing</p>
        </div>
        <div className="bg-white p-4 shadow-luxury text-center">
          <p className="text-2xl font-serif text-purple-600">
            {mockOrders.filter((o) => o.status === 'SHIPPED').length}
          </p>
          <p className="text-sm text-luxury-gray">Shipped</p>
        </div>
        <div className="bg-white p-4 shadow-luxury text-center">
          <p className="text-2xl font-serif text-green-600">
            {mockOrders.filter((o) => o.status === 'DELIVERED').length}
          </p>
          <p className="text-sm text-luxury-gray">Delivered</p>
        </div>
      </div>
    </div>
  );
}
