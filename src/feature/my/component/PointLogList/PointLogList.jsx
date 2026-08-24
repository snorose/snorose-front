import { FetchLoading, InfiniteScrollSentinel } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';

import { PointLog } from '@/feature/my/component';

import { getPointLogs } from '@/apis';

import styles from './PointLogList.module.css';

export default function PointLogList() {
  const {
    items: pointList,
    ref,
    isFetchingNextPage,
  } = useSuspenseInfiniteScroll({
    queryKey: [QUERY_KEY.pointHistory],
    queryFn: ({ pageParam }) => getPointLogs({ page: pageParam }),
    getItemKey: (item) => item.id,
  });

  return (
    <ul className={styles.pointListContainer}>
      {pointList.map((log) => (
        <PointLog key={log.id} log={log} />
      ))}

      <InfiniteScrollSentinel ref={ref} />
      {isFetchingNextPage && <FetchLoading />}
    </ul>
  );
}
