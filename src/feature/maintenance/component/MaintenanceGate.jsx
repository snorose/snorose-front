import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

import { getMyPageUserInfo } from '@/apis/userInfo';

import { MaintenancePage } from '@/page/maintenance';

import {
  getMaintenanceAccess,
  refreshMaintenanceAccess,
  setMaintenanceRoleVerifier,
  subscribeMaintenanceAccess,
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
  const admitted = useRef(false);
  const status = useSyncExternalStore(
    subscribeMaintenanceAccess,
    getMaintenanceAccess
  );
  const current = isMaintenanceTime()
    ? status === 'inactive'
      ? 'checking'
      : status
    : 'inactive';
  const blocked = current === 'checking' || current === 'blocked';
  if (!blocked) admitted.current = true;

  useEffect(() => {
    const check = () => refreshMaintenanceAccess();
    const onFocus = () => refreshMaintenanceAccess(true);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus();
    };
    check();
    const interval = window.setInterval(check, 1000);
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', check);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', check);
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
    if (
      current === 'blocked' &&
      startedOutsideMaintenance.current &&
      !reloaded.current
    ) {
      reloaded.current = true;
      reload();
    }
  }, [current, reload]);

  // 재검증 중에는 기존 리자 화면을 잠시 숨겨 상태를 유지합니다.
  const showApp = !blocked || (current === 'checking' && admitted.current);
  return (
    <>
      {blocked && <MaintenancePage />}
      {showApp && (
        <div style={{ height: '100%' }} hidden={blocked}>
          {children}
        </div>
      )}
    </>
  );
}

// Axios는 점검 정책만 검사하고, 권한 조회는 기존 API 함수를 재사용합니다.
setMaintenanceRoleVerifier(async () => {
  const userInfo = await getMyPageUserInfo();
  return userInfo?.userRoleId;
});
