import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Footer, Header } from '@/shared/component';
import {
  Carousel,
  CarouselErrorFallback,
  CarouselSkeleton,
  PopUp,
  HomeBesookt,
  HomeBesooktErrorFallback,
  HomeBesooktSkeleton,
  HomeCard,
  NewHomeCard,
  HomeCardErrorFallback,
  HomeCardSkeleton,
  HomeCommunity,
  ListHeader,
} from '@/feature/home/component';

import styles from './MainPage.module.css';

/**
 * TODO: 라우트 개선 작업 완료 후 HomeCard 교체
 */
export default function MainPage() {
  return (
    <main>
      <Header className={styles.header} />

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={CarouselErrorFallback}
          >
            <Suspense fallback={<CarouselSkeleton />}>
              <Carousel className={styles.carousel} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={HomeCardErrorFallback}
          >
            <Suspense fallback={<HomeCardSkeleton />}>
              <HomeCard />
              {/* <NewHomeCard /> */}
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <ListHeader to='/board' title='게시판' />
      <HomeCommunity />

      <ListHeader to='/board/besookt' title='베숙트' />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={HomeBesooktErrorFallback}
          >
            <Suspense fallback={<HomeBesooktSkeleton />}>
              <HomeBesookt />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <Footer />
      <PopUp />
    </main>
  );
}
