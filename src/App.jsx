import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useQueryClient } from '@tanstack/react-query';

import { Sidebar } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { useScrollRestoration } from '@/shared/hook';
import { AppLayout } from '@/shared/ui';

import { PushNotificationManager } from '@/feature/alert/lib';
import {
  MAINTENANCE_END,
  MAINTENANCE_START,
} from '@/feature/maintenance/hook/useMaintenance';

import GlobalErrorFallback from '@/GlobalErrorFallback';

import styles from './App.module.css';
import { MaintenancePage } from './page/maintenance';

function App() {
  const appRef = useRef();
  const queryClient = useQueryClient();
  const isEnabled = useFeatureIsOn('push-notification');

  // 푸시 알림 설정
  useEffect(() => {
    if (!isEnabled) return;

    const listen = () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.notifications() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.unreadNotificationCount,
      });
    };

    PushNotificationManager.registerServiceWorker()
      .then(() => PushNotificationManager.onForegroundMessage(listen))
      .catch((error) => console.error(error));
  }, [isEnabled]);

  useScrollRestoration(appRef);

  // 서버 점검 페이지 처리
  const now = new Date();
  const isMaintenance = now >= MAINTENANCE_START && now <= MAINTENANCE_END;
  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <AppLayout>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        <div className={styles.app} ref={appRef}>
          <Outlet />
          <Sidebar />
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
}

export default App;
