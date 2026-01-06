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
const root = ReactDOM.createRoot(rootElement);
root.render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={options}
  >
    <App />
  </PostHogProvider>
);
