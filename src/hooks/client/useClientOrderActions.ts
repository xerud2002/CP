'use client';

import { useCallback } from 'react';
import { doc, deleteDoc, getDoc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError, showWarning } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';
import { showConfirm } from '@/components/ui/ConfirmModal';
import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import { serverTimestamp } from 'firebase/firestore';
import type { Order } from '@/types';

export function useClientOrderActions() {
  const handleDelete = useCallback(async (order: Order, onSuccess?: () => void) => {
    if (!order.id) {
      showError('ID comandă invalid');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Arhivează comanda',
      message: `Comanda #${order.orderNumber || order.id} va fi arhivată și ștearsă automat după 30 zile. Vrei să continui?`,
      confirmText: 'Arhivează',
      cancelText: 'Anulează',
      variant: 'warning'
    });

    if (!confirmed) return;

    try {
      console.log('🗂️ Arhivare comandă:', order.id);
      
      // Archive order
      await updateDoc(doc(db, 'comenzi', order.id), {
        archived: true,
        archivedAt: serverTimestamp()
      });
      console.log('✅ Comandă arhivată');

      // Delete all messages associated with this order
      const messagesQuery = query(
        collection(db, 'mesaje'),
        where('orderId', '==', order.id)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      
      console.log(`📨 Găsite ${messagesSnapshot.size} mesaje de șters`);
      
      if (!messagesSnapshot.empty) {
        const batch = writeBatch(db);
        messagesSnapshot.docs.forEach((docSnap) => {
          console.log('🗑️ Ștergere mesaj:', docSnap.id);
          batch.delete(docSnap.ref);
        });
        await batch.commit();
        console.log('✅ Toate mesajele au fost șterse');
      }

      showSuccess('Comanda a fost arhivată! Va fi ștearsă definitiv după 30 zile.');
      
      // Force page reload to refresh all listeners and clear cached data
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('❌ Eroare la arhivare:', error);
      logError(error, 'handleDelete');
      showError('Eroare la arhivarea comenzii');
    }
  }, []);

  const handleFinalizeOrder = useCallback(async (order: Order, onSuccess?: () => void) => {
    if (!order.id || !order.status) {
      showError('Comandă invalidă');
      return;
    }

    if (!canFinalizeOrder(order.status)) {
      showWarning('Poți finaliza doar comenzile cu statusul "În Lucru"!');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Finalizare comandă',
      message: `Confirmă finalizarea comenzii #${order.orderNumber || order.id}. Aceasta va permite curierului să primească recenzii.`,
      confirmText: 'Finalizează',
      cancelText: 'Anulează',
      variant: 'info'
    });

    if (!confirmed) return;

    try {
      // Get courier info if not already in order
      let courierInfo = order.courierId ? {
        courierId: order.courierId,
        courierName: order.courierName || 'Curier'
      } : undefined;

      // If courier info missing, try to get from messages (first courier who messaged)
      if (!courierInfo) {
        const messagesQuery = await getDoc(doc(db, 'mesaje', order.id));
        if (messagesQuery.exists()) {
          const firstCourierMsg = messagesQuery.data();
          if (firstCourierMsg.courierId) {
            courierInfo = {
              courierId: firstCourierMsg.courierId,
              courierName: firstCourierMsg.senderName || 'Curier'
            };
          }
        }
      }

      const success = await transitionToFinalizata(order.id, order.status, courierInfo);
      if (success) {
        onSuccess?.();
      }
    } catch (error) {
      logError(error, 'handleFinalizeOrder');
      showError('Eroare la finalizarea comenzii');
    }
  }, []);

  return {
    handleDelete,
    handleFinalizeOrder
  };
}
