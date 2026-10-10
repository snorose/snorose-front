import { StrictMode } from 'react';

import { act, cleanup, renderHook, screen } from '@testing-library/react';

import { ToastProvider } from '@/shared/context/ToastContext';

import useToast from './useToast';

// Keep the actual provider, hook and Toast; isolate only unrelated barrel exports/icons.
jest.mock('@/shared/component', () => ({
  Toast: jest.requireActual('@/shared/component/Toast/Toast').default,
}));
jest.mock('@/shared/hook', () => ({
  useToast: jest.requireActual('./useToast').default,
}));
jest.mock(
  '@snorose/icons',
  () => ({
    IconMultiCheckGreenCircle: () => <svg aria-label='success' />,
    IconMultiExclamationTriangle: () => <svg aria-label='error' />,
    IconMultiInfoCircle: () => <svg aria-label='info' />,
  }),
  { virtual: true }
);

function wrapper({ children }) {
  return (
    <StrictMode>
      <ToastProvider>{children}</ToastProvider>
    </StrictMode>
  );
}

let portal;

beforeEach(() => {
  jest.useFakeTimers();
  portal = document.createElement('div');
  portal.id = 'toast';
  document.body.appendChild(portal);
});

afterEach(() => {
  cleanup();
  portal.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
});

it.each(['success', 'error', 'info'])(
  '%s displays the message and dismisses after 3.5 seconds',
  (variant) => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => result.current.toast[variant]('테스트 메시지'));
    expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
    expect(screen.getByLabelText(variant)).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(3499));
    expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(1));
    expect(screen.queryByText('테스트 메시지')).not.toBeInTheDocument();
  }
);

it('keeps one copy of a message when called repeatedly before a render', () => {
  const { result } = renderHook(() => useToast(), { wrapper });
  act(() => {
    result.current.toast.success('같은 메시지');
    result.current.toast.error('같은 메시지');
    result.current.toast.info('같은 메시지');
  });
  expect(screen.getAllByText('같은 메시지')).toHaveLength(1);
  expect(screen.getByLabelText('info')).toBeInTheDocument();
  expect(screen.queryByLabelText('success')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('error')).not.toBeInTheDocument();
});

it('restarts a replaced message timer without extending other messages', () => {
  const { result } = renderHook(() => useToast(), { wrapper });
  act(() => {
    result.current.toast.success('다시 표시');
    result.current.toast.info('다른 메시지');
  });
  act(() => jest.advanceTimersByTime(2000));
  act(() => result.current.toast.error('다시 표시'));
  expect(screen.getAllByText('다시 표시')).toHaveLength(1);
  act(() => jest.advanceTimersByTime(1500));
  expect(screen.queryByText('다른 메시지')).not.toBeInTheDocument();
  expect(screen.getByText('다시 표시')).toBeInTheDocument();
  expect(screen.getByLabelText('error')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1999));
  expect(screen.getByText('다시 표시')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1));
  expect(screen.queryByText('다시 표시')).not.toBeInTheDocument();
});
