import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import { showWarning, showSuccess } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Custom hook for order action handlers
 * Provides handlers for finalizing orders and requesting reviews
 * 
 * @param reloadOrders - Callback to reload orders after actions
 * @returns {handleFinalizeOrder, handleRequestReview, handleDismissOrder}
 */
export function useOrderHandlers(reloadOrders: () => void) {
  const { user } = useAuth();

  /**
   * Finalize order (change status to 'livrata')
   */
  const handleFinalizeOrder = async (orderId: string, status: string) => {
    if (!canFinalizeOrder(status)) {
      showWarning('Poți finaliza doar comenzile cu statusul "În Lucru"!');
      return;
    }

    // Get courier info for reviews
    const courierInfo = user ? {
      courierId: user.uid,
      courierName: user.displayName || user.nume || user.email?.split('@')[0] || 'Curier'
    } : undefined;
    
    const success = await transitionToFinalizata(orderId, status, courierInfo);
    if (success) {
      // Reload orders to reflect the change
      reloadOrders();
    }
  };

  /**
   * Request review from client
   * Note: Full email/push notification system will be implemented in future version
   */
  const handleRequestReview = (_orderId: string) => {
    void _orderId; // Parameter reserved for future notification system
    showWarning('Funcția de cerere recenzie va fi disponibilă în curând!');
  };

  /**
   * Dismiss order - hide it from courier's list
   * Adds courier's UID to dismissedBy array in order document
   */
  const handleDismissOrder = async (orderId: string) => {
    if (!user?.uid) {
      showWarning('Trebuie să fii autentificat!');
      return;
    }

    try {
      const orderRef = doc(db, 'comenzi', orderId);
      await updateDoc(orderRef, {
        dismissedBy: arrayUnion(user.uid)
      });
      showSuccess('Comanda a fost ascunsă din lista ta');
      reloadOrders();
    } catch (error) {
      console.error('Error dismissing order:', error);
      showWarning('Nu s-a putut ascunde comanda');
    }
  };

  return {
    handleFinalizeOrder,
    handleRequestReview,
    handleDismissOrder
  };
}
