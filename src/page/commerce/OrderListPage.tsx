import { Suspense } from 'react';
import { Link } from 'react-router-dom';

import { ErrorBoundary } from '@sentry/react';

import { BackAppBar } from '@/shared/component';
import { flatPaginationCache } from '@/shared/lib';

import OrderItem from '@/feature/commerce/components/OrderItem';
import useOrders from '@/feature/commerce/hooks/useOrders';
import type { OrdersResponse } from '@/feature/commerce/types';

import { noPostsIllustration } from '@/assets/illustrations';

import styles from './OrderListPage.module.css';

export default function OrderListPage() {
  return (
    <ErrorBoundary>
      <Suspense>
        <OrderListView />
      </Suspense>
    </ErrorBoundary>
  );
}

function OrderListView() {
  const { data } = useOrders();
  const orders: OrdersResponse['data'] = flatPaginationCache(data);

  if (orders.length === 0) {
    return (
      <div className={styles.noContentWrapper}>
        <p className={styles.noContentMessage}>주문 내역이 없어요</p>
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
      <BackAppBar title='내 주문 목록' />

      <div className={styles.orderList}>
        {orders.map((order) => (
          <Link key={order.orderNumber} to={order.orderNumber}>
            <OrderItem {...order} />
          </Link>
        ))}
      </div>
    </div>
  );
}
