import { ServerErrorFallback } from '@/shared/component';

import styles from './SearchResultList.module.css';

export default function SearchResultListErrorFallback({
  error,
  resetErrorBoundary,
}) {
  const { status } = error;

  if (status === 404) {
    return <p className={styles.emptyContainer}>검색 결과가 없어요</p>;
  }

  return <ServerErrorFallback reset={resetErrorBoundary} />;
}
