import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout } from '@/feature/auth/apis';
import { activateSession, clearAuthTokens } from '@/feature/auth/libs';

import { UseMutationCallbacks } from '@/types';

type UseLoginOptions = UseMutationCallbacks & {
  redirectTo?: string;
};

export function useLogin(options?: UseLoginOptions) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }

      const accessToken = data.tokenResponse.accessToken;

      activateSession(accessToken);
      navigate(options?.redirectTo ?? '/', { replace: true });
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}

export function useLogout(callbacks?: UseMutationCallbacks) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    meta: {
      skipGlobalError: true,
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    },
    onError: (error) => {
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    },
    onSettled: () => {
      if (callbacks?.onSettled) {
        callbacks.onSettled();
      }

      clearAuthTokens();
      queryClient.clear();

      navigate('/', { replace: true });
    },
  });
}
