import { useSearchParams } from 'react-router-dom';

import { findOption } from '@/shared/lib';

import {
  getCategoryOptions,
  getPostYearOptions,
  POST_SORT_OPTIONS,
} from '@/feature/board/constant';

// 옵션에 없는 값은 미선택(undefined)으로 취급
const findOptionId = (options, value) => findOption(options, value)?.id;

/**
 * 게시글 목록 필터(sort, year, category)를 URL 쿼리에서 읽는다.
 * 카테고리가 없는 게시판은 category가 항상 undefined다.
 */
export function usePostListFilter(boardId) {
  const [searchParams] = useSearchParams();

  const sort = findOptionId(POST_SORT_OPTIONS, searchParams.get('sort'));
  const year = findOptionId(getPostYearOptions(), searchParams.get('year'));
  const category = findOptionId(
    getCategoryOptions(boardId),
    searchParams.get('category')
  );

  return { sort, year, category };
}
