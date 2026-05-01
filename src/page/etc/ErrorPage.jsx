import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { ServerErrorFallback } from '@/shared/component';

import NotFoundPage from '@/page/etc/NotFoundPage/NotFoundPage';

export default function ErrorPage() {
  const error = useRouteError();

  const status = isRouteErrorResponse(error)
    ? error.status
    : error.response?.status;

  switch (status) {
    case 404:
      return <NotFoundPage />;
    default:
      return <ServerErrorFallback />;
  }
}
