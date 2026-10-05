// 게시글 목록 정렬 기준 (API sort 파라미터)
export const POST_SORT_OPTIONS = Object.freeze([
  { id: 'LATEST', name: '최신순' },
  { id: 'OLDEST', name: '오래된순' },
  { id: 'VIEW', name: '조회수순' },
  { id: 'LIKE', name: '공감순' },
  { id: 'SCRAP', name: '스크랩순' },
]);
