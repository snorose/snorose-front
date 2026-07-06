import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant/reactQuery';

import { login, logout } from '@/feature/auth/apis';

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

      localStorage.setItem('accessToken', accessToken);
      navigate('/');
    },
    onError: (error) => {
      if (callbacks.onError) {
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

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.removeQueries({ queryKey: [QUERY_KEY.userInfo] });

      navigate('/', { replace: true });
    },
  });
}
