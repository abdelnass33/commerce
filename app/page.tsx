'use client';

import { useEffect, useState } from 'react';
import { Search, Shirt, Footprints, Package, Glasses, Watch } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import BrandSlider from '@/components/BrandSlider';
import { productsAPI, categoriesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.data.products);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      {/* Hero Section - Style Apple Dark */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg/50 to-dark-bg">
          <Image
            src="https://images.unsplash.com/photo-1556906781-9cba4a032d4a?w=1920&q=80"
            alt="Hero"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 tracking-tight text-white">
            Sneakers & Streetwear
          </h1>
          <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto text-dark-text-secondary">
            Les dernières tendances mode. Collection exclusive.
          </p>
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="apple-button bg-white text-black px-10 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 shadow-2xl shadow-white/10"
          >
            Découvrir la collection
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-dark-text-tertiary rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-dark-text-tertiary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Brand Slider */}
      <BrandSlider />

      {/* Search Bar - Modern Dark */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-5 bg-dark-card border border-dark-border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-white placeholder-dark-text-tertiary text-base group-hover:border-dark-text-tertiary"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-text-tertiary group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* Category Slider - Dark Theme */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => {
              setSelectedCategory('');
              fetchProducts();
            }}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              selectedCategory === ''
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-dark-card text-dark-text-secondary hover:bg-dark-elevated hover:text-white border border-dark-border'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Tous</span>
          </button>
          {categories.map((category) => {
            const icons: any = {
              'Sneakers': Footprints,
              'T-Shirts': Shirt,
              'Hoodies': Shirt,
              'Sweats': Shirt,
              'Pants': Shirt,
              'Pantalons': Shirt,
              'Accessories': Glasses,
              'Accessoires': Glasses,
              'Montres': Watch,
            };
            const Icon = icons[category.name] || Package;
            
            return (
              <button
                key={category._id}
                onClick={() => {
                  setSelectedCategory(category._id);
                  fetchProducts();
                }}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category._id
                    ? 'bg-white text-black shadow-lg shadow-white/20'
                    : 'bg-dark-card text-dark-text-secondary hover:bg-dark-elevated hover:text-white border border-dark-border'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products Grid - Dark Modern */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        {loading ? (
          <div className="text-center py-32">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-dark-border rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-dark-text-secondary">Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl text-dark-text-secondary">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                onClick={() => openProductModal(product)}
                className="card-hover bg-dark-card rounded-3xl overflow-hidden cursor-pointer group border border-dark-border hover:border-dark-text-tertiary"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative aspect-square bg-dark-elevated overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {product.compareAtPrice && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 md:p-5">
                  {product.brand && (
                    <p className="text-xs text-dark-text-tertiary mb-1.5 uppercase tracking-wider font-medium">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="font-semibold text-white mb-3 line-clamp-2 text-sm md:text-base group-hover:text-primary-400 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg md:text-xl font-bold text-white">
                      {product.price.toLocaleString()} FCFA
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs md:text-sm text-dark-text-tertiary line-through">
                        {product.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `En stock` : 'Rupture de stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
