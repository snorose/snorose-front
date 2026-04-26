import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { useAuth } from '@/shared/hook';
import { BackAppBar, FetchLoading } from '@/shared/component';

import {
  PointLogList,
  PointLogListErrorFallback,
} from '@/feature/my/component';

import { ReactComponent as PointCircleBlue } from '@/assets/images/pointCircleBlue.svg';

import styles from './PointLogListPage.module.css';

export default function PointLogListPage() {
  const { userInfo } = useAuth({
    isRequiredAuth: true,
  });

  return (
    <section className={styles.container}>
      <BackAppBar />

      <div className={styles.contentWrapper}>
        <div className={styles.topContainer}>
          <h1 className={styles.title}>보유 포인트</h1>
          <div className={styles.totalPointWrapper}>
            <PointCircleBlue
              role='img'
              aria-label='총 포인트'
              focusable='false'
            />
            <span className={styles.totalPoints}>
              {userInfo?.balance.toLocaleString()}
            </span>
          </div>
        </div>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={PointLogListErrorFallback}
            >
              <Suspense fallback={<FetchLoading>불러오는 중</FetchLoading>}>
                <PointLogList />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </section>
  );
}
