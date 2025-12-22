import './index.css';
import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { PWAUpdatePrompt } from './components/ui/pwa-update-prompt';
import { CookieConsentBanner } from './components/ui/cookie-consent-banner';
import Shell from './components/layout/Shell';
import { usePageTracking } from './hooks/usePageTracking';

// Import i18n synchronously to ensure translations load before initial render
import './lib/i18n';

function AppContent() {
  // Track page views automatically
  usePageTracking();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <div className="App min-h-screen bg-background text-foreground">
          <Shell />
        </div>
      </Suspense>
      {/* React Query Devtools - only loads in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-left"
        />
      )}
      {/* PWA Update Prompt */}
      <PWAUpdatePrompt />
      {/* Cookie Consent Banner - Analytics only loads after user accepts */}
      <CookieConsentBanner />
    </>
  );
}

function App() {
  // Note: Consent Mode defaults are set in index.html before React loads
  // Analytics initialization is handled by CookieConsentBanner after user accepts cookies (GDPR compliant)

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
