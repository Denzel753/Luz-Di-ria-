import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
import { logger } from './utils/logger';

window.addEventListener('error', (event) => {
  logger.error('Global uncaught error', event.error || new Error(event.message));
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Global unhandled promise rejection', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

