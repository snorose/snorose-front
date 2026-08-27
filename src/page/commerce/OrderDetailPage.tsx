import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { PostListErrorFallback } from '@/feature/board/component';
import useOrder from '@/feature/commerce/hooks/useOrder';

export default function OrderDetailPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={PostListErrorFallback}
        >
          <Suspense>
            <OrderDetailView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function OrderDetailView() {
  const { orderNumber } = useParams();

  const { data: order } = useOrder(orderNumber);

  return <div>주문 상세 페이지</div>;
}
