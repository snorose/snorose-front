export function getBoardUrl(boardId, page, sort) {
  switch (boardId) {
    case 20:
      return `/v1/best-posts?page=${page}${sort ? `&sort=${sort}` : ''}`;
    case 14:
      return `/v1/events?page=${page}`;
    default:
      return `/v1/boards/${boardId}/posts/postlist?page=${page}`;
  }
}
