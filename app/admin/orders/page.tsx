'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ordersAPI } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.update(orderId, { status });
      toast.success('Statut mis à jour');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="h-5 w-5" />;
      case 'processing': return <Package className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commandes</h1>
          <p className="text-gray-600">Gérez toutes les commandes de votre boutique</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gray-900">
                          #{order._id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.shipping?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.shipping?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {order.total.toLocaleString()} FCFA
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment.status === 'paid' ? 'Payé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">En attente</option>
                            <option value="processing">En traitement</option>
                            <option value="shipped">Expédié</option>
                            <option value="delivered">Livré</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Commande #{selectedOrder._id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Statut</h3>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Informations client</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nom:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.shipping?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.shipping?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Téléphone:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.shipping?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Adresse:</span>
                      <span className="text-sm font-medium text-gray-900 text-right">
                        {selectedOrder.shipping?.address}, {selectedOrder.shipping?.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Articles commandés</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.product?.name || 'Produit'}</div>
                          <div className="text-sm text-gray-600">
                            Quantité: {item.quantity}
                            {item.size && ` • Taille: ${item.size}`}
                            {item.color && ` • Couleur: ${item.color}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.price.toLocaleString()} FCFA × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Paiement</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Méthode:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {selectedOrder.payment?.method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <span className={`text-sm font-medium ${
                        selectedOrder.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedOrder.payment.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-900">Total:</span>
                        <span className="text-base font-bold text-gray-900">
                          {selectedOrder.total.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Mettre à jour le statut</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder._id, e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  >
                    <option value="pending">En attente</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
