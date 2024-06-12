export enum POINT_SOURCE {
  Attendance = 'ATTENDANCE', // 출석체크
  Post = 'POST', // 게시글
  Review = 'REVIEW',	// 시험후기
  Comment = 'COMMENT', // 댓글
  Admin = 'ADMIN', 	// 관리자
}


/*
1. 출석체크
2. 게시글 작성
3. 게시글 삭제
4. 댓글 작성
5. 댓글 삭제
6. 시험후기 작성
7. 시험후기 다운로드
8. 강의후기 작성
9. 보상 (오류, 신고 등 사유)
10. 차감 (규정 위반 등 사유)
11. 이벤트
*/
export enum POINT_CATEGORY {
  Attendance = '출석체크',
  Post_Write = '게시글 작성',
  Post_Delete = '게시글 삭제',
  Comment_Write = '댓글 작성',
  Comment_Delete = '댓글 삭제',
  Review_Write = '시험후기 작성',
  Review_Download = '시험후기 다운로드',
  Plus = '보상',
  Minus = '차감',
  Event = '이벤트'
}