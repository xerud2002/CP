import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import { showWarning } from '@/lib/toast';

/**
 * Custom hook for order action handlers
 * Provides handlers for finalizing orders and requesting reviews
 * 
 * @param reloadOrders - Callback to reload orders after actions
 * @returns {handleFinalizeOrder, handleRequestReview}
 */
export function useOrderHandlers(reloadOrders: () => void) {
  /**
   * Finalize order (change status to 'livrata')
   */
  const handleFinalizeOrder = async (orderId: string, status: string) => {
    if (!canFinalizeOrder(status)) {
      showWarning('Poți finaliza doar comenzile cu statusul "În Lucru"!');
      return;
    }
    
    const success = await transitionToFinalizata(orderId, status);
    if (success) {
      // Reload orders to reflect the change
      reloadOrders();
    }
  };

  /**
   * Request review from client (placeholder - not yet implemented)
   */
  const handleRequestReview = (_orderId: string) => {
    void _orderId; // Parameter reserved for future implementation
    // TODO: Implement actual notification system (email/push/in-app)
    // This will require:
    // 1. Email service integration (SendGrid/AWS SES)
    // 2. In-app notification collection in Firestore
    // 3. Client-side notification UI
    showWarning('Funcția de cerere recenzie va fi disponibilă în curând!');
  };

  return {
    handleFinalizeOrder,
    handleRequestReview
  };
}
