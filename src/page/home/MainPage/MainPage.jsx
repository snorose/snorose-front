import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import {
  Carousel,
  CarouselErrorFallback,
  CarouselSkeleton,
  Footer,
  Header,
  Icon,
} from '@/shared/component';
import { NEW_ROUTES } from '@/shared/constant';
import { useAuth } from '@/shared/hook';

import {
  HomeBesookt,
  HomeBesooktErrorFallback,
  HomeBesooktSkeleton,
  HomeCard,
  HomeCardErrorFallback,
  HomeCardSkeleton,
  HomeCommunity,
  ListHeader,
  PopUp,
  Slide,
} from '@/feature/home/component';
import { useBanner } from '@/feature/home/hook';
import { Search } from '@/feature/search/component';

import styles from './MainPage.module.css';

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
              <Banner />
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
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      {new Date() > new Date('2026-09-02T10:00:00') && (
        <Link to={'/commerce/sales/1'} className={styles.direct}>
          <div className={styles.item}>
            <span>판매 바로가기</span>
            <span>청파제 굿즈를 주문하세요</span>
          </div>
          <Icon
            id='angle-right'
            width={24}
            height={24}
            fill='#898989'
            stroke='#898989'
          />
        </Link>
      )}

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

function Banner() {
  const { data: items } = useBanner();

  return (
    <Carousel
      className={styles.banner}
      items={items}
      renderItem={({ imageUrl, redirectUrl }) => (
        <Slide src={imageUrl} redirectUrl={redirectUrl} alt='banner' />
      )}
    />
  );
}
