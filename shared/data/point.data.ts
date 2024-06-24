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
  Attendance = 'ATTENDANCE',
  Post_Create = 'POST_CREATE',
  Post_Delete = 'POST_DELETE',
  Comment_Create = 'COMMENT_CREATE',
  Comment_Delete = 'COMMENT_DELETE',
  Exam_Review_Create = 'EXAM_REVIEW_CREATE',
  Exam_Review_Download = 'EXAM_REVIEW_DOWNLOAD',
  Exam_Review_Delete = 'EXAM_REVIEW_DELETE',
  Lecture_Review_Create = 'LECTURE_REVIEW_CREATE',
  Lecture_Review_Delete = 'LECTURE_REVIEW_DELETE',
  Point_Reward_Report_General = 'POINT_REWARD_REPORT_GENERAL',
  Point_Reward_Report_Exam_Review = 'POINT_REWARD_REPORT_EXAM_REVIEW',
  Point_Reward_Report_Outsider = 'POINT_REWARD_REPORT_OUTSIDER',
  Point_Reward_Report_Permanent_Demotion = 'POINT_REWARD_REPORT_PERMANENT_DEMOTION',
  Point_Reward_10_Likes = 'POINT_REWARD_10_LIKES',
  Point_Reward_100_Likes = 'POINT_REWARD_100_LIKES',
  Point_Reward_1000_Likes = 'POINT_REWARD_1000_LIKES',
  Point_Reward_User_Auth = 'POINT_REWARD_USER_AUTH',
  Point_Reward_Etc = 'POINT_REWARD_ETC',
  Point_Deduction_Flooding = 'POINT_DEDUCTION_FLOODING',
  Point_Deduction_Etc = 'POINT_DEDUCTION_ETC',
  Event = 'EVENT',
  Etc = 'ETC'
}