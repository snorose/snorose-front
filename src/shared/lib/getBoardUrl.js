export function getBoardUrl(boardId) {
  switch (boardId) {
    case 20:
      return '/v1/best-posts';
    default:
      return `/v1/boards/${boardId}/posts/postlist`;
  }
}
