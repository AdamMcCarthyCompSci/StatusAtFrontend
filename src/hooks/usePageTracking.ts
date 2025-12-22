import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackPageView } from '@/lib/analytics';

/**
 * Hook to automatically track page views when route changes
 * Add this hook to your root component or router
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);
};
