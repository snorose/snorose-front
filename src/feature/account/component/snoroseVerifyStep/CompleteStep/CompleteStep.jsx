import { Link } from 'react-router-dom';

import { IllustrationTaskComplete } from '@snorose/icons';

import { PrimaryButton } from '@/shared/component';

import styles from './CompleteStep.module.css';

export default function CompleteStep() {
  return (
    <section className={styles.content}>
      <div className={styles.illustration}>
        <IllustrationTaskComplete role='img' aria-label='인증 신청 완료' />
      </div>

      <Link to='/'>
        <PrimaryButton className={styles.button}>메인 페이지로</PrimaryButton>
      </Link>
    </section>
  );
}
