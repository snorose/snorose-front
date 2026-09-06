import { Link } from 'react-router-dom';

import { IllustrationNotFound } from '@snorose/icons';

import { PrimaryButton } from '@/shared/component';

import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.main}>
      <div className={styles.illustrationWrapper}>
        <IllustrationNotFound
          className={styles.illustration}
          role='img'
          aria-label='404 일러스트'
        />
        <p className={styles.text}>페이지를 찾을 수 없어요</p>
      </div>

      <Link className={styles.button} to='/'>
        <PrimaryButton>메인으로</PrimaryButton>
      </Link>
    </main>
  );
}
