import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import NotFoundPage from '@/page/etc/NotFoundPage/NotFoundPage';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFoundPage />;
      default:
        return <div>예기치 못한 에러 다시 시도해주세요</div>;
    }
  }
}
