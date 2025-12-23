import { useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Hook to track user activity and update lastSeen in Firestore
 * Updates lastSeen every 2 minutes while user is active
 * Also updates on page visibility changes and before unload
 */
export function useUserActivity(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    const updateLastSeen = async () => {
      try {
        await updateDoc(doc(db, 'users', userId), {
          lastSeen: serverTimestamp()
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Failed to update lastSeen:', error);
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
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Final update on component unmount
      updateLastSeen();
    };
  }, [userId]);
}
