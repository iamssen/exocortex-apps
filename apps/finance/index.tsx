import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PreloadDataProvider, ScreenProvider } from '@ui/data-utils';
import { StrictMode } from 'react';
import 'react-data-grid/lib/styles.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App.tsx';
import './style.css';

const queryClient = new QueryClient();
const root = createRoot(document.querySelector('#root')!);

root.render(
  <StrictMode>
    <ScreenProvider>
      <QueryClientProvider client={queryClient}>
        <PreloadDataProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PreloadDataProvider>
      </QueryClientProvider>
    </ScreenProvider>
  </StrictMode>,
);
