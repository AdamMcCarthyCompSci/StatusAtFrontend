import "./index.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { PWAUpdatePrompt } from './components/ui/pwa-update-prompt';
import Shell from "./components/layout/Shell";

// Lazy load i18n - it's not needed for initial render
import('./lib/i18n').catch(() => {
  // Fail silently if i18n fails to load - app will use default English
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="App min-h-screen bg-background text-foreground">
            <Shell />
          </div>
        </BrowserRouter>
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
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
