import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

import { MaintenancePage } from '@/page/maintenance';

import {
  getMaintenanceAccess,
  subscribeMaintenanceAccess,
  syncMaintenanceAccess,
} from '../access';
import { isMaintenanceTime } from '../config';

// reload는 테스트에서 교체할 수 있도록 분리합니다.
function reloadForMaintenance() {
  window.location.reload();
}

export default function MaintenanceGate({
  children,
  reload = reloadForMaintenance,
}) {
  const startedOutsideMaintenance = useRef(!isMaintenanceTime());
  const reloaded = useRef(false);
  useSyncExternalStore(subscribeMaintenanceAccess, getMaintenanceAccess);
  const blocked = isMaintenanceTime();

  useEffect(() => {
    const check = () => syncMaintenanceAccess();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    check();
    const interval = window.setInterval(check, 1000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    // 포털은 부모 DOM의 hidden 속성을 상속하지 않습니다.
    const portals = ['modal', 'toast'].map((id) => document.getElementById(id));
    const previous = portals.map((portal) => ({
      hidden: portal?.hidden,
      display: portal?.style.display,
    }));
    portals.forEach((portal) => {
      if (portal && blocked) {
        portal.hidden = true;
        portal.style.display = 'none';
      }
    });
    return () => {
      portals.forEach((portal, index) => {
        if (!portal) return;
        portal.hidden = previous[index].hidden;
        portal.style.display = previous[index].display;
      });
    };
  }, [blocked]);

  useEffect(() => {
    if (blocked && startedOutsideMaintenance.current && !reloaded.current) {
      reloaded.current = true;
      reload();
    }
  }, [blocked, reload]);

  return (
    <>
      {blocked && <MaintenancePage />}
      {!blocked && <div style={{ height: '100%' }}>{children}</div>}
    </>
  );
}
