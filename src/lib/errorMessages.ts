/**
 * User-friendly error messages in Romanian
 * Maps Firebase and common errors to readable messages
 */

export const errorMessages: Record<string, string> = {
  // Firebase Auth Errors
  'auth/email-already-in-use': 'Această adresă de email este deja înregistrată.',
  'auth/invalid-email': 'Adresa de email nu este validă.',
  'auth/operation-not-allowed': 'Operațiunea nu este permisă.',
  'auth/weak-password': 'Parola este prea slabă. Utilizați cel puțin 6 caractere.',
  'auth/user-disabled': 'Acest cont a fost dezactivat.',
  'auth/user-not-found': 'Nu există niciun cont cu această adresă de email.',
  'auth/wrong-password': 'Parola este incorectă.',
  'auth/invalid-credential': 'Credențialele sunt invalide. Verificați email-ul și parola.',
  'auth/too-many-requests': 'Prea multe încercări. Încercați din nou mai târziu.',
  'auth/network-request-failed': 'Eroare de conexiune. Verificați internetul.',
  'auth/popup-closed-by-user': 'Autentificarea a fost anulată.',
  'auth/cancelled-popup-request': 'Autentificarea a fost anulată.',
  
  // Firestore Errors
  'permission-denied': 'Nu aveți permisiunea de a efectua această acțiune.',
  'not-found': 'Resursa căutată nu a fost găsită.',
  'already-exists': 'Această resursă există deja.',
  'failed-precondition': 'Condiția prealabilă nu a fost îndeplinită.',
  'aborted': 'Operațiunea a fost anulată.',
  'out-of-range': 'Valoarea este în afara limitelor permise.',
  'unauthenticated': 'Trebuie să fiți autentificat pentru această acțiune.',
  'resource-exhausted': 'Resursa a fost epuizată. Încercați din nou mai târziu.',
  'data-loss': 'Pierdere de date. Încercați din nou.',
  'unknown': 'A apărut o eroare necunoscută.',
  'internal': 'Eroare internă. Încercați din nou mai târziu.',
  'unavailable': 'Serviciul nu este disponibil momentan.',
  'deadline-exceeded': 'Timpul de așteptare a expirat.',
  
  // Storage Errors
  'storage/unauthorized': 'Nu aveți permisiunea de a accesa acest fișier.',
  'storage/canceled': 'Încărcarea a fost anulată.',
  'storage/unknown': 'A apărut o eroare la încărcarea fișierului.',
  'storage/object-not-found': 'Fișierul nu a fost găsit.',
  'storage/bucket-not-found': 'Spațiul de stocare nu a fost găsit.',
  'storage/project-not-found': 'Proiectul nu a fost găsit.',
  'storage/quota-exceeded': 'Spațiul de stocare a fost depășit.',
  'storage/unauthenticated': 'Trebuie să fiți autentificat pentru a încărca fișiere.',
  'storage/retry-limit-exceeded': 'Prea multe încercări. Încercați din nou mai târziu.',
  'storage/invalid-checksum': 'Fișierul este corupt.',
  'storage/invalid-event-name': 'Nume eveniment invalid.',
  'storage/invalid-url': 'URL invalid pentru fișier.',
  'storage/invalid-argument': 'Argument invalid.',
  'storage/no-default-bucket': 'Nu există un spațiu de stocare implicit.',
  'storage/cannot-slice-blob': 'Fișierul nu poate fi procesat.',
  'storage/server-file-wrong-size': 'Dimensiunea fișierului nu corespunde.',
  
  // Custom Application Errors
  'order/creation-failed': 'Comanda nu a putut fi creată. Încercați din nou.',
  'order/update-failed': 'Comanda nu a putut fi actualizată.',
  'order/not-found': 'Comanda nu a fost găsită.',
  'order/invalid-status': 'Statusul comenzii este invalid.',
  'profile/update-failed': 'Profilul nu a putut fi actualizat.',
  'profile/incomplete': 'Vă rugăm să completați toate câmpurile obligatorii.',
  'file/too-large': 'Fișierul este prea mare. Dimensiunea maximă este 10MB.',
  'file/invalid-type': 'Tipul fișierului nu este acceptat.',
  'validation/required-field': 'Acest câmp este obligatoriu.',
  'validation/invalid-email': 'Adresa de email nu este validă.',
  'validation/invalid-phone': 'Numărul de telefon nu este valid.',
  'validation/invalid-date': 'Data introdusă nu este validă.',
  'network/offline': 'Nu există conexiune la internet.',
  'network/timeout': 'Conexiunea a expirat. Încercați din nou.',
  
  // Default fallback
  'default': 'A apărut o eroare. Vă rugăm să încercați din nou.',
};

/**
 * Gets a user-friendly error message from an error object
 * @param error - The error object (Error, FirebaseError, or string)
 * @returns User-friendly error message in Romanian
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return errorMessages[error] || error;
  }
  
  if (error instanceof Error) {
    // Check for Firebase error code
    const firebaseError = error as { code?: string; message: string };
    if (firebaseError.code) {
      return errorMessages[firebaseError.code] || firebaseError.message;
    }
    
    // Check message for common error patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('network')) {
      return errorMessages['network/offline'];
    }
    if (message.includes('permission') || message.includes('denied')) {
      return errorMessages['permission-denied'];
    }
    if (message.includes('not found')) {
      return errorMessages['not-found'];
    }
    
    return error.message;
  }
  
  return errorMessages['default'];
}

/**
 * Logs error to console in development only
 * @param error - The error to log
 * @param context - Optional context information
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  }
  // In production, this would send to error tracking service (Sentry, etc.)
}
