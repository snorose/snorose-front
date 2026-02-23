import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getNoticeLine } from '@/apis';

import { useAuth, useBoard } from '@/shared/hook';
import { BackAppBar, Icon, WriteButton } from '@/shared/component';
import { BOARD_REGISTRY, getBoard } from '@/shared/lib';
import { NEW_ROUTES, OFFICIAL_BOARD, QUERY_KEY, ROLE } from '@/shared/constant';

import { PostListSuspense } from '@/feature/board/component';

import styles from './PostListPage.module.css';

export default function PostListPage() {
  const { pathname } = useLocation();
  const { userInfo } = useAuth();
  const currentBoardTextId = pathname.split('/')[2];
  const currentBoard = getBoard(currentBoardTextId);

  const isBesookt = currentBoardTextId === 'besookt' ? true : false;
  const isFirstSnow = currentBoardTextId === 'first-snow' ? true : false;
  const isPreUser = userInfo?.userRoleId === ROLE.preUser;
  const isUser = userInfo?.userRoleId === ROLE.user;
  const isAdmin = userInfo?.userRoleId === ROLE.admin;
  const isOfficial = userInfo?.userRoleId === ROLE.official;

  const isOfficialBoard = OFFICIAL_BOARD.includes(currentBoardTextId);

  const showWriteButton =
    !isBesookt &&
    (isAdmin ||
      (isOfficial && (isOfficialBoard || isFirstSnow)) ||
      (isUser && !isOfficialBoard) ||
      (isPreUser && isFirstSnow));

  const { data: noticeLineData } = useQuery({
    queryKey: [QUERY_KEY.noticeLine, currentBoard.id],
    queryFn: () => getNoticeLine(currentBoard?.id),
    staleTime: 0,
    // staleTime: 1000 * 60 * 5,
  });

  return (
    <section className={styles.container}>
      <BackAppBar
        title={currentBoard.title}
        hasMenu
        {...(!isBesookt && { hasSearch: true })}
      />
      {!isBesookt && (
        <Link
          className={styles.notificationBar}
          to={`/board/${currentBoardTextId}/notice`}
        >
          <Icon id='notice-bell' width={13} height={16} />
          <p className={styles.notificationBarText}>
            [필독]&nbsp;&nbsp;{noticeLineData?.title}
          </p>
        </Link>
      )}
      <PostListSuspense />
      {showWriteButton && (
        <WriteButton
          to={`/board/${currentBoardTextId}/post-write`}
          className={styles.writeButton}
        />
      )}
    </section>
  );
}

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체
 */
export function NewPostListPage() {
  const { key: boardKey, id: boardId, name: boardName } = useBoard();
  const { userInfo } = useAuth();

  const isBesookt = boardKey === 'besookt';
  const isFirstSnow = boardKey === 'first-snow';
  const isOfficialBoard = BOARD_REGISTRY.officials.some(
    ({ key }) => key === boardKey
  );

  const isPreUser = userInfo?.userRoleId === ROLE.preUser;
  const isUser = userInfo?.userRoleId === ROLE.user;
  const isAdmin = userInfo?.userRoleId === ROLE.admin;
  const isOfficial = userInfo?.userRoleId === ROLE.official;

  const showWriteButton =
    !isBesookt &&
    (isAdmin ||
      (isOfficial && (isOfficialBoard || isFirstSnow)) ||
      (isUser && !isOfficialBoard) ||
      (isPreUser && isFirstSnow));

  const { data: noticeLineData } = useQuery({
    queryKey: [QUERY_KEY.noticeLine, boardId],
    queryFn: () => getNoticeLine(boardId),
    staleTime: 0,
  });

  return (
    <section className={styles.container}>
      <BackAppBar
        title={boardName}
        hasMenu
        {...(!isBesookt && { hasSearch: true })}
      />
      {!isBesookt && (
        <Link
          className={styles.notificationBar}
          to={NEW_ROUTES.notice.list(boardKey)}
        >
          <Icon id='notice-bell' width={13} height={16} />
          <p className={styles.notificationBarText}>
            [필독]&nbsp;&nbsp;{noticeLineData?.title}
          </p>
        </Link>
      )}
      <PostListSuspense />
      {showWriteButton && (
        <WriteButton
          to={NEW_ROUTES.post.write(boardKey)}
          className={styles.writeButton}
        />
      )}
    </section>
  );
}
