'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    sizes: string[];
    colors?: string[];
    stock: number;
    brand?: string;
  };
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Veuillez sélectionner une couleur');
      return;
    }

    addItem({
      id: '',
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      stock: product.stock,
    });

    toast.success('Produit ajouté au panier');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-dark-card border border-dark-border p-6 md:p-8 shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title className="text-2xl md:text-3xl font-bold text-white">
                    {product.name}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-dark-text-tertiary hover:text-white transition-colors p-2 hover:bg-dark-elevated rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Images */}
                  <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-elevated mb-4">
                      <Image
                        src={product.images[currentImageIndex] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                              currentImageIndex === index ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="flex flex-col">
                    {product.brand && (
                      <p className="text-sm text-dark-text-tertiary mb-2 uppercase tracking-wider font-medium">{product.brand}</p>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-bold text-white">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xl text-dark-text-tertiary line-through">
                          {product.compareAtPrice.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>

                    <p className="text-dark-text-secondary mb-6 leading-relaxed">{product.description}</p>

                    {/* Sizes */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-white mb-3">
                        Taille
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-5 py-2.5 border rounded-xl transition-all duration-200 ${
                              selectedSize === size
                                ? 'border-primary-500 bg-primary-500 text-white shadow-lg'
                                : 'border-dark-border bg-dark-elevated text-dark-text-secondary hover:border-dark-text-tertiary hover:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-white mb-3">
                          Couleur
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-5 py-2.5 border rounded-xl transition-all duration-200 ${
                                selectedColor === color
                                  ? 'border-primary-500 bg-primary-500 text-white shadow-lg'
                                  : 'border-dark-border bg-dark-elevated text-dark-text-secondary hover:border-dark-text-tertiary hover:text-white'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-white mb-3">
                        Quantité
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 border border-dark-border bg-dark-elevated rounded-xl hover:bg-dark-border hover:text-white transition-all disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-xl font-semibold w-12 text-center text-white">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="p-3 border border-dark-border bg-dark-elevated rounded-xl hover:bg-dark-border hover:text-white transition-all disabled:opacity-50"
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-dark-text-tertiary mt-2">
                        {product.stock} en stock
                      </p>
                    </div>

                    {/* Add to cart button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="apple-button w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg disabled:bg-dark-border disabled:text-dark-text-tertiary disabled:cursor-not-allowed"
                    >
                      {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
