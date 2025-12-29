'use client';

import * as Sentry from '@sentry/nextjs';

/**
 * Test component to verify Sentry error tracking
 * Add this to any page to test error capture
 * Remove from production or guard with NODE_ENV check
 */
export default function SentryTestButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
      className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      title="Click to test Sentry error tracking"
    >
      🐛 Break the world
    </button>
  );
}

/**
 * Alternative: Capture error without crashing the app
 */
export function SentryTestButtonSafe() {
  const handleTestError = () => {
    try {
      throw new Error('Test error captured by Sentry (safe)');
    } catch (error) {
      Sentry.captureException(error);
      alert('Error sent to Sentry! Check your dashboard.');
    }
  };

  return (
    <button
      onClick={handleTestError}
      className="fixed bottom-4 right-4 z-50 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      title="Click to test Sentry (safe mode - won't crash)"
    >
      🧪 Test Sentry (Safe)
    </button>
  );
}
