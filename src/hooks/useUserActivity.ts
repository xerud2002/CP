import { useEffect, useRef } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

/**
 * Hook to track user activity and update lastSeen in Firestore
 * Updates lastSeen every 2 minutes while user is active
 * Also updates on page visibility changes and before unload
 */
export function useUserActivity(userId: string | undefined) {
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    if (!userId) return;
    
    isUnmountingRef.current = false;

    const updateLastSeen = async () => {
      // Don't update if component is unmounting (user logging out)
      if (isUnmountingRef.current) return;
      
      // Don't update if user is no longer authenticated
      if (!auth.currentUser) return;
      
      try {
        await updateDoc(doc(db, 'users', userId), {
          lastSeen: serverTimestamp()
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        // Only log if it's not a permission error (which happens on logout)
        const errorMessage = (error as Error)?.message || '';
        if (!errorMessage.includes('permission')) {
          console.error('Failed to update lastSeen:', error);
        }
      }
    };

    // Update immediately on mount
    updateLastSeen();

    // Update every 2 minutes while user is active
    const interval = setInterval(() => {
      updateLastSeen();
    }, 2 * 60 * 1000); // 2 minutes

    // Update when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateLastSeen();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update before page unload
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable last update on page close
      const data = JSON.stringify({
        userId,
        timestamp: Date.now()
      });
      navigator.sendBeacon('/api/track-activity', data);
      
      // Also try regular update (might not complete before unload)
      updateLastSeen();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      isUnmountingRef.current = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Don't update lastSeen on unmount - user might be logging out
    };
  }, [userId]);
}
