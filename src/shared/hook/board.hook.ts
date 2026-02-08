import { useLocation, useParams } from 'react-router-dom';

import { BOARD_REGISTRY } from '@/shared/lib';
import { NEW_ROUTES } from '@/shared/constant';

import type { BoardKey } from '@/types';

type BoardParams = {
  boardKey: BoardKey;
  postId: string;
};

export function useBoard() {
  const { boardKey } = useParams<BoardParams>();
  const { pathname } = useLocation();

  const isGlobalNotice = pathname.startsWith(NEW_ROUTES.globalNotice.list);
  const notBoard = !boardKey && !isGlobalNotice;
  if (notBoard) {
    throw new Error('[useBoard] 게시판 페이지에서만 사용 가능한 훅입니다.');
  }

  const board = BOARD_REGISTRY.find(isGlobalNotice ? 'notice' : boardKey);

  return { ...board, isGlobalNotice };
}

type NoticeOption = {
  isGlobalNotice?: boolean;
};

export function useBoardNavigate() {
  const { boardKey, postId } = useParams<BoardParams>();

  const toNoticeList = ({ isGlobalNotice = false }: NoticeOption = {}) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.list
      : NEW_ROUTES.notice.list(boardKey);

  const toNoticeWrite = ({ isGlobalNotice = false }: NoticeOption = {}) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.write
      : NEW_ROUTES.notice.write(boardKey);

  const toNoticeDetail = ({ isGlobalNotice = false }: NoticeOption = {}) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.detail(postId)
      : NEW_ROUTES.notice.detail(boardKey, postId);

  const toNoticeEdit = ({ isGlobalNotice = false }: NoticeOption = {}) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.edit(postId)
      : NEW_ROUTES.notice.edit(boardKey, postId);

  return {
    toNoticeList,
    toNoticeWrite,
    toNoticeDetail,
    toNoticeEdit,

    toList: () => NEW_ROUTES.post.list(boardKey),
    toWrite: () => NEW_ROUTES.post.write(boardKey),
    toDetail: () => NEW_ROUTES.post.detail(boardKey, postId),
    toEdit: () => NEW_ROUTES.post.edit(boardKey, postId),
    toSearch: () => NEW_ROUTES.post.search(boardKey),
  };
}
