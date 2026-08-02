import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout } from '@/feature/auth/apis';
import { activateSession, clearAuthTokens } from '@/feature/auth/libs';

import { UseMutationCallbacks } from '@/types';

export function useLogin(callbacks?: UseMutationCallbacks) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }

      const accessToken = data.tokenResponse.accessToken;

      activateSession(accessToken);
      navigate('/');
    },
    onError: (error) => {
      if (callbacks?.onError) {
        callbacks.onError(error);
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
