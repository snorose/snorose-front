import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

import { ShimmerEffect } from '@/shared/component';

import { BannerGA } from '@/feature/advertisement/component';
import { useBannerByPage } from '@/feature/advertisement/hook';

import defaultBanner from '@/assets/images/bannerError.svg';

import styles from './AdSlot.module.css';

export default function AdSlot({ page }: { page: string }) {
  return (
    <ErrorBoundary resetKeys={[page]} fallback={<BannerFallback />}>
      <Suspense fallback={<BannerSkeleton />}>
        <AdContent page={page} />
      </Suspense>
    </ErrorBoundary>
  );
}

function AdContent({ page }: { page: string }) {
  const { data: banner } = useBannerByPage(page);

  return (
    <BannerGA key={banner.bannerId} {...banner}>
      <Link to={banner.redirectUrl}>
        <Banner imageUrl={banner.imageUrl} alt={banner.bannerName} />
      </Link>
    </BannerGA>
  );
}

function Banner({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return (
    <div className={styles.banner}>
      <img
        src={imageUrl}
        alt={alt}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = defaultBanner;
        }}
      />
    </div>
  );
}

function BannerFallback() {
  return (
    <div className={styles.banner}>
      <img src={defaultBanner} alt='배너를 불러올 수 없습니다.' />
    </div>
  );
}

function BannerSkeleton() {
  return (
    <ShimmerEffect>
      <div className={styles.banner} />
    </ShimmerEffect>
  );
}
