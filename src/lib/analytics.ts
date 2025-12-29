/**
 * Analytics tracking utilities
 * Centralized event tracking for Google Analytics 4
 */

type EventCategory = 'engagement' | 'conversion' | 'error' | 'navigation';

interface TrackEventParams {
  action: string;
  category: EventCategory;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track custom events
 */
export function trackEvent({ action, category, label, value, ...params }: TrackEventParams): void {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', { action, category, label, value, params });
    }
    return;
  }

  // Check if gtag exists (loaded from GoogleAnalytics component)
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...params,
  });
}

/**) return;

  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  
export function trackPageView(url: string, title: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title,
  });
}

/**
 * Predefined event trackers
 */
export const analytics = {
  // Order events
  orderCreated: (serviciu: string, country?: string) => 
    trackEvent({ 
      action: 'order_created', 
      category: 'conversion',
      label: serviciu,
      serviciu,
      country 
    }),

  orderArchived: (orderId: string) => 
    trackEvent({ 
      action: 'order_archived', 
      category: 'engagement',
      label: orderId 
    }),

  // Message events
  messageSent: (orderId: string, role: string) => 
    trackEvent({ 
      action: 'message_sent', 
      category: 'engagement',
      role,
      order_id: orderId 
    }),

  // User events
  userRegistered: (role: string) => 
    trackEvent({ 
      action: 'user_registered', 
      category: 'conversion',
      label: role 
    }),

  userLogin: (role: string) => 
    trackEvent({ 
      action: 'user_login', 
      category: 'engagement',
      label: role 
    }),

  profileUpdated: (role: string) => 
    trackEvent({ 
      action: 'profile_updated', 
      category: 'engagement',
      label: role 
    }),

  // Navigation events
  serviceViewed: (serviciu: string) => 
    trackEvent({ 
      action: 'service_viewed', 
      category: 'navigation',
      label: serviciu 
    }),

  transportRouteViewed: (ruta: string) => 
    trackEvent({ 
      action: 'transport_route_viewed', 
      category: 'navigation',
      label: ruta 
    }),

  ctaClicked: (ctaName: string, location: string) => 
    trackEvent({ 
      action: 'cta_clicked', 
      category: 'engagement',
      label: ctaName,
      location 
    }),

  // Error events
  errorOccurred: (errorCode: string, errorMessage: string) => 
    trackEvent({ 
      action: 'error_occurred', 
      category: 'error',
      label: errorCode,
      error_message: errorMessage 
    }),

  // Search events
  searchPerformed: (query: string, results: number) => 
    trackEvent({ 
      action: 'search', 
      category: 'engagement',
      label: query,
      search_term: query,
      value: results 
    }),
};

export default analytics;
