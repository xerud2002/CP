/**
 * Utility functions for order display and formatting
 */

/**
 * Converts a Firebase document ID into a friendly order number format
 * Example: "SjS9dL3owdxH8Cwz7tEG" → "CP1411"
 * 
 * @param firebaseId - The Firebase document ID
 * @returns A formatted order number in CP#### format
 */
export const formatOrderNumber = (firebaseId: string): string => {
  // Generate deterministic hash from Firebase ID
  const hashCode = firebaseId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Convert to 4-digit number (0000-9999)
  const orderNum = Math.abs(hashCode) % 10000;
  
  // Return formatted order number with CP prefix
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
