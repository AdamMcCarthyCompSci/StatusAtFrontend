/**
 * Google Analytics 4 utilities
 * Provides type-safe wrapper for GA4 tracking
 *
 * Note: GA4 is loaded in index.html with consent mode set to 'denied' by default.
 * When user accepts cookies, we call grantConsent() to enable tracking.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

// Track whether user has granted consent for analytics
let consentGranted = false;

/**
 * Check if Google Analytics is enabled
 */
export const isAnalyticsEnabled = (): boolean => {
  return consentGranted && typeof window.gtag === 'function';
};

/**
 * Grant consent and enable analytics and advertising tracking
 * Call this when user accepts cookies
 */
export const grantConsent = (): void => {
  if (typeof window.gtag !== 'function') {
    console.warn('[Analytics] gtag not available');
    return;
  }

  // Update consent to granted for both analytics and advertising
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });

  consentGranted = true;
  console.info(
    '[Analytics] Consent granted - analytics and ad tracking enabled'
  );

  // Track the current page immediately after granting consent
  const currentPath = window.location.pathname + window.location.search;
  trackPageView(currentPath, document.title);
};

/**
 * Deny consent and disable analytics tracking
 * Call this when user declines cookies
 */
export const denyConsent = (): void => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
  });

  consentGranted = false;
  console.info('[Analytics] Consent denied - tracking disabled');
};

/**
 * Track a page view
 * @param path - The page path (e.g., '/visa-services')
 * @param title - The page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });

  console.log('[Analytics] Page view:', path);
};

/**
 * Track a custom event
 * @param eventName - The event name (e.g., 'sign_up_click')
 * @param eventParams - Additional event parameters
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag?.('event', eventName, eventParams);

  console.log('[Analytics] Event:', eventName, eventParams);
};

/**
 * Track a button/link click
 * @param label - Description of what was clicked
 * @param category - Category of the click (e.g., 'cta', 'navigation')
 * @param value - Optional numeric value
 */
export const trackClick = (
  label: string,
  category?: string,
  value?: number
): void => {
  trackEvent('click', {
    event_category: category || 'button',
    event_label: label,
    value,
  });
};

/**
 * Track when a user starts a trial/signup
 * @param method - The signup method (e.g., 'email', 'google')
 */
export const trackSignUpStart = (method?: string): void => {
  trackEvent('sign_up', {
    method: method || 'email',
  });
};

/**
 * Track a conversion event
 * @param eventName - The conversion event name (e.g., 'purchase', 'sign_up')
 * @param value - The conversion value
 * @param currency - The currency code (default: 'EUR')
 */
export const trackConversion = (
  eventName: string,
  value?: number,
  currency = 'EUR'
): void => {
  trackEvent(eventName, {
    value,
    currency,
  });
};

/**
 * Track video interactions
 * @param action - The video action (e.g., 'play', 'pause', 'complete')
 * @param videoTitle - The video title or identifier
 */
export const trackVideo = (action: string, videoTitle: string): void => {
  trackEvent('video_' + action, {
    video_title: videoTitle,
  });
};

/**
 * Track form submissions
 * @param formName - The form identifier
 * @param success - Whether the submission was successful
 */
export const trackFormSubmit = (formName: string, success = true): void => {
  trackEvent('form_submit', {
    form_name: formName,
    success,
  });
};

/**
 * Track outbound link clicks
 * @param url - The destination URL
 * @param label - Optional label for the link
 */
export const trackOutboundLink = (url: string, label?: string): void => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    link_url: url,
  });
};
