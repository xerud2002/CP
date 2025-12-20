'use client';

import { useCallback } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';
import { showConfirm } from '@/components/ui/ConfirmModal';
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

  return {
    handleDelete
  };
}
