'use client';

import { useCallback } from 'react';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError, showWarning } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';
import { showConfirm } from '@/components/ui/ConfirmModal';
import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import type { Order } from '@/types';

export function useClientOrderActions() {
  const handleDelete = useCallback(async (order: Order, onSuccess?: () => void) => {
    if (!order.id) {
      showError('ID comandă invalid');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Șterge comanda',
      message: `Sigur dorești să ștergi comanda #${order.orderNumber || order.id}? Această acțiune nu poate fi anulată.`,
      confirmText: 'Șterge',
      cancelText: 'Anulează',
      variant: 'danger'
    });

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'comenzi', order.id));
      showSuccess('Comanda a fost ștearsă cu succes!');
      onSuccess?.();
    } catch (error) {
      logError(error, 'handleDelete');
      showError('Eroare la ștergerea comenzii');
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
