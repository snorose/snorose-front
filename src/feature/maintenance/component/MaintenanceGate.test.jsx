/* eslint-disable testing-library/no-node-access -- Verify separately managed modal/toast portal roots. */
import { StrictMode } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  MAINTENANCE_END,
  MAINTENANCE_START,
  setMaintenanceTestTime,
} from '@/feature/maintenance/testClock';

import {
  invalidateMaintenanceSession,
  refreshMaintenanceAccess,
  setMaintenanceRoleVerifier,
} from '../access';
import MaintenanceGate from './MaintenanceGate';
jest.mock('../status', () => ({ refreshMaintenanceStatus: jest.fn() }));

jest.mock('@/page/maintenance', () => ({
  MaintenancePage: () => <h1>서버 점검 안내</h1>,
}));

describe('MaintenanceGate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setMaintenanceTestTime(MAINTENANCE_START.getTime() - 1000);
    localStorage.clear();
    invalidateMaintenanceSession();
    setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(2));
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

  it('blocks an existing non-admin tab without reload, including Strict Mode', async () => {
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
      setMaintenanceTestTime(MAINTENANCE_START);
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.getByRole('heading', { name: '서버 점검 안내' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: '서비스' })
    ).not.toBeInTheDocument();
    expect(document.getElementById('modal').hidden).toBe(true);
    expect(reload).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    fireEvent.focus(window);
    expect(reload).not.toHaveBeenCalled();
  });

  it('does not reload a tab first opened during maintenance', async () => {
    setMaintenanceTestTime(MAINTENANCE_START);
    invalidateMaintenanceSession();
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

  it('lets a verified admin continue without reloading', async () => {
    localStorage.setItem('accessToken', 'admin');
    setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(4));
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    await act(async () => {
      setMaintenanceTestTime(MAINTENANCE_START);
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('button')).toBeVisible();
    expect(reload).not.toHaveBeenCalled();
    fireEvent.focus(window);
    await act(async () => {
      await refreshMaintenanceAccess();
    });
    expect(screen.getByRole('button')).toBeVisible();
    expect(reload).not.toHaveBeenCalled();
  });

  it('checks the clock on focus even before the delayed timer runs', async () => {
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    setMaintenanceTestTime(MAINTENANCE_START.getTime() + 60000);
    fireEvent.focus(window);
    await act(async () => {
      await refreshMaintenanceAccess();
    });
    expect(screen.getByRole('heading')).toBeVisible();
    expect(reload).not.toHaveBeenCalled();
  });

  it('restores the normal screen after maintenance ends', async () => {
    setMaintenanceTestTime(MAINTENANCE_START);
    invalidateMaintenanceSession();
    const reload = jest.fn();
    render(
      <MaintenanceGate reload={reload}>
        <button>서비스</button>
      </MaintenanceGate>
    );
    setMaintenanceTestTime(MAINTENANCE_END.getTime() + 1);
    fireEvent.focus(window);
    await act(async () => {
      await refreshMaintenanceAccess();
    });
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
    setMaintenanceTestTime(MAINTENANCE_START);
    fireEvent.focus(window);
    await act(async () => {
      setMaintenanceTestTime(MAINTENANCE_START);
      jest.advanceTimersByTime(1000);
    });
    expect(reload).not.toHaveBeenCalled();
  });
});
