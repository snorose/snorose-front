export const ERROR_MESSAGE = Object.freeze({
  SW_ENV_UNSUPPORTED: `푸시 알림을 사용할 수 없는 환경이에요.\n지원되는 브라우저를 이용해 주세요.`,
  SW_REGISTER_FAILED: `알림 초기화에 실패했어요.\n새로고침 후 다시 시도해 주세요.`,
  PERMISSION_DENIED_IOS: `아이폰 설정에서 스노로즈 알림 권한을\n허용으로 바꿔주세요.`,
  PERMISSION_DENIED_ANDROID: `브라우저에서 스노로즈 알림 권한을\n허용으로 바꿔주세요.`,
  FCM_TOKEN_ISSUE_FAILED: `푸시 토큰 발급에 실패했어요.\n잠시 후 다시 시도해 주세요.`,
  FCM_TOKEN_SYNC_FAILED: `이 기기에서는 푸시 알림 등록을 지원하지 않아요.\n스마트폰에서 알림을 켜주세요.`,

  // 댓글 알림 설정 API 관련
  COMMENT_ALERT_NOT_AUTHOR: `댓글 알림은 게시글 작성자만 설정할 수 있어요.`,
  COMMENT_ALERT_POST_NOT_FOUND: `삭제되었거나 존재하지 않는 글이에요.`,
  COMMENT_ALERT_NO_PERMISSION: `댓글 알림 설정 권한이 없어요.\n관리자에게 문의해 주세요.`,
});

export const ERROR_CODE = Object.freeze({
  SW_ENV_UNSUPPORTED: 'SW_ENV_UNSUPPORTED',
  SW_REGISTER_FAILED: 'SW_REGISTER_FAILED',
  PERMISSION_BLOCKED: 'PERMISSION_BLOCKED', // (기존부터) 이미 차단됨: 설정에서 막힘
  PERMISSION_JUST_DENIED: 'PERMISSION_JUST_DENIED',
  FCM_TOKEN_ISSUE_FAILED: 'FCM_TOKEN_ISSUE_FAILED',
  FCM_TOKEN_SYNC_FAILED: 'FCM_TOKEN_SYNC_FAILED',

  // 댓글 알림 설정 API 관련
  COMMENT_ALERT_NOT_AUTHOR: 2030,
  COMMENT_ALERT_POST_NOT_FOUND: 3031,
  COMMENT_ALERT_NO_PERMISSION: 2007,
});
