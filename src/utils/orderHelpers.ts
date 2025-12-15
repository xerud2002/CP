/**
 * Utility functions for order display and formatting
 */

import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logError } from '@/lib/errorMessages';

/**
 * Gets the next sequential order number and increments the counter
 * Starting from 141121 and incrementing by 1 for each new order
 * 
 * @returns The next order number to use
 */
export const getNextOrderNumber = async (): Promise<number> => {
  const counterRef = doc(db, 'counters', 'orderNumber');
  
  try {
    // Use a transaction to ensure atomic increment
    const nextNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let currentNumber = 141121; // Starting number
      
      if (counterDoc.exists()) {
        currentNumber = counterDoc.data().current || 141121;
      } else {
        // Initialize counter if it doesn't exist
        transaction.set(counterRef, { current: 141121 });
        return 141121;
      }
      
      // Increment for next order
      const nextNum = currentNumber + 1;
      transaction.update(counterRef, { current: nextNum });
      
      return currentNumber;
    });
    
    return nextNumber;
  } catch (error) {
    logError(error, 'getNextOrderNumber');
    // Fallback to timestamp-based number if transaction fails
    return 141121 + Math.floor(Date.now() / 1000) % 100000;
  }
};

/**
 * Converts an order into a friendly order number format
 * Example: orderNumber 141121 → "CP141121"
 * If no orderNumber exists, generates from Firebase ID for backwards compatibility
 * 
 * @param orderIdOrNumber - Either the order's sequential number or Firebase ID (for old orders)
 * @returns A formatted order number in CP###### format
 */
export const formatOrderNumber = (orderIdOrNumber: number | string): string => {
  // If it's a number (new system with sequential orderNumber)
  if (typeof orderIdOrNumber === 'number') {
    return `CP${orderIdOrNumber}`;
  }
  
  // Fallback for old orders without orderNumber - generate from Firebase ID
  const hashCode = orderIdOrNumber.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const orderNum = Math.abs(hashCode) % 10000;
  return `CP${String(orderNum).padStart(4, '0')}`;
};

/**
 * Formats client name to "FirstName L." format
 * Example: "John Doe" → "John D."
 * 
 * @param name - Full name of the client
 * @returns Formatted name with first name and last initial
 */
export const formatClientName = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
};

/**
 * Normalizes old English status names to new Romanian status names
 * Provides backwards compatibility for orders created before status migration
 * 
 * @param status - The order status (can be old English or new Romanian)
 * @returns Normalized Romanian status
 */
export const normalizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'noua',
    'accepted': 'in_lucru',
    'in_transit': 'in_lucru',
    'completed': 'livrata',
    'cancelled': 'anulata',
  };
  return statusMap[status] || status;
};
