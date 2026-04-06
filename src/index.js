import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { GrowthBookProvider } from '@growthbook/growthbook-react';
import * as Sentry from '@sentry/react';

import { ModalProvider } from '@/shared/context/ModalContext';
import { ToastProvider } from '@/shared/context/ToastContext';
import { growthbook } from '@/shared/lib';
import { QueryProvider } from '@/shared/provider/query-provider';

import { CommentContextProvider } from '@/feature/comment/context';

import reportWebVitals from '@/reportWebVitals';
import { routeList } from '@/router.js';

import '@/index.css';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV,
  enabled: process.env.REACT_APP_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
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

const router = createBrowserRouter(routeList);

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') return;

  const { worker } = await import('@/mock/browser');
  return worker.start();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <GrowthBookProvider growthbook={growthbook}>
        <ToastProvider>
          <QueryProvider navigate={router.navigate}>
            <ModalProvider>
              <CommentContextProvider>
                <RouterProvider router={router} />
              </CommentContextProvider>
            </ModalProvider>
          </QueryProvider>
        </ToastProvider>
      </GrowthBookProvider>
    </React.StrictMode>
  );
});

reportWebVitals();
