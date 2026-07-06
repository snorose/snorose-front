import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant/reactQuery';

import { logout } from '@/feature/auth/api';

import { UseMutationCallbacks } from '@/types';

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
