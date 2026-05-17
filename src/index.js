import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { GrowthBookProvider } from '@growthbook/growthbook-react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ModalProvider } from '@/shared/context/ModalContext';
import { ToastProvider } from '@/shared/context/ToastContext';
import { growthbook } from '@/shared/lib';

import { CommentContextProvider } from '@/feature/comment/context';

// import { routeList } from '@/router.migration.js';
import reportWebVitals from '@/reportWebVitals';
import { routeList } from '@/router.js';

import '@/index.css';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production',
  integrations: [
    Sentry.captureConsoleIntegration({ levels: ['error'] }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 세션 리플레이 100%
  replaysSessionSampleRate: 0.05, // 전체 세션 중 5%만 리플레이
});

growthbook.init({ streaming: true });

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);
const router = sentryCreateBrowserRouter(routeList);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GrowthBookProvider growthbook={growthbook}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ModalProvider>
            <CommentContextProvider>
              <RouterProvider router={router} />
            </CommentContextProvider>
          </ModalProvider>
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GrowthBookProvider>
  </React.StrictMode>
);

reportWebVitals();
