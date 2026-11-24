import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { act, render } from '@testing-library/react';

import { ModalProvider } from '@/shared/context/ModalContext';

import {
  invalidateMaintenanceSession,
  refreshMaintenanceAccess,
  setMaintenanceRoleVerifier,
} from '@/feature/maintenance/access';
import {
  MAINTENANCE_START,
  setMaintenanceTestTime,
} from '@/feature/maintenance/testClock';

import useBlocker from './useBlocker';

function WritingPage() {
  useBlocker(true);
  return <div>작성 중</div>;
}

function beforeUnload() {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}

describe('writing page beforeunload during maintenance', () => {
  let router;
  beforeEach(() => {
    jest.useFakeTimers();
    setMaintenanceTestTime(MAINTENANCE_START.getTime() - 1);
    localStorage.clear();
    invalidateMaintenanceSession();
    router = createMemoryRouter([{ path: '/', element: <WritingPage /> }]);
  });
  afterEach(() => {
    router.dispose();
    jest.useRealTimers();
  });

  it('protects drafts normally but does not obstruct maintenance reload', () => {
    render(
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    );
    expect(beforeUnload()).toBe(true);
    setMaintenanceTestTime(MAINTENANCE_START);
    expect(beforeUnload()).toBe(false);
  });

  it('keeps the usual confirmation for verified admins', async () => {
    render(
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    );
    setMaintenanceTestTime(MAINTENANCE_START);
    localStorage.setItem('accessToken', 'admin');
    setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(4));
    await act(async () => {
      await refreshMaintenanceAccess();
    });
    expect(beforeUnload()).toBe(true);
  });
});
