import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const isFeatured = searchParams.get('featured') === 'true';
    const isNewArrival = searchParams.get('new') === 'true';
    const isBestSeller = searchParams.get('bestseller') === 'true';

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (isFeatured) where.isFeatured = true;
    if (isNewArrival) where.isNewArrival = true;
    if (isBestSeller) where.isBestSeller = true;

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'bestselling':
        orderBy = { isBestSeller: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        sku: body.sku,
        name: body.name,
        slug: body.slug,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price,
        comparePrice: body.comparePrice,
        costPrice: body.costPrice,
        stockQuantity: body.stockQuantity,
        stockStatus: body.stockStatus || 'IN_STOCK',
        weight: body.weight,
        dimensions: body.dimensions,
        categoryId: body.categoryId,
        brand: body.brand,
        tags: body.tags,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        isNewArrival: body.isNewArrival ?? false,
        isBestSeller: body.isBestSeller ?? false,
        metadata: body.metadata,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
