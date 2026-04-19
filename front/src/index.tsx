import { StrictMode } from 'react';
import { BProgress } from '@bprogress/core';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline } from '@mui/material';
import './index.css';
import { setupAxiosInterceptors } from './interceptors.ts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

const queryClient = new QueryClient();

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

setupAxiosInterceptors();

const router = createRouter({ routeTree, defaultPreload: 'intent' });

BProgress.configure({ showSpinner: false });

router.subscribe('onBeforeLoad', route => {
  if (!route.pathChanged) {
    return;
  }

  BProgress.start();
});

router.subscribe('onResolved', () => {
  BProgress.done();
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
