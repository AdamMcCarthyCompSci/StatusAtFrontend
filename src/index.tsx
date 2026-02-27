import ReactDOM from 'react-dom/client';
import './index.css';
import { PostHogProvider } from 'posthog-js/react';

import App from './App';

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30',
} as const;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const app = (
  <PostHogProvider
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={options}
  >
    <App />
  </PostHogProvider>
);

// If the root already has content (prerendered HTML), hydrate to preserve it
// and avoid a flash of blank content. Otherwise create a fresh root.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
