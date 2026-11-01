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
import {
  getMaintenanceAccess,
  isMaintenanceBlockedError,
  subscribeMaintenanceAccess,
} from '@/feature/maintenance/access';
import MaintenanceGate from '@/feature/maintenance/component/MaintenanceGate';

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

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') return;

  const { worker } = await import('@/mock/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
let applicationRouter;
function Application() {
  // 권한 확인 후 최초로 생성합니다. Strict Mode에서도 라우터를 중복 생성하지 않습니다.
  const [router] = React.useState(() => {
    if (!applicationRouter) applicationRouter = createBrowserRouter(routeList);
    return applicationRouter;
  });
  React.useEffect(() => {
    // 점검 중 차단된 loader가 있다면 접근 복구 시 다시 실행합니다.
    const recoverLoader = () => {
      const access = getMaintenanceAccess();
      if (
        access !== 'checking' &&
        access !== 'blocked' &&
        router.state.revalidation === 'idle' &&
        Object.values(router.state.errors || {}).some(isMaintenanceBlockedError)
      ) {
        router.revalidate();
      }
    };
    recoverLoader();
    const unsubscribeAccess = subscribeMaintenanceAccess(recoverLoader);
    // 권한 확인보다 늦게 도착한 loader 오류도 복구합니다.
    const unsubscribeRouter = router.subscribe(recoverLoader);
    return () => {
      unsubscribeAccess();
      unsubscribeRouter();
    };
  }, [router]);
  return (
    <ToastProvider>
      <QueryProvider navigate={router.navigate}>
        <ModalProvider>
          <CommentContextProvider>
            <RouterProvider router={router} />
          </CommentContextProvider>
        </ModalProvider>
      </QueryProvider>
    </ToastProvider>
  );
}

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <GrowthBookProvider growthbook={growthbook}>
        <MaintenanceGate>
          <Application />
        </MaintenanceGate>
      </GrowthBookProvider>
    </React.StrictMode>
  );
});

reportWebVitals();
