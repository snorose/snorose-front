import { BOARD_REGISTRY } from './board-registry';

const CULTURE_BOARD_IDS = new Set<number>(
  BOARD_REGISTRY.culture.map(({ id }) => id)
);
const CULTURE_BOARD_NAMES = new Set<string>(
  BOARD_REGISTRY.culture.map(({ name }) => name)
);

/**
 * 서버 응답에 섞여 들어온 문화생활 게시글인지 판별한다.
 * 목록 API는 게시판에 따라 boardId 또는 boardName만 내려주므로 둘 다 확인한다.
 */
export function isCultureBoardPost(post: {
  boardId?: number | string;
  boardName?: string;
}) {
  return (
    CULTURE_BOARD_IDS.has(Number(post?.boardId)) ||
    CULTURE_BOARD_NAMES.has(post?.boardName ?? '')
  );
}
