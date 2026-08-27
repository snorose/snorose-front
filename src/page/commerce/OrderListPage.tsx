import { Suspense } from 'react';

import { ErrorBoundary } from '@sentry/react';

import useOrders from '@/feature/commerce/hooks/useOrders';

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
  const { data: orders } = useOrders();

  return <div>Order List</div>;
}
