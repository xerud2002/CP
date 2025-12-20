'use client';

import { useCallback } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';
import type { Order } from '@/types';

export function useClientOrderActions() {
  const handleDelete = useCallback(async (order: Order, onSuccess?: () => void) => {
    if (!order.id) {
      showError('ID comandă invalid');
      return;
    }

    const confirmed = window.confirm(
      `Sigur dorești să ștergi comanda #${order.orderNumber || order.id}?\nAceastă acțiune nu poate fi anulată.`
    );

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
