import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useQueryClient } from '@tanstack/react-query';

import { Sidebar } from '@/shared/component';
import { FEATURE_FLAG, QUERY_KEY } from '@/shared/constant';
import { useScrollRestoration } from '@/shared/hook';
import { AppLayout } from '@/shared/ui';

import { PushNotificationManager } from '@/feature/alert/lib';

import styles from './App.module.css';

function App() {
  const appRef = useRef();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isEnabled = useFeatureIsOn(FEATURE_FLAG.pushNotification);
  const isPickupDisplayPage = location.pathname === '/commerce/pickup-display';

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
  }, [isEnabled, queryClient]);

  useScrollRestoration(appRef);

  return (
    <AppLayout variant={isPickupDisplayPage ? 'pickupDisplay' : 'default'}>
      <div className={styles.app} ref={appRef}>
        <main>
          <Outlet />
        </main>
        <Sidebar />
      </div>
    </AppLayout>
  );
}

export default App;
