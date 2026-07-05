import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '@/apis/auth';

import { QUERY_KEY } from '@/shared/constant/reactQuery';

import { UseMutationCallbacks } from '@/types';

export function useLogout(callbacks?: UseMutationCallbacks) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.removeQueries({ queryKey: [QUERY_KEY.userInfo] });
      navigate('/');
    },
    onError: (error) => {
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    },
  });
}
