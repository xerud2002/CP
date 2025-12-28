'use client';

import { useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';
import type { Order } from '@/types';

interface ArchivedOrder extends Order {
  archivedAt: Date | { toDate: () => Date };
}

export default function ArchivedOrdersContent() {
  const [loading, setLoading] = useState(false);
  const [archivedOrders, setArchivedOrders] = useState<ArchivedOrder[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadArchivedOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'comenzi'),
        where('archived', '==', true)
      );
      
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArchivedOrder[];

      // Sort by archivedAt date (newest first)
      orders.sort((a, b) => {
        const dateA = a.archivedAt && typeof a.archivedAt === 'object' && 'toDate' in a.archivedAt 
          ? a.archivedAt.toDate() 
          : new Date(a.archivedAt || 0);
        const dateB = b.archivedAt && typeof b.archivedAt === 'object' && 'toDate' in b.archivedAt 
          ? b.archivedAt.toDate() 
          : new Date(b.archivedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setArchivedOrders(orders);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading archived orders:', error);
      showError('Eroare la încărcarea comenzilor arhivate');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Sigur vrei să ștergi definitiv această comandă? Acțiunea nu poate fi anulată!')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'comenzi', orderId));
      setArchivedOrders(prev => prev.filter(o => o.id !== orderId));
      showSuccess('Comanda a fost ștearsă definitiv!');
    } catch (error) {
      console.error('Error deleting order:', error);
      showError('Eroare la ștergerea comenzii');
    }
  };

  const deleteAllArchived = async () => {
    if (!confirm(`Sigur vrei să ștergi TOATE cele ${archivedOrders.length} comenzi arhivate? Acțiunea nu poate fi anulată!`)) {
      return;
    }

    setLoading(true);
    try {
      let deleted = 0;
      for (const order of archivedOrders) {
        if (order.id) {
          await deleteDoc(doc(db, 'comenzi', order.id));
          deleted++;
        }
      }
      setArchivedOrders([]);
      showSuccess(`${deleted} comenzi au fost șterse definitiv!`);
    } catch (error) {
      console.error('Error deleting orders:', error);
      showError('Eroare la ștergerea comenzilor');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDeletion = (archivedAt: Date | { toDate: () => Date }) => {
    const date = archivedAt && typeof archivedAt === 'object' && 'toDate' in archivedAt 
      ? archivedAt.toDate() 
      : new Date(archivedAt);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = 30 - daysPassed;
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const formatDate = (date: Date | { toDate: () => Date }) => {
    const d = date && typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date);
    return d.toLocaleDateString('ro-RO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Comenzi Arhivate</h2>
          <p className="text-gray-400 text-sm">
            Comenzile arhivate sunt șterse automat după 30 zile
          </p>
        </div>
        {!hasLoaded ? (
          <button
            onClick={loadArchivedOrders}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se încarcă...' : 'Încarcă comenzi arhivate'}
          </button>
        ) : (
          <button
            onClick={deleteAllArchived}
            disabled={loading || archivedOrders.length === 0}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se șterge...' : `Șterge toate (${archivedOrders.length})`}
          </button>
        )}
      </div>

      {/* Orders List */}
      {hasLoaded && (
        <div className="space-y-3">
          {archivedOrders.length === 0 ? (
            <div className="bg-slate-800/30 rounded-xl p-8 text-center border border-white/5">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-400">Nu există comenzi arhivate</p>
            </div>
          ) : (
            archivedOrders.map(order => (
              <div
                key={order.id}
                className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-bold">
                        #{order.orderNumber || order.id?.slice(0, 8)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">
                        {order.serviciu || 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                        Șterge în {getDaysUntilDeletion(order.archivedAt)} zile
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>
                        <span className="text-gray-500">De la:</span> {order.oras_ridicare || 'N/A'}, {order.tara_ridicare || 'N/A'}
                      </p>
                      <p>
                        <span className="text-gray-500">La:</span> {order.oras_livrare || 'N/A'}, {order.tara_livrare || 'N/A'}
                      </p>
                      <p className="text-xs">
                        <span className="text-gray-500">Arhivată:</span> {formatDate(order.archivedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => order.id && deleteOrder(order.id)}
                    className="shrink-0 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all"
                  >
                    Șterge acum
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
