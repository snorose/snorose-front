import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { confirmPickupSession } from '@/feature/commerce/apis';

export default function usePickupSessionConfirm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPickupSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.commercePickupDeviceSession,
      });
    },
  });
}
