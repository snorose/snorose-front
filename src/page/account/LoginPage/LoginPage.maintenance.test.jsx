import { MemoryRouter } from 'react-router-dom';

import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  invalidateMaintenanceSession,
  refreshMaintenanceAccess,
  setMaintenanceRoleVerifier,
} from '@/feature/maintenance/access';
import MaintenanceGate from '@/feature/maintenance/component/MaintenanceGate';
import {
  MAINTENANCE_END,
  MAINTENANCE_START,
} from '@/feature/maintenance/config';

import Login from './LoginPage';

jest.mock(
  '@snorose/icons',
  () => ({
    IconMultiCheckBlueCircle: () => null,
    IconMultiCheckGreyCircle: () => null,
    IllustrationLogoSnoroseCloud: () => null,
  }),
  { virtual: true }
);
jest.mock('@/shared/component', () => ({
  BackAppBar: () => null,
  NewButton: ({ children }) => <button>{children}</button>,
  PasswordInput: () => null,
  TextInput: () => null,
}));
jest.mock('@/shared/hook', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));
jest.mock('@/feature/auth/hooks', () => ({
  useLogin: () => ({ mutate: jest.fn() }),
}));
jest.mock('@/page/maintenance', () => ({
  MaintenancePage: () => <h1>서버 점검 안내</h1>,
}));

describe('maintenance on an already logged-in admin login page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    localStorage.setItem('accessToken', 'admin');
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1000);
    invalidateMaintenanceSession();
    setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(4));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  function renderLogin() {
    render(
      <MaintenanceGate reload={jest.fn()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MaintenanceGate>
    );
  }

  it('hides the existing login form when maintenance starts', async () => {
    renderLogin();
    expect(screen.getByRole('button', { name: '로그인하기' })).toBeVisible();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.getByRole('heading', { name: '서버 점검 안내' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: '로그인하기' })
    ).not.toBeInTheDocument();
  });

  it('restores the login form after maintenance ends without navigation', async () => {
    jest.setSystemTime(MAINTENANCE_START);
    await refreshMaintenanceAccess();
    renderLogin();
    expect(
      screen.getByRole('heading', { name: '서버 점검 안내' })
    ).toBeVisible();
    jest.setSystemTime(MAINTENANCE_END.getTime() + 1);
    fireEvent.focus(window);
    expect(screen.getByRole('button', { name: '로그인하기' })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: '서버 점검 안내' })
    ).not.toBeInTheDocument();
  });
});
