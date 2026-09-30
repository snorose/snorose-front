import { Link } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';
import { useCultureBoard } from '@/shared/hook';
import { BOARD_REGISTRY, isCultureBoardPost } from '@/shared/lib';

import { PostBar } from '@/feature/board/component';

import { getBest3 } from '@/apis';

import styles from './HomeBesookt.module.css';

export default function HomeBesookt({ className, auth }) {
  const { status, userInfo } = auth;
  const isCultureBoardOn = useCultureBoard();

  const { data: besookts } = useSuspenseQuery({
    queryKey: [QUERY_KEY.best3, status, userInfo?.userRoleId],
    queryFn: getBest3,
    staleTime: 1000 * 60 * 5,
  });

  // 미노출 게시판 게시글이 서버 응답에 섞여 들어오는 경우를 차단
  const visibleBesookts = isCultureBoardOn
    ? besookts
    : besookts.filter((besookt) => !isCultureBoardPost(besookt));

  return (
    <div className={`${styles.list} ${className}`}>
      {visibleBesookts.map((besookt) => {
        const board = BOARD_REGISTRY.find(besookt.boardId);
        if (!board) return null;

        /**
         * TODO(board): 라우트 개선 작업 완료 후 수정 필요
         */
        return (
          <Link
            key={`home-besookt-${besookt.boardId}-${besookt.postId}`}
            to={`/board/${board.key}/post/${besookt.postId}`}
            // to={NEW_ROUTES.post.detail(board.key, besookt.postId)}
          >
            <PostBar {...besookt}>
              <PostBar.Chip name={besookt.boardName} variant='grey' />
            </PostBar>
          </Link>
        );
      })}
    </div>
  );
}
