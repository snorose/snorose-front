import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getNoticeList } from '@/apis/notice';

import { useAuth, useBoard, useBoardNavigate } from '@/shared/hook';
import { BackAppBar, FetchLoading, WriteButton } from '@/shared/component';
import { getBoard } from '@/shared/lib';
import { QUERY_KEY, STALE_TIME, ROLE } from '@/shared/constant';

import { NoticeBar } from '@/feature/board/component';

import styles from './NoticeListPage.module.css';

export default function NoticeListPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { pathname } = useLocation();
  const [noticeList, setNoticeList] = useState([]);
  const currentBoardTextId = pathname.split('/')[2];
  const currentBoard = getBoard(currentBoardTextId);
  // 게시글 데이터 받아오기
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.notices, currentBoard?.id],
    queryFn: () => getNoticeList(currentBoard?.id),
    staleTime: STALE_TIME.noticeList,
    enabled: !!currentBoard?.id,
  });

  // 데이터 화면 표시
  useEffect(() => {
    if (data) {
      setNoticeList(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading>공지글 불러오는 중...</FetchLoading>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading animation={false}>
          게시글을 불러오지 못했습니다.
        </FetchLoading>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <BackAppBar
        title={
          currentBoardTextId === 'notice'
            ? '공지사항'
            : `${currentBoard.title} 공지`
        }
        hasNotice={true}
      />

      <div className={styles.content}>
        {Array.isArray(noticeList) && noticeList.length > 0 ? (
          noticeList.map((post) => (
            <NoticeBar
              key={post.postId}
              data={post}
              onClick={() => {
                if (currentBoardTextId === 'exam-review') {
                  navigate(`/board/exam-review-notice/post/${post.postId}`);
                } else if (currentBoardTextId === 'event') {
                  navigate(`/board/event-notice/post/${post.postId}`);
                } else {
                  navigate(`/board/${currentBoardTextId}/post/${post.postId}`);
                }
              }}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <FetchLoading animation={false}>공지글이 없습니다.</FetchLoading>
          </div>
        )}
      </div>
      {userInfo?.userRoleId === ROLE.admin &&
        currentBoardTextId === 'notice' && (
          <WriteButton
            to={`/board/${currentBoardTextId}/post-write`}
            className={styles.writeButton}
          />
        )}
    </div>
  );
}

/**
 * TODO: 라우트 개선 작업 완료 후 기존 컴포넌트와 교체 예정
 */
export function NewNoticeListPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const {
    key: boardKey,
    id: boardId,
    name: boardName,
    isGlobalNotice,
  } = useBoard();
  const { toNoticeWrite } = useBoardNavigate();

  const isAdmin = userInfo?.userRoleId === ROLE.admin;

  const {
    data: noticeList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.notices, boardId],
    queryFn: () => getNoticeList(boardId),
    staleTime: STALE_TIME.noticeList,
  });

  if (isLoading) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading>공지글 불러오는 중...</FetchLoading>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading animation={false}>
          게시글을 불러오지 못했습니다.
        </FetchLoading>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <BackAppBar
        title={isGlobalNotice ? boardName : `${boardName} 공지`}
        hasNotice={true}
      />

      {noticeList.length === 0 && (
        <FetchLoading animation={false}>공지글이 없습니다.</FetchLoading>
      )}

      {noticeList.length > 0 && (
        <div className={styles.content}>
          {noticeList.map((post) => (
            <NoticeBar
              key={post.postId}
              data={post}
              onClick={() => navigate(`./${post.postId}`)}
            />
          ))}
        </div>
      )}

      {isAdmin && isGlobalNotice && (
        <WriteButton
          to={toNoticeWrite(boardKey, { isGlobalNotice })}
          className={styles.writeButton}
        />
      )}
    </div>
  );
}
