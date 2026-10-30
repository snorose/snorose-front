import { BOARD_REGISTRY } from './board-registry';

// 피처 플래그(new-board)로 노출을 제어하는 게시판
export const NEW_BOARD_KEYS = [
  'club',
  'promotion',
  'living',
  'women-studies',
] as const;

const NEW_BOARDS = NEW_BOARD_KEYS.map((key) => BOARD_REGISTRY.find(key));

const NEW_BOARD_IDS = new Set<number>(NEW_BOARDS.map(({ id }) => id));
const NEW_BOARD_NAMES = new Set<string>(NEW_BOARDS.map(({ name }) => name));

/**
 * 서버 응답에 섞여 들어온 신규 게시판 게시글인지 판별한다.
 * 목록 API는 게시판에 따라 boardId 또는 boardName만 내려주므로 둘 다 확인한다.
 */
export function isNewBoardPost(post: {
  boardId?: number | string;
  boardName?: string;
}) {
  return (
    NEW_BOARD_IDS.has(Number(post?.boardId)) ||
    NEW_BOARD_NAMES.has(post?.boardName ?? '')
  );
}
