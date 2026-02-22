import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

// GET /api/orders - Get orders (Admin gets all, User gets their own)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // In a real app, decode JWT and get user
    // For now, we'll check for admin role via header
    const isAdmin = request.headers.get('x-user-role') === 'ADMIN';
    const userId = request.headers.get('x-user-id');

    const where: any = {};
    
    if (!isAdmin && userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      data: orders,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Calculate totals
    let subtotal = 0;
    const items = body.items || [];

    // Verify products and calculate subtotal
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      subtotal += Number(product.price) * item.quantity;
    }

    const shippingCost = subtotal >= 500 ? 0 : 99;
    const tax = subtotal * 0.15;
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: body.userId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: body.paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingFirstName: body.shippingFirstName,
        shippingLastName: body.shippingLastName,
        shippingPhone: body.shippingPhone,
        shippingAddress1: body.shippingAddress1,
        shippingAddress2: body.shippingAddress2,
        shippingCity: body.shippingCity,
        shippingProvince: body.shippingProvince,
        shippingPostalCode: body.shippingPostalCode,
        shippingCountry: body.shippingCountry || 'South Africa',
        billingFirstName: body.billingFirstName,
        billingLastName: body.billingLastName,
        billingPhone: body.billingPhone,
        billingAddress1: body.billingAddress1,
        billingAddress2: body.billingAddress2,
        billingCity: body.billingCity,
        billingProvince: body.billingProvince,
        billingPostalCode: body.billingPostalCode,
        billingCountry: body.billingCountry,
        customerNotes: body.customerNotes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            productImage: item.productImage,
          })),
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            comment: 'Order placed',
          },
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
