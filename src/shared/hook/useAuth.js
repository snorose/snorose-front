import { useMemo } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY, TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { useLogout } from '@/feature/auth/hooks';

import { getMyPageUserInfo, withdrawAccount } from '@/apis';

const useAuth = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();
  const { toast } = useToast();

  const hasToken = !!localStorage.getItem('accessToken');

  const {
    data: userInfo,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: [QUERY_KEY.userInfo],
    queryFn: getMyPageUserInfo,
    enabled: hasToken,
    staleTime: 1000 * 60 * 60 * 7,
    gcTime: 1000 * 60 * 60 * 7,
  });

  const status = useMemo(() => {
    if (isFetching) {
      return 'loading';
    }

    if (isSuccess) {
      return 'authenticated';
    }

    return 'unauthenticated';
  }, [isFetching, isSuccess]);

  const withdraw = async (currentPassword, { onSuccess, onError } = {}) => {
    try {
      await withdrawAccount({
        currentPassword,
      });
      toast({ message: TOAST.USER.withdraw, variant: 'success' });
      logout();

      if (onSuccess !== undefined) {
        onSuccess();
      }
    } catch ({ response }) {
      toast({ message: response.data.message, variant: 'error' });

      if (onError !== undefined) {
        onError();
      }
    }
  };

  const invalidUserInfoQuery = () => {
    queryClient.invalidateQueries([QUERY_KEY.userInfo]);
  };

  return {
    userInfo,
    status,
    withdraw,
    invalidUserInfoQuery,
  };
};

export default useAuth;
