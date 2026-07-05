import { useNavigate } from 'react-router';

import { useMutation } from '@tanstack/react-query';

import { login } from '@/apis/auth';

import { UseMutationCallbacks } from '@/types';

export const useLogin = (callbacks: UseMutationCallbacks) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (callbacks.onSuccess) {
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
};
