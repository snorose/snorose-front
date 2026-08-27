import { Suspense } from 'react';

import { ErrorBoundary } from '@sentry/react';

import { BackAppBar } from '@/shared/component';
import { flatPaginationCache } from '@/shared/lib';

import useOrders from '@/feature/commerce/hooks/useOrders';

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
  const orders = flatPaginationCache(data);

  return <div>내 주문 목록</div>;
}
