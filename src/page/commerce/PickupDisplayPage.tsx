import { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { FetchLoading } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import PickupArmedPanel from '@/feature/commerce/components/PickupArmedPanel';
import PickupConfirmedPanel from '@/feature/commerce/components/PickupConfirmedPanel';
import PickupIdlePanel from '@/feature/commerce/components/PickupIdlePanel';
import PickupPairingForm from '@/feature/commerce/components/PickupPairingForm';
import {
  usePickupDeviceHeartbeat,
  usePickupDevicePairing,
  usePickupDeviceSession,
  usePickupDeviceToken,
  usePickupSessionConfirm,
} from '@/feature/commerce/hooks';
import type {
  ConfirmPickupSessionResponse,
  PairPickupDeviceRequest,
} from '@/feature/commerce/types';
import { getCommerceErrorCode } from '@/feature/commerce/utils/saleDetail';

import styles from './PickupDisplayPage.module.css';

export default function PickupDisplayPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    deviceToken,
    heartbeatIntervalSeconds,
    registerPickupDevice,
    clearPickupDevice,
  } = usePickupDeviceToken();
  const { mutate: pairPickupDevice, isPending: isPairing } =
    usePickupDevicePairing();

  const {
    data: session,
    error: sessionError,
    isLoading,
  } = usePickupDeviceSession(deviceToken);

  const { mutate: sendHeartbeat } = usePickupDeviceHeartbeat();
  const { mutate: confirmPickupSession, isPending: isConfirming } =
    usePickupSessionConfirm();

  const [pairingErrorMessage, setPairingErrorMessage] = useState('');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [confirmedPickup, setConfirmedPickup] =
    useState<ConfirmPickupSessionResponse | null>(null);

  const clearSessionCache = useCallback(() => {
    queryClient.removeQueries({
      queryKey: QUERY_KEY.commercePickupDeviceSession,
    });
  }, [queryClient]);

  const handleDeviceUnauthorized = useCallback(() => {
    clearPickupDevice();
    clearSessionCache();
    setConfirmedPickup(null);
    setConnectionMessage('');
    setPairingErrorMessage('단말 인증이 만료되었어요. 다시 페어링해주세요.');
  }, [clearPickupDevice, clearSessionCache]);

  const handleClearDevice = () => {
    clearPickupDevice();
    clearSessionCache();
    setConfirmedPickup(null);
    setConnectionMessage('');
    setPairingErrorMessage('');
  };

  const handlePairingSubmit = (request: PairPickupDeviceRequest) => {
    setPairingErrorMessage('');

    pairPickupDevice(request, {
      onSuccess: (pairedDevice) => {
        registerPickupDevice(pairedDevice);
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.commercePickupDeviceSession,
        });
      },
      onError: (error) => {
        const errorCode = getCommerceErrorCode(error);

        if (errorCode === 7067) {
          setPairingErrorMessage('페어링 코드가 올바르지 않거나 만료되었어요.');
          return;
        }

        if (errorCode === 7068) {
          setPairingErrorMessage(
            '페어링 요청이 너무 많아요. 잠시 후 다시 시도해주세요.'
          );
          return;
        }

        setPairingErrorMessage('단말 페어링에 실패했어요.');
      },
    });
  };

  const handleConfirmPickup = () => {
    if (!deviceToken) return;

    confirmPickupSession(deviceToken, {
      onSuccess: (pickup) => {
        setConfirmedPickup(pickup);
      },
      onError: (error) => {
        const errorCode = getCommerceErrorCode(error);

        switch (errorCode) {
          case 7062:
            handleDeviceUnauthorized();
            toast({ message: '단말 인증에 실패했어요.', variant: 'error' });
            break;
          case 7063:
            toast({ message: '표시 중인 주문이 없어요.', variant: 'error' });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEY.commercePickupDeviceSession,
            });
            break;
          case 7064:
            toast({
              message: '수령 확인 시간이 지났어요.',
              variant: 'error',
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEY.commercePickupDeviceSession,
            });
            break;
          case 7066:
            toast({ message: '이미 종료된 세션입니다.', variant: 'error' });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEY.commercePickupDeviceSession,
            });
            break;
          case 7045:
            toast({ message: '운영자에게 확인해주세요.', variant: 'error' });
            break;
          case 7046:
            toast({
              message: '이미 수령 완료된 주문입니다.',
              variant: 'error',
            });
            break;
          default:
            toast({ message: '수령 확인에 실패했어요.', variant: 'error' });
        }
      },
    });
  };

  useEffect(() => {
    if (!sessionError) return;

    const errorCode = getCommerceErrorCode(sessionError);

    if (errorCode === 7062) {
      handleDeviceUnauthorized();
      return;
    }

    setConnectionMessage('수령 세션 상태를 불러오지 못했어요.');
  }, [handleDeviceUnauthorized, sessionError]);

  useEffect(() => {
    if (session) {
      setConnectionMessage('');
    }
  }, [session]);

  useEffect(() => {
    if (!deviceToken) return;

    const handleHeartbeat = () => {
      sendHeartbeat(deviceToken, {
        onSuccess: () => {
          setConnectionMessage('');
        },
        onError: (error) => {
          const errorCode = getCommerceErrorCode(error);

          if (errorCode === 7062) {
            handleDeviceUnauthorized();
            return;
          }

          setConnectionMessage('서버 연결 상태를 확인 중이에요.');
        },
      });
    };

    handleHeartbeat();

    const heartbeatIntervalId = window.setInterval(
      handleHeartbeat,
      heartbeatIntervalSeconds * 1000
    );

    return () => {
      window.clearInterval(heartbeatIntervalId);
    };
  }, [
    deviceToken,
    handleDeviceUnauthorized,
    heartbeatIntervalSeconds,
    sendHeartbeat,
  ]);

  useEffect(() => {
    if (!confirmedPickup) return;

    const resetTimeoutId = window.setTimeout(() => {
      setConfirmedPickup(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.commercePickupDeviceSession,
      });
    }, confirmedPickup.autoResetSeconds * 1000);

    return () => {
      window.clearTimeout(resetTimeoutId);
    };
  }, [confirmedPickup, queryClient]);

  if (!deviceToken) {
    return (
      <div className={styles.container}>
        <PickupPairingForm
          isPairing={isPairing}
          errorMessage={pairingErrorMessage}
          onSubmit={handlePairingSubmit}
        />
      </div>
    );
  }

  if (confirmedPickup) {
    return (
      <div className={styles.container}>
        <PickupConfirmedPanel pickup={confirmedPickup} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <section className={styles.panel} aria-live='polite'>
          <FetchLoading>수령 화면 불러오는 중...</FetchLoading>
        </section>
      </div>
    );
  }

  if (session?.state === 'ARMED') {
    return (
      <div className={styles.container}>
        <PickupArmedPanel
          session={session}
          isConfirming={isConfirming}
          onConfirm={handleConfirmPickup}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PickupIdlePanel
        connectionMessage={connectionMessage}
        onClearDevice={handleClearDevice}
      />
    </div>
  );
}
