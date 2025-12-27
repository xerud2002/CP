/**
 * Order status transition helpers
 */

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';

/**
 * Transition order status from 'noua' to 'in_lucru'
 * This happens automatically when a courier sends a message or makes an offer
 */
export const transitionToInLucru = async (orderId: string, currentStatus: string): Promise<boolean> => {
  if (currentStatus !== 'noua') {
    return false;
  }

  try {
    const orderRef = doc(db, 'comenzi', orderId);
    await updateDoc(orderRef, {
      status: 'in_lucru',
      statusUpdatedAt: serverTimestamp(),
      inLucruAt: serverTimestamp(),
    });
    // Transition successful
    return true;
  } catch (error) {
    console.error('Error transitioning to in_lucru:', error);
    return false;
  }
};

/**
 * Transition order status to 'livrata' (finalized)
 * Can only be done if current status is 'in_lucru'
 */
export const transitionToFinalizata = async (
  orderId: string, 
  currentStatus: string, 
  courierInfo?: { courierId: string; courierName: string }
): Promise<boolean> => {
  if (currentStatus !== 'in_lucru') {
    showError('Poți finaliza doar comenzile cu statusul "În Lucru"!');
    return false;
  }

  try {
    const orderRef = doc(db, 'comenzi', orderId);
    const updateData: Record<string, unknown> = {
      status: 'livrata',
      statusUpdatedAt: serverTimestamp(),
      finalizataAt: serverTimestamp(),
    };

    // Store courier info if provided (for reviews)
    if (courierInfo) {
      updateData.courierId = courierInfo.courierId;
      updateData.courierName = courierInfo.courierName;
    }

    await updateDoc(orderRef, updateData);
    showSuccess('Comanda a fost marcată ca finalizată!');
    return true;
  } catch (error) {
    showError(error);
    return false;
  }
};

/**
 * Check if an order can be edited based on its status
 */
export const canEditOrder = (status: string): boolean => {
  return status === 'noua';
};

/**
 * Check if an order can be deleted based on its status
 */
export const canDeleteOrder = (status: string): boolean => {
  return status === 'noua';
};

/**
 * Check if an order can be finalized based on its status
 */
export const canFinalizeOrder = (status: string): boolean => {
  return status === 'in_lucru';
};

/**
 * Check if a review can be left for an order
 * Reviews are only allowed for orders with 'livrata' status
 */
export const canLeaveReview = (status: string): boolean => {
  return status === 'livrata';
};
