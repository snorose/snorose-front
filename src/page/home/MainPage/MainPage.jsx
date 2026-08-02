import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { Footer, Header } from '@/shared/component';
import { NEW_ROUTES } from '@/shared/constant';
import { useAuth } from '@/shared/hook';

import {
  Carousel,
  CarouselErrorFallback,
  CarouselSkeleton,
  HomeBesookt,
  HomeBesooktErrorFallback,
  HomeBesooktSkeleton,
  HomeCard,
  HomeCardErrorFallback,
  HomeCardSkeleton,
  HomeCommunity,
  ListHeader,
  PopUp,
} from '@/feature/home/component';
import { Search } from '@/feature/search/component';

import styles from './MainPage.module.css';

/**
 * TODO: 라우트 개선 작업 완료 후 HomeCard 교체
 */
export default function MainPage() {
  const auth = useAuth();

  return (
    <div>
      <Header className={styles.header} />

      <div className={styles.search}>
        <Search placeholder='전체 게시판 내 검색' to='/board/all/search' />
      </div>

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

      <ListHeader to={NEW_ROUTES.boardHome} title='게시판' />
      <HomeCommunity />

      <ListHeader to={NEW_ROUTES.post.list('besookt')} title='베숙트' />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            resetKeys={[auth.status, auth.userInfo?.userRoleId]}
            FallbackComponent={HomeBesooktErrorFallback}
          >
            <Suspense fallback={<HomeBesooktSkeleton />}>
              <HomeBesookt auth={auth} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <Footer />
      <PopUp />
    </div>
  );
}
