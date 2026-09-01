import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { readPickupDeviceSession } from '@/feature/commerce/apis';
import type { PickupDeviceSessionResponse } from '@/feature/commerce/types';

const PICKUP_SESSION_POLLING_INTERVAL_MS = 2000;

export default function usePickupDeviceSession(deviceToken: string | null) {
  return useQuery<PickupDeviceSessionResponse>({
    queryKey: QUERY_KEY.commercePickupDeviceSession,
    queryFn: () => readPickupDeviceSession(deviceToken!),
    enabled: Boolean(deviceToken),
    retry: false,
    refetchInterval: deviceToken ? PICKUP_SESSION_POLLING_INTERVAL_MS : false,
    refetchOnWindowFocus: false,
  });
}
