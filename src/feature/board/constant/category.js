import { BOARD_CATEGORY_MAP } from '@/shared/constant';

// 게시글 목록 카테고리 필터 옵션 (API category 파라미터)
const CATEGORY_OPTIONS_MAP = Object.fromEntries(
  Object.entries(BOARD_CATEGORY_MAP).map(([boardId, categories]) => [
    boardId,
    Object.freeze(categories.map((name) => ({ id: name, name }))),
  ])
);

const EMPTY_OPTIONS = Object.freeze([]);

// 카테고리가 없는 게시판은 빈 배열
export const getCategoryOptions = (boardId) =>
  CATEGORY_OPTIONS_MAP[boardId] ?? EMPTY_OPTIONS;
