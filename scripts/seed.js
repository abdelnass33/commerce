// Script to seed database with sample data
// Run with: node --require dotenv/config scripts/seed.js

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sneaker-commerce';

const categoriesData = [
  { name: 'Sneakers', slug: 'sneakers', description: 'Latest sneaker releases' },
  { name: 'T-Shirts', slug: 't-shirts', description: 'Comfortable streetwear t-shirts' },
  { name: 'Hoodies', slug: 'hoodies', description: 'Stylish hoodies and sweatshirts' },
  { name: 'Pants', slug: 'pants', description: 'Trendy pants and joggers' },
  { name: 'Accessories', slug: 'accessories', description: 'Caps, bags and more' },
];

const productsData = [
  {
    name: 'Nike Air Max 90',
    slug: 'nike-air-max-90',
    description: 'Iconic Nike Air Max 90 with classic design and comfortable cushioning',
    price: 85000,
    compareAtPrice: 95000,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: ['Black', 'White', 'Red'],
    stock: 50,
    sku: 'NIKE-AM90-001',
    brand: 'Nike',
    tags: ['sneakers', 'nike', 'air-max'],
    featured: true,
    active: true,
  },
  {
    name: 'Adidas Yeezy Boost 350',
    slug: 'adidas-yeezy-boost-350',
    description: 'Premium Yeezy Boost 350 with Primeknit upper and Boost cushioning',
    price: 120000,
    compareAtPrice: 140000,
    images: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800'
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Beige', 'Black', 'White'],
    stock: 30,
    sku: 'ADIDAS-Y350-001',
    brand: 'Adidas',
    tags: ['sneakers', 'adidas', 'yeezy'],
    featured: true,
    active: true,
  },
  {
    name: 'Jordan 1 Retro High',
    slug: 'jordan-1-retro-high',
    description: 'Classic Air Jordan 1 High with premium leather construction',
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1612902376937-ad2e7563b8d3?w=800'
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Red/Black', 'Royal Blue', 'Chicago'],
    stock: 40,
    sku: 'JORDAN-1H-001',
    brand: 'Jordan',
    tags: ['sneakers', 'jordan', 'basketball'],
    featured: true,
    active: true,
  },
  {
    name: 'Supreme Box Logo Hoodie',
    slug: 'supreme-box-logo-hoodie',
    description: 'Iconic Supreme box logo hoodie in premium heavyweight cotton',
    price: 55000,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Red'],
    stock: 25,
    sku: 'SUPREME-HOODIE-001',
    brand: 'Supreme',
    tags: ['hoodie', 'supreme', 'streetwear'],
    featured: true,
    active: true,
  },
  {
    name: 'Off-White Graphic Tee',
    slug: 'off-white-graphic-tee',
    description: 'Off-White signature graphic t-shirt with bold prints',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    stock: 60,
    sku: 'OFFWHITE-TEE-001',
    brand: 'Off-White',
    tags: ['t-shirt', 'off-white', 'graphic'],
    featured: false,
    active: true,
  },
  {
    name: 'Nike Tech Fleece Joggers',
    slug: 'nike-tech-fleece-joggers',
    description: 'Nike Tech Fleece joggers with modern slim fit',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey', 'Navy'],
    stock: 35,
    sku: 'NIKE-JOGGER-001',
    brand: 'Nike',
    tags: ['pants', 'joggers', 'nike'],
    featured: false,
    active: true,
  },
];

const promotionsData = [
  {
    code: 'WELCOME10',
    description: '10% de réduction pour les nouveaux clients',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 30000,
    maxDiscount: 15000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    usageLimit: 1000,
    usageCount: 0,
    active: true,
  },
  {
    code: 'SUMMER2024',
    description: '15000 FCFA de réduction sur les commandes supérieures à 100000 FCFA',
    discountType: 'fixed',
    discountValue: 15000,
    minPurchase: 100000,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    usageLimit: 500,
    usageCount: 0,
    active: true,
  },
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Cleared database');

    // Define schemas
    const categorySchema = new mongoose.Schema({
      name: String,
      slug: String,
      description: String,
      image: String,
    }, { timestamps: true });

    const productSchema = new mongoose.Schema({
      name: String,
      slug: String,
      description: String,
      price: Number,
      compareAtPrice: Number,
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      images: [String],
      sizes: [String],
      colors: [String],
      stock: Number,
      sku: String,
      brand: String,
      tags: [String],
      featured: Boolean,
      active: Boolean,
    }, { timestamps: true });

    const promotionSchema = new mongoose.Schema({
      code: String,
      description: String,
      discountType: String,
      discountValue: Number,
      minPurchase: Number,
      maxDiscount: Number,
      startDate: Date,
      endDate: Date,
      usageLimit: Number,
      usageCount: Number,
      active: Boolean,
    }, { timestamps: true });

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      phone: String,
    }, { timestamps: true });

    const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} categories`);

    // Create products with category references
    const sneakersCategory = categories.find(c => c.slug === 'sneakers');
    const hoodiesCategory = categories.find(c => c.slug === 'hoodies');
    const tshirtsCategory = categories.find(c => c.slug === 't-shirts');
    const pantsCategory = categories.find(c => c.slug === 'pants');

    const productsWithCategories = productsData.map(product => {
      let category = sneakersCategory;
      
      if (product.name.includes('Hoodie')) {
        category = hoodiesCategory;
      } else if (product.name.includes('Tee') || product.name.includes('T-Shirt')) {
        category = tshirtsCategory;
      } else if (product.name.includes('Jogger') || product.name.includes('Pants')) {
        category = pantsCategory;
      }
      
      return {
        ...product,
        category: category._id,
      };
    });

    const products = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${products.length} products`);

    // Create promotions
    const promotions = await Promotion.insertMany(promotionsData);
    console.log(`✅ Created ${promotions.length} promotions`);

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@sneakercommerce.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+221771234567',
    });
    console.log('✅ Created admin user (email: admin@sneakercommerce.com, password: admin123)');

    // Create test client
    const clientPassword = await bcrypt.hash('client123', 10);
    await User.create({
      name: 'Test Client',
      email: 'client@test.com',
      password: clientPassword,
      role: 'client',
      phone: '+221779876543',
    });
    console.log('✅ Created test client (email: client@test.com, password: client123)');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('   Email: admin@sneakercommerce.com');
    console.log('   Password: admin123');
    console.log('\n📝 Client credentials:');
    console.log('   Email: client@test.com');
    console.log('   Password: client123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seed();
