import { useLocation, useParams } from 'react-router-dom';

import { BOARD_REGISTRY } from '@/shared/lib';
import { NEW_ROUTES } from '@/shared/constant';

import type { BoardKey } from '@/types';

type BoardParams = {
  boardKey: BoardKey;
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
  const toNoticeList = (
    boardKey: BoardKey,
    { isGlobalNotice = false }: NoticeOption = {}
  ) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.list
      : NEW_ROUTES.notice.list(boardKey);

  const toNoticeWrite = (
    boardKey: BoardKey,
    { isGlobalNotice = false }: NoticeOption = {}
  ) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.write
      : NEW_ROUTES.notice.write(boardKey);

  const toNoticeDetail = (
    boardKey: BoardKey,
    postId: string,
    { isGlobalNotice = false }: NoticeOption = {}
  ) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.detail(postId)
      : NEW_ROUTES.notice.detail(boardKey, postId);

  const toNoticeEdit = (
    boardKey: BoardKey,
    postId: string,
    { isGlobalNotice = false }: NoticeOption = {}
  ) =>
    isGlobalNotice
      ? NEW_ROUTES.globalNotice.edit(postId)
      : NEW_ROUTES.notice.edit(boardKey, postId);

  return {
    toNoticeList,
    toNoticeWrite,
    toNoticeDetail,
    toNoticeEdit,

    toList: (boardKey: BoardKey) => NEW_ROUTES.post.list(boardKey),
    toWrite: (boardKey: BoardKey) => NEW_ROUTES.post.write(boardKey),
    toDetail: (boardKey: BoardKey, postId: string) =>
      NEW_ROUTES.post.detail(boardKey, postId),
    toEdit: (boardKey: BoardKey, postId: string) =>
      NEW_ROUTES.post.edit(boardKey, postId),
    toSearch: (boardKey: BoardKey) => NEW_ROUTES.post.search(boardKey),
  };
}
