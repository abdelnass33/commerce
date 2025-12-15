'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Tag, Percent } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { promotionsAPI } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminPromotions() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    active: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchPromotions();
  }, [isAdmin]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionsAPI.getAll();
      setPromotions(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : undefined,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      };

      if (editingPromotion) {
        await promotionsAPI.update(editingPromotion._id, data);
        toast.success('Promotion modifiée avec succès');
      } else {
        await promotionsAPI.create(data);
        toast.success('Promotion créée avec succès');
      }
      
      setShowModal(false);
      resetForm();
      fetchPromotions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;
    
    try {
      await promotionsAPI.delete(id);
      toast.success('Promotion supprimée');
      fetchPromotions();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditModal = (promotion: any) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      description: promotion.description || '',
      discountType: promotion.discountType,
      discountValue: promotion.discountValue.toString(),
      minPurchase: promotion.minPurchase?.toString() || '',
      maxDiscount: promotion.maxDiscount?.toString() || '',
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
      usageLimit: promotion.usageLimit?.toString() || '',
      active: promotion.active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPromotion(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      active: true,
    });
  };

  const isPromotionActive = (promotion: any) => {
    if (!promotion.active) return false;
    const now = new Date();
    const start = promotion.startDate ? new Date(promotion.startDate) : null;
    const end = promotion.endDate ? new Date(promotion.endDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Promotions</h1>
            <p className="text-gray-600">Gérez vos codes promo et réductions</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-5 w-5" />
            Nouvelle promotion
          </button>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : promotions.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune promotion trouvée</p>
            </div>
          ) : (
            promotions.map((promotion) => (
              <div
                key={promotion._id}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition ${
                  isPromotionActive(promotion) ? 'border-green-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      isPromotionActive(promotion) ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Tag className={`h-6 w-6 ${
                        isPromotionActive(promotion) ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {promotion.code}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isPromotionActive(promotion)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isPromotionActive(promotion) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(promotion)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(promotion._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {promotion.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {promotion.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {promotion.discountType === 'percentage'
                        ? `${promotion.discountValue}% de réduction`
                        : `${promotion.discountValue.toLocaleString()} FCFA de réduction`}
                    </span>
                  </div>
                  {promotion.minPurchase && (
                    <div className="text-xs text-gray-500">
                      Achat minimum: {promotion.minPurchase.toLocaleString()} FCFA
                    </div>
                  )}
                  {promotion.maxDiscount && (
                    <div className="text-xs text-gray-500">
                      Réduction max: {promotion.maxDiscount.toLocaleString()} FCFA
                    </div>
                  )}
                </div>

                {(promotion.startDate || promotion.endDate) && (
                  <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                    {promotion.startDate && (
                      <div>Début: {new Date(promotion.startDate).toLocaleDateString('fr-FR')}</div>
                    )}
                    {promotion.endDate && (
                      <div>Fin: {new Date(promotion.endDate).toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                )}

                {promotion.usageLimit && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Utilisations: {promotion.usageCount || 0} / {promotion.usageLimit}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent font-mono"
                      placeholder="PROMO2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de réduction *
                    </label>
                    <select
                      required
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    >
                      <option value="percentage">Pourcentage</option>
                      <option value="fixed">Montant fixe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Description de la promotion..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valeur *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder={formData.discountType === 'percentage' ? '10' : '5000'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.discountType === 'percentage' ? 'Pourcentage (%)' : 'Montant (FCFA)'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Achat minimum
                    </label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Réduction max
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="Illimité"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite d&apos;utilisation
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Illimité"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre maximum d&apos;utilisations (laissez vide pour illimité)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Promotion active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    {editingPromotion ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
