// This file configures the initialization of Sentry on the client side.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://bab66b9334ea966739a27b6dc7e51c60@o4510619933999104.ingest.de.sentry.io/4510620059107408',
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production, or using tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  
  environment: process.env.NODE_ENV || 'development',
  
  beforeSend(event) {
    // Filter out errors from development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event (dev):', event);
      return null; // Don't send to Sentry in dev
    }
    return event;
  },
  
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    // Facebook nonsense
    'fb_xd_fragment',
    // Network errors (expected in flaky connections)
    'NetworkError',
    'Non-Error promise rejection captured',
  ],
});
