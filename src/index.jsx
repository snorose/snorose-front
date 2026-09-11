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
import { routeList } from '@/router.jsx';

import '@/index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.MODE === 'production',
  debug: import.meta.env.DEV,
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

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('@/mock/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(routeList);

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
