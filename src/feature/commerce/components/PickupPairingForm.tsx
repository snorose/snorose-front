import { type FormEvent, useState } from 'react';

import {
  Label,
  NumberInput,
  PrimaryButton,
  TextInput,
} from '@/shared/component';

import type { PairPickupDeviceRequest } from '@/feature/commerce/types';

import styles from '@/page/commerce/PickupDisplayPage.module.css';

type PickupPairingFormProps = {
  isPairing: boolean;
  errorMessage?: string;
  onSubmit: (request: PairPickupDeviceRequest) => void;
};

export default function PickupPairingForm({
  isPairing,
  errorMessage,
  onSubmit,
}: PickupPairingFormProps) {
  const [pairingCode, setPairingCode] = useState('');
  const [deviceLabel, setDeviceLabel] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      pairingCode: pairingCode.trim(),
      deviceLabel: deviceLabel.trim(),
    });
  };

  const isSubmitDisabled =
    isPairing || pairingCode.trim().length === 0 || deviceLabel.trim() === '';

  return (
    <form className={styles.pairingForm} onSubmit={handleSubmit}>
      <div className={styles.statusBadge}>단말 페어링</div>
      <div className={styles.panelHeader}>
        <h1 className={styles.title}>수령 확인 단말</h1>
        <p className={styles.description}>운영자가 발급한 코드가 필요해요.</p>
      </div>

      <div className={styles.fieldList}>
        <div className={styles.field}>
          <Label htmlFor='pickupPairingCode'>페어링 코드</Label>
          <NumberInput
            id='pickupPairingCode'
            placeholder='6자리 숫자'
            value={pairingCode}
            onChange={setPairingCode}
            maxLength={6}
            status={errorMessage ? 'error' : 'default'}
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor='pickupDeviceLabel'>단말 이름</Label>
          <TextInput
            id='pickupDeviceLabel'
            placeholder='예: 명신관 1층 iPad'
            value={deviceLabel}
            onChange={setDeviceLabel}
          />
        </div>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <PrimaryButton
        className={styles.primaryButton}
        disabled={isSubmitDisabled}
        type='submit'
        onClick={() => {}}
      >
        {isPairing ? '페어링 중...' : '페어링하기'}
      </PrimaryButton>
    </form>
  );
}
