import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { BackAppBar, FetchLoading } from '@/shared/component';
import { flatPaginationCache } from '@/shared/lib';

import { PostListErrorFallback } from '@/feature/board/component';
import OrderItem from '@/feature/commerce/components/OrderItem';
import useOrders from '@/feature/commerce/hooks/useOrders';
import type { OrdersResponse } from '@/feature/commerce/types';

import { noPostsIllustration } from '@/assets/illustrations';

import styles from './OrderListPage.module.css';

export default function OrderListPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={PostListErrorFallback}
        >
          <Suspense
            fallback={<FetchLoading>주문 내역 불러오는 중...</FetchLoading>}
          >
            <OrderListView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function OrderListView() {
  const { data, ref, isFetching } = useOrders();
  const orders: OrdersResponse['data'] = flatPaginationCache(data);

  if (orders.length === 0) {
    return (
      <div className={styles.noContentWrapper}>
        <p className={styles.noContentMessage}>아직 주문한 상품이 없어요</p>
        <div className={styles.imageWrapper}>
          <img
            src={noPostsIllustration}
            width={220}
            height={182}
            alt='주문 목록이 없음'
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BackAppBar title='내 주문 목록' backNavTo={'/my-page'} />

      <div className={styles.orderList}>
        {orders.map((order, index) => (
          <Link
            key={order.orderNumber}
            to={order.orderNumber}
            ref={index === orders.length - 1 ? ref : undefined}
          >
            <OrderItem {...order} />
          </Link>
        ))}
        {isFetching && <FetchLoading />}
      </div>
    </div>
  );
}
