import { ServerErrorFallback } from '@/shared/component';

import styles from './SearchExamReviewList.module.css';

export default function SearchExamReviewListErrorFallback({
  error,
  resetErrorBoundary,
}) {
  const status = error.response?.status || error.status;

  if (status === 404) {
    return <p className={styles.emptyContainer}>검색 결과가 없어요</p>;
  }

  return <ServerErrorFallback reset={resetErrorBoundary} />;
}

