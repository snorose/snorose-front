import { useCallback, useState } from 'react';

import type { PairPickupDeviceResponse } from '@/feature/commerce/types';

const PICKUP_DEVICE_TOKEN_STORAGE_KEY = 'commercePickupDeviceToken';
const PICKUP_DEVICE_HEARTBEAT_INTERVAL_STORAGE_KEY =
  'commercePickupDeviceHeartbeatIntervalSeconds';
const DEFAULT_HEARTBEAT_INTERVAL_SECONDS = 30;

export default function usePickupDeviceToken() {
  const [deviceToken, setDeviceToken] = useState<string | null>(() =>
    getStoredDeviceToken()
  );
  const [heartbeatIntervalSeconds, setHeartbeatIntervalSeconds] =
    useState<number>(() => getStoredHeartbeatIntervalSeconds());

  const registerPickupDevice = useCallback(
    ({ deviceToken, heartbeatIntervalSeconds }: PairPickupDeviceResponse) => {
      setDeviceToken(deviceToken);
      setHeartbeatIntervalSeconds(heartbeatIntervalSeconds);
      sessionStorage.setItem(PICKUP_DEVICE_TOKEN_STORAGE_KEY, deviceToken);
      sessionStorage.setItem(
        PICKUP_DEVICE_HEARTBEAT_INTERVAL_STORAGE_KEY,
        String(heartbeatIntervalSeconds)
      );
    },
    []
  );

  const clearPickupDevice = useCallback(() => {
    setDeviceToken(null);
    setHeartbeatIntervalSeconds(DEFAULT_HEARTBEAT_INTERVAL_SECONDS);
    sessionStorage.removeItem(PICKUP_DEVICE_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(PICKUP_DEVICE_HEARTBEAT_INTERVAL_STORAGE_KEY);
  }, []);

  return {
    deviceToken,
    heartbeatIntervalSeconds,
    isPaired: Boolean(deviceToken),
    registerPickupDevice,
    clearPickupDevice,
  };
}

function getStoredDeviceToken() {
  return sessionStorage.getItem(PICKUP_DEVICE_TOKEN_STORAGE_KEY);
}

function getStoredHeartbeatIntervalSeconds() {
  const storedInterval = Number(
    sessionStorage.getItem(PICKUP_DEVICE_HEARTBEAT_INTERVAL_STORAGE_KEY)
  );

  return Number.isFinite(storedInterval) && storedInterval > 0
    ? storedInterval
    : DEFAULT_HEARTBEAT_INTERVAL_SECONDS;
}
