'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersAPI, promotionsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { CreditCard, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Senegal',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money' | 'card'>('wave');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validatedPromoCode, setValidatedPromoCode] = useState('');

  const subtotal = getTotal();
  const total = subtotal - discount;

  if (!isAuthenticated) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const validatePromoCode = async () => {
    try {
      const response = await promotionsAPI.validate({
        code: promoCode,
        cartTotal: subtotal,
        items: items.map(item => ({ product: item.productId, quantity: item.quantity })),
      });
      
      setDiscount(response.data.data.discount);
      setValidatedPromoCode(promoCode);
      toast.success('Code promo appliqué avec succès');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Code promo invalide');
      setDiscount(0);
      setValidatedPromoCode('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        items: items.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        subtotal,
        discount,
        discountCode: validatedPromoCode,
        total,
        paymentMethod,
        shippingAddress,
      };

      const response = await ordersAPI.create(orderData);
      
      clearCart();
      toast.success('Commande créée avec succès');
      router.push(`/order-success/${response.data.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Adresse de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Méthode de paiement</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="wave"
                    checked={paymentMethod === 'wave'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <Smartphone className="h-6 w-6 mr-2 text-primary-600" />
                  <span className="font-medium">Wave</span>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="orange_money"
                    checked={paymentMethod === 'orange_money'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <Smartphone className="h-6 w-6 mr-2 text-orange-500" />
                  <span className="font-medium">Orange Money</span>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                  <span className="font-medium">Carte bancaire</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({items.length} articles)</span>
                  <span>{subtotal.toLocaleString()} FCFA</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{discount.toLocaleString()} FCFA</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="PROMO2024"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={validatePromoCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Appliquer
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
