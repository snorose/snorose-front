import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ModalProvider } from '@/shared/context/ModalContext';
import { ToastProvider } from '@/shared/context/ToastContext';
import { growthbook } from '@/shared/lib';

import { CommentContextProvider } from '@/feature/comment/context';

import { queryClient } from '@/queryClient';
// import { routeList } from '@/router.migration.js';
import reportWebVitals from '@/reportWebVitals';
import { routeList } from '@/router.js';
import { initSentry } from '@/sentry';

import '@/index.css';

initSentry();
growthbook.init({ streaming: true });

const router = createBrowserRouter(routeList);
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
