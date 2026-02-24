import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create main categories
  const perfumesCategory = await prisma.category.upsert({
    where: { slug: 'perfumes' },
    update: {},
    create: {
      name: 'Perfumes',
      slug: 'perfumes',
      description: 'Luxury fragrances from world-renowned brands',
      image: '/images/categories/perfumes.svg',
      sortOrder: 1,
    },
  });

  const foreverLivingCategory = await prisma.category.upsert({
    where: { slug: 'forever-living' },
    update: {},
    create: {
      name: 'Forever Living',
      slug: 'forever-living',
      description: 'Natural aloe vera wellness products',
      image: '/images/categories/forever-living.svg',
      sortOrder: 2,
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Exclusive fashion from our own brand',
      image: '/images/categories/clothing.svg',
      sortOrder: 3,
    },
  });

  // Create subcategories for Perfumes
  const arabicScentsCategory = await prisma.category.upsert({
    where: { slug: 'arabic-scents' },
    update: {},
    create: {
      name: 'Arabic Scents',
      slug: 'arabic-scents',
      description: 'Exotic Arabian fragrances - rich, long-lasting oud and musk-based perfumes',
      parentId: perfumesCategory.id,
      sortOrder: 1,
    },
  });

  const africanPerfumeCoCategory = await prisma.category.upsert({
    where: { slug: 'african-perfume-co' },
    update: {},
    create: {
      name: 'The African Perfume Co.',
      slug: 'african-perfume-co',
      description: 'Proudly South African fragrances inspired by African botanicals',
      parentId: perfumesCategory.id,
      sortOrder: 2,
    },
  });

  console.log('Categories created');

  // Arabic Scents Products
  const arabicScentsProducts = [
    {
      sku: 'AS-001',
      name: 'Oud Al Mubakhar',
      slug: 'oud-al-mubakhar',
      description: 'A rich, woody oud fragrance with deep amber notes. Long-lasting and captivating.',
      shortDescription: 'Rich woody oud with amber notes',
      price: 850.00,
      comparePrice: 950.00,
      stockQuantity: 15,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
      isNew: true,
      isBestSeller: true,
    },
    {
      sku: 'AS-002',
      name: 'Musk Al Arab',
      slug: 'musk-al-arab',
      description: 'Traditional Arabian musk fragrance. Clean, sensual, and incredibly long-lasting.',
      shortDescription: 'Traditional Arabian musk',
      price: 650.00,
      stockQuantity: 20,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
      isBestSeller: true,
    },
    {
      sku: 'AS-003',
      name: 'Bakhoor Al Noor',
      slug: 'bakhoor-al-noor',
      description: 'Luxurious bakhoor blend with rose, saffron, and oud. Perfect for special occasions.',
      shortDescription: 'Rose, saffron & oud blend',
      price: 750.00,
      stockQuantity: 12,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
      isNew: true,
    },
    {
      sku: 'AS-004',
      name: 'Amir Al Oud',
      slug: 'amir-al-oud',
      description: 'The Prince of Oud - a majestic fragrance with royal proportions. Deep, complex, and commanding.',
      shortDescription: 'Majestic royal oud fragrance',
      price: 1200.00,
      comparePrice: 1400.00,
      stockQuantity: 8,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
      isBestSeller: true,
    },
    {
      sku: 'AS-005',
      name: 'Rose Al Haramain',
      slug: 'rose-al-haramain',
      description: 'Beautiful rose fragrance with Middle Eastern flair. Delicate yet long-lasting.',
      shortDescription: 'Middle Eastern rose fragrance',
      price: 780.00,
      stockQuantity: 18,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
    },
    {
      sku: 'AS-006',
      name: 'Sandalwood Al Safa',
      slug: 'sandalwood-al-safa',
      description: 'Pure sandalwood fragrance with creamy, woody notes. Calming and sophisticated.',
      shortDescription: 'Pure creamy sandalwood',
      price: 680.00,
      stockQuantity: 14,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
    },
    {
      sku: 'AS-007',
      name: 'Dehn Al Oud',
      slug: 'dehn-al-oud',
      description: 'Pure oud oil - the essence of luxury. Highly concentrated and extremely long-lasting.',
      shortDescription: 'Pure oud oil essence',
      price: 1800.00,
      stockQuantity: 5,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
      isNew: true,
    },
    {
      sku: 'AS-008',
      name: 'Attar Al Nabeel',
      slug: 'attar-al-nabeel',
      description: 'Traditional attar with floral and woody notes. Alcohol-free natural perfume oil.',
      shortDescription: 'Traditional alcohol-free attar',
      price: 550.00,
      stockQuantity: 25,
      categoryId: arabicScentsCategory.id,
      brand: 'Arabic Scents',
    },
  ];

  // African Perfume Co Products
  const africanPerfumeCoProducts = [
    {
      sku: 'APC-001',
      name: 'Savannah Sunset',
      slug: 'savannah-sunset',
      description: 'Warm, golden fragrance inspired by African sunsets. Notes of amber, vanilla, and wild grass.',
      shortDescription: 'Warm amber & vanilla sunset',
      price: 650.00,
      stockQuantity: 20,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
      isNew: true,
      isBestSeller: true,
    },
    {
      sku: 'APC-002',
      name: 'Cape Floral',
      slug: 'cape-floral',
      description: 'Fresh floral bouquet inspired by the Cape Floral Kingdom. Protea, fynbos, and citrus notes.',
      shortDescription: 'Fresh Cape floral bouquet',
      price: 580.00,
      stockQuantity: 15,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
      isBestSeller: true,
    },
    {
      sku: 'APC-003',
      name: 'Baobab Bliss',
      slug: 'baobab-bliss',
      description: 'Earthy, woody fragrance inspired by the majestic baobab tree. Grounding and unique.',
      shortDescription: 'Earthy baobab-inspired scent',
      price: 620.00,
      stockQuantity: 12,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
    },
    {
      sku: 'APC-004',
      name: 'Zulu Warrior',
      slug: 'zulu-warrior',
      description: 'Bold, powerful fragrance for the modern warrior. Spicy, woody, and commanding.',
      shortDescription: 'Bold spicy warrior scent',
      price: 720.00,
      comparePrice: 850.00,
      stockQuantity: 18,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
      isNew: true,
    },
    {
      sku: 'APC-005',
      name: 'Madikwe Musk',
      slug: 'madikwe-musk',
      description: 'Sensual musk inspired by the African bushveld. Warm, animalic, and deeply attractive.',
      shortDescription: 'Sensual bushveld musk',
      price: 680.00,
      stockQuantity: 14,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
    },
    {
      sku: 'APC-006',
      name: 'Table Mountain Mist',
      slug: 'table-mountain-mist',
      description: 'Cool, fresh fragrance capturing the essence of Table Mountain. Crisp, clean, and invigorating.',
      shortDescription: 'Cool fresh mountain mist',
      price: 590.00,
      stockQuantity: 16,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
    },
    {
      sku: 'APC-007',
      name: 'Marula Gold',
      slug: 'marula-gold',
      description: 'Sweet, fruity fragrance inspired by the African marula fruit. Delicious and uplifting.',
      shortDescription: 'Sweet marula fruit scent',
      price: 640.00,
      stockQuantity: 10,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
      isNew: true,
    },
    {
      sku: 'APC-008',
      name: 'Serengeti Soul',
      slug: 'serengeti-soul',
      description: 'Wild, untamed fragrance capturing the spirit of the Serengeti. Grass, earth, and freedom.',
      shortDescription: 'Wild Serengeti spirit',
      price: 750.00,
      stockQuantity: 8,
      categoryId: africanPerfumeCoCategory.id,
      brand: 'The African Perfume Co.',
    },
  ];

  // Forever Living Products
  const foreverLivingProducts = [
    {
      sku: 'FL-001',
      name: 'Aloe Vera Gel',
      slug: 'aloe-vera-gel',
      description: 'Pure inner leaf aloe vera gel. Supports healthy digestion and natural energy.',
      shortDescription: 'Pure inner leaf aloe gel',
      price: 380.00,
      stockQuantity: 50,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
      isBestSeller: true,
    },
    {
      sku: 'FL-002',
      name: 'Aloe Berry Nectar',
      slug: 'aloe-berry-nectar',
      description: 'Aloe vera with cranberry and apple. Great taste with all the benefits of aloe.',
      shortDescription: 'Aloe with cranberry & apple',
      price: 420.00,
      stockQuantity: 35,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
    },
    {
      sku: 'FL-003',
      name: 'Forever Bee Pollen',
      slug: 'forever-bee-pollen',
      description: 'Natural bee pollen supplement. Rich in vitamins, minerals, and energy.',
      shortDescription: 'Natural energy supplement',
      price: 380.00,
      stockQuantity: 40,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
      isNew: true,
    },
    {
      sku: 'FL-004',
      name: 'Aloe Vera Gelly',
      slug: 'aloe-vera-gelly',
      description: 'Pure aloe vera for topical use. Soothes, moisturizes, and heals skin.',
      shortDescription: 'Topical aloe for skin care',
      price: 320.00,
      stockQuantity: 45,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
      isBestSeller: true,
    },
    {
      sku: 'FL-005',
      name: 'Forever Propolis Cream',
      slug: 'forever-propolis-cream',
      description: 'Propolis and aloe cream for skin care. Natural antibiotic properties.',
      shortDescription: 'Propolis skin cream',
      price: 350.00,
      stockQuantity: 30,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
    },
    {
      sku: 'FL-006',
      name: 'Aloe Moisturizing Lotion',
      slug: 'aloe-moisturizing-lotion',
      description: 'Rich moisturizing lotion with aloe. Perfect for daily skin care.',
      shortDescription: 'Daily aloe moisturizer',
      price: 380.00,
      stockQuantity: 38,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
    },
    {
      sku: 'FL-007',
      name: 'Forever Bright Toothgel',
      slug: 'forever-bright-toothgel',
      description: 'Aloe-based toothgel for healthy teeth and gums. Fluoride-free.',
      shortDescription: 'Aloe fluoride-free toothgel',
      price: 180.00,
      stockQuantity: 60,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
    },
    {
      sku: 'FL-008',
      name: 'Aloe Heat Lotion',
      slug: 'aloe-heat-lotion',
      description: 'Soothing heat lotion with aloe. Perfect for tired muscles and joints.',
      shortDescription: 'Soothing heat relief lotion',
      price: 340.00,
      stockQuantity: 25,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
    },
    {
      sku: 'FL-009',
      name: 'Forever Multi-Maca',
      slug: 'forever-multi-maca',
      description: 'Maca root supplement for energy and vitality. Natural performance enhancer.',
      shortDescription: 'Maca energy supplement',
      price: 450.00,
      stockQuantity: 28,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
      isNew: true,
    },
    {
      sku: 'FL-010',
      name: 'Aloe Sunscreen',
      slug: 'aloe-sunscreen',
      description: 'Aloe-based sunscreen SPF 30. Protects while moisturizing skin.',
      shortDescription: 'Aloe SPF 30 sunscreen',
      price: 280.00,
      stockQuantity: 42,
      categoryId: foreverLivingCategory.id,
      brand: 'Forever Living',
    },
  ];

  // Insert products
  const allProducts = [
    ...arabicScentsProducts,
    ...africanPerfumeCoProducts,
    ...foreverLivingProducts,
  ];

  for (const product of allProducts) {
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });

    // Create product images based on category
    let imageFolder = '';
    if (product.categoryId === arabicScentsCategory.id) {
      imageFolder = 'arabic-scents';
    } else if (product.categoryId === africanPerfumeCoCategory.id) {
      imageFolder = 'african-perfume-co';
    } else if (product.categoryId === foreverLivingCategory.id) {
      imageFolder = 'forever-living';
    }

    // Create placeholder image reference
    await prisma.productImage.upsert({
      where: {
        id: `${created.id}-img`,
      },
      update: {
        url: `/images/products/${imageFolder}/${product.sku.toLowerCase()}.jpg`,
        altText: product.name,
        isPrimary: true,
      },
      create: {
        id: `${created.id}-img`,
        productId: created.id,
        url: `/images/products/${imageFolder}/${product.sku.toLowerCase()}.jpg`,
        altText: product.name,
        isPrimary: true,
      },
    });
  }

  console.log(`Created ${allProducts.length} products`);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kholomayboutique.co.za' },
    update: {},
    create: {
      email: 'admin@kholomayboutique.co.za',
      password: '$2a$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // admin123
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', adminUser.email);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
