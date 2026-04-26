import { Suspense } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary, useQuery } from '@tanstack/react-query';

import { getEventPosts, getNoticeLine } from '@/apis';

import { useAuth, useSuspensePagination } from '@/shared/hook';
import {
  BackAppBar,
  FetchLoading,
  Icon,
  List,
  PullToRefresh,
  WriteButton,
} from '@/shared/component';
import {
  deduplicatePaginatedData,
  flatPaginationCache,
  getBoard,
} from '@/shared/lib';
import { QUERY_KEY, ROLE, STALE_TIME } from '@/shared/constant';

import ProgressTab from '@/feature/event/component/ProgressTab/ProgressTab';
import { PROGRESS } from '@/feature/event/constant';
import { PostBar, PostListErrorFallback } from '@/feature/board/component';

import styles from './EventListPage.module.css';

export default function EventListPage() {
  const { pathname } = useLocation();
  const { userInfo } = useAuth();
  const currentBoardTextId = pathname.split('/')[2];
  const currentBoard = getBoard(currentBoardTextId);
  const isAdmin = userInfo?.userRoleId === ROLE.admin;

  const [searchParams, setSearchParams] = useSearchParams();
  const activeProgress = searchParams.get('progressType') ?? 'ALL';

  const { data: noticeLineData } = useQuery({
    queryKey: [QUERY_KEY.noticeLine, currentBoard.id],
    queryFn: () => getNoticeLine(currentBoard?.id),
    staleTime: 1000 * 60 * 5,
  });

  const updateProgress = (progressType) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (progressType === 'ALL') {
        newParams.delete('progressType');
      } else {
        newParams.set('progressType', progressType);
      }

      return newParams;
    });
  };

  return (
    <section className={styles.container}>
      <BackAppBar title='이벤트' hasMenu backNavTo='/home' />

      <div className={styles.notification}>
        <Link className={styles.notificationBar} to={`/board/event/notice`}>
          <Icon id='notice-bell' width={11} height={13} />
          <p>[필독]&nbsp;&nbsp;{noticeLineData?.title}</p>
        </Link>
      </div>

      <div className={styles.progressTab}>
        {Object.entries(PROGRESS).map(([key, value]) => (
          <ProgressTab
            key={key}
            progressType={value}
            isSelected={key === activeProgress}
            onClick={() => updateProgress(key)}
          >
            {value}
          </ProgressTab>
        ))}
      </div>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={PostListErrorFallback}
          >
            <Suspense
              fallback={<FetchLoading>게시글 불러오는 중...</FetchLoading>}
            >
              <PostList
                currentBoardTextId={currentBoardTextId}
                currentBoard={currentBoard}
                activeProgress={activeProgress}
              />
              {/* <NewPostList /> */}
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      {isAdmin && (
        <WriteButton
          to={`/board/event/event-post-write`}
        />
      )}
    </section>
  );
}

function PostList({ currentBoardTextId, currentBoard, activeProgress }) {
  const { data, ref, isFetching, refetch } = useSuspensePagination({
    queryKey: [QUERY_KEY.events, currentBoard.id, activeProgress],
    queryFn: ({ pageParam }) =>
      getEventPosts({
        page: pageParam,
        progressType: activeProgress === 'ALL' ? undefined : activeProgress,
      }),
    staleTime: STALE_TIME.boardPostList,
  });

  const postList = deduplicatePaginatedData(flatPaginationCache(data));

  if (!postList.length) {
    return (
      <FetchLoading animation={false}>
        {activeProgress === 'ALL'
          ? '게시물이 없어요'
          : '해당 상태의 이벤트가 없어요'}
      </FetchLoading>
    );
  }

  return (
    <div>
      <PullToRefresh onRefresh={refetch}>
        <List>
          {postList.map((post, index) => (
            <Link
              className={styles.to}
              key={post.postId}
              to={`/board/${currentBoardTextId}/post/${post.postId}`}
              ref={index === postList.length - 1 ? ref : undefined}
            >
              <PostBar {...post}>
                <PostBar.Chip
                  name={PROGRESS[post.progressType]}
                  variant={
                    post.progressType === 'IN_PROGRESS' ? 'gradient' : 'grey'
                  }
                />
              </PostBar>
            </Link>
          ))}
          {isFetching && <FetchLoading />}
        </List>
      </PullToRefresh>
    </div>
  );
}
