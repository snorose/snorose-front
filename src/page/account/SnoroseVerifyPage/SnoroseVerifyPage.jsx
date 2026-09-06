import { useState } from 'react';

import { IconCheck } from '@snorose/icons';

import { BackAppBar } from '@/shared/component';

import {
  CompleteStep,
  TermsStep,
  VerifyStep,
} from '@/feature/account/component';
import { TITLE_DES } from '@/feature/account/constant';

import styles from './SnoroseVerifyPage.module.css';

export default function SnoroseVerifyPage() {
  const [step, setStep] = useState('terms');
  const { title, description } = TITLE_DES[step];

  return (
    <dev className={styles.container}>
      <BackAppBar title='인증 신청' notFixed />

      {step === 'complete' ? (
        <IconCheck
          width='2.4rem'
          height='2.4rem'
          className={styles.icon}
        />
      ) : (
        <div className={styles.indicator}>
          <span
            className={`${styles.dot} ${step === 'terms' && styles.select}`}
          ></span>
          <span
            className={`${styles.dot} ${step === 'verify' && styles.select}`}
          ></span>
        </div>
      )}

      <div className={styles.title}>{title}</div>

      {description && <div className={styles.description}>{description}</div>}

      {step === 'terms' && <TermsStep setStep={setStep} />}
      {step === 'verify' && <VerifyStep setStep={setStep} />}
      {step === 'complete' && <CompleteStep />}
    </dev>
  );
}
