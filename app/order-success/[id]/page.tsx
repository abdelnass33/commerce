'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import Header from '@/components/Header';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Commande confirmée !
          </h1>
          
          <p className="text-gray-600 mb-2">
            Merci pour votre achat. Votre commande a été créée avec succès.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 my-6">
            <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
            <p className="text-lg font-mono font-bold text-gray-900">
              {orderId}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary-600">
              <Package className="h-5 w-5" />
              <span>Nous préparons votre commande</span>
            </div>

            <p className="text-sm text-gray-500">
              Vous recevrez un email de confirmation avec les détails de votre commande.
            </p>
          </div>

          <div className="mt-8 space-x-4">
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Continuer mes achats
            </Link>
            
            <Link
              href={`/orders/${orderId}`}
              className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Voir ma commande
            </Link>
          </div>
        </div>

        {/* Order Process Timeline */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Prochaines étapes
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Commande confirmée</h3>
                <p className="text-sm text-gray-500">Votre commande a été enregistrée</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Paiement en cours</h3>
                <p className="text-sm text-gray-500">Traitement du paiement</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Préparation</h3>
                <p className="text-sm text-gray-500">Emballage de votre commande</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Expédition</h3>
                <p className="text-sm text-gray-500">Livraison à votre adresse</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
