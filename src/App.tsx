import "./index.css";
import './lib/i18n'; // Initialize i18n
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { PWAUpdatePrompt } from './components/ui/pwa-update-prompt';
import Shell from "./components/layout/Shell";

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
