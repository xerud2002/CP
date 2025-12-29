// This file configures the initialization of Sentry on the server side.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://bab66b9334ea966739a27b6dc7e51c60@o4510619933999104.ingest.de.sentry.io/4510620059107408',
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will send default PII data to Sentry.
  sendDefaultPii: true,
  
  environment: process.env.NODE_ENV || 'development',
  
  beforeSend(event) {
    // Filter out errors from development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event (server dev):', event);
      return null; // Don't send to Sentry in dev
    }
    return event;
  },
});
