import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { render } from '@testing-library/react';

import { ModalProvider } from '@/shared/context/ModalContext';

import { syncMaintenanceAccess } from '@/feature/maintenance/access';
import {
  MAINTENANCE_END,
  MAINTENANCE_START,
} from '@/feature/maintenance/config';

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
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1);
    localStorage.clear();
    syncMaintenanceAccess();
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
    jest.setSystemTime(MAINTENANCE_START);
    expect(beforeUnload()).toBe(false);
  });

  it('bypasses confirmation for admin sessions too and restores it after maintenance', () => {
    render(
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    );
    jest.setSystemTime(MAINTENANCE_START);
    localStorage.setItem('accessToken', 'admin');
    expect(beforeUnload()).toBe(false);
    jest.setSystemTime(MAINTENANCE_END.getTime() + 1);
    expect(beforeUnload()).toBe(true);
  });
});
