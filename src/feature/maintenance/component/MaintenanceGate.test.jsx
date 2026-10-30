/* eslint-disable testing-library/no-node-access -- Verify separately managed modal/toast portal roots. */
import { StrictMode } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { syncMaintenanceAccess } from '../access';
import { MAINTENANCE_END, MAINTENANCE_START } from '../config';
import MaintenanceGate from './MaintenanceGate';

jest.mock('@/page/maintenance', () => ({
  MaintenancePage: () => <h1>서버 점검 안내</h1>,
}));

describe('MaintenanceGate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1000);
    localStorage.clear();
    syncMaintenanceAccess();
    ['modal', 'toast'].forEach((id) => {
      const element = document.createElement('div');
      element.id = id;
      document.body.appendChild(element);
    });
  });
  afterEach(() => {
    ['modal', 'toast'].forEach((id) => document.getElementById(id)?.remove());
    jest.useRealTimers();
  });

  it('reloads an existing tab exactly once, including Strict Mode', async () => {
    const reload = jest.fn();
    render(
      <StrictMode>
        <MaintenanceGate reload={reload}>
          <button>서비스</button>
        </MaintenanceGate>
      </StrictMode>
    );
    expect(screen.getByRole('button', { name: '서비스' })).toBeVisible();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.getByRole('heading', { name: '서버 점검 안내' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: '서비스' })
    ).not.toBeInTheDocument();
    expect(document.getElementById('modal').hidden).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    fireEvent.focus(window);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload a tab first opened during maintenance', async () => {
    jest.setSystemTime(MAINTENANCE_START);
    syncMaintenanceAccess();
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    expect(screen.getByRole('heading')).toHaveTextContent('서버 점검 안내');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });

  it('also blocks an existing admin session without an exception', async () => {
    localStorage.setItem('accessToken', 'admin');
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('heading')).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(reload).toHaveBeenCalledTimes(1);
    fireEvent.focus(window);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('checks the clock on focus even before the delayed timer runs', async () => {
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    jest.setSystemTime(MAINTENANCE_START.getTime() + 60000);
    fireEvent.focus(window);
    expect(screen.getByRole('heading')).toBeVisible();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('restores the normal screen after maintenance ends', async () => {
    jest.setSystemTime(MAINTENANCE_START);
    syncMaintenanceAccess();
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    jest.setSystemTime(MAINTENANCE_END.getTime() + 1);
    fireEvent.focus(window);
    expect(screen.getByRole('button')).toBeVisible();
    expect(document.getElementById('modal').hidden).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('removes timer and listeners on unmount', async () => {
    const reload = jest.fn();
    const { unmount } = render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    unmount();
    jest.setSystemTime(MAINTENANCE_START);
    fireEvent.focus(window);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(reload).not.toHaveBeenCalled();
  });
});
