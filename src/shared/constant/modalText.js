// =================== More Option Modal ===================
const POST_MORE_OPTION_LIST = [
  {
    modalId: 'report-post-types',
    iconId: 'flag-pink',
    label: '게시글 신고',
    width: 19,
    height: 22,
  },
  {
    modalId: 'report-user-types',
    iconId: 'report-user',
    label: '이용자 신고하기',
    width: 17,
    height: 17,
  },
  {
    modalId: 'share',
    iconId: 'share',
    label: '공유하기',
    width: 18,
    height: 19,
  },
];
const MY_POST_MORE_OPTION_LIST = [
  {
    modalId: null,
    iconId: 'pencil-blue',
    label: '수정하기',
    width: 19,
    height: 22,
  },
  {
    modalId: 'confirm-post-delete',
    iconId: 'trash',
    label: '삭제하기',
    width: 16,
    height: 20,
  },
  {
    modalId: 'share',
    iconId: 'share',
    label: '공유하기',
    width: 18,
    height: 19,
  },
];

const EXAM_REVIEW_MORE_OPTION_LIST = [
  {
    modalId: 'report-exam-review-types',
    iconId: 'flag-pink',
    label: '시험후기 신고',
    width: 19,
    height: 22,
  },
  {
    modalId: 'report-user-types',
    iconId: 'report-user',
    label: '이용자 신고하기',
    width: 17,
    height: 17,
  },
];
const MY_EXAM_REVIEW_MORE_OPTION_LIST = [
  {
    modalId: null,
    iconId: 'pencil-blue',
    label: '수정하기',
    width: 19,
    height: 22,
  },
  {
    modalId: 'confirm-exam-review-delete',
    iconId: 'trash',
    label: '삭제하기',
    width: 16,
    height: 20,
  },
];

const COMMENT_MORE_OPTION_LIST = [
  {
    modalId: 'report-comment-types',
    iconId: 'report-comment',
    label: '댓글 신고',
    width: 21,
    height: 22,
  },
  {
    modalId: 'report-user-types',
    iconId: 'report-user',
    label: '이용자 신고하기',
    width: 17,
    height: 17,
  },
];
const MY_COMMENT_MORE_OPTION_LIST = [
  {
    modalId: null,
    iconId: 'pencil-blue',
    label: '수정하기',
    width: 19,
    height: 22,
  },
  {
    modalId: 'confirm-comment-delete',
    iconId: 'trash',
    label: '삭제하기',
    width: 16,
    height: 20,
  },
];
const EVENT_MORE_OPTION_LIST = [
  {
    modalId: 'share',
    iconId: 'share',
    label: '공유하기',
    width: 18,
    height: 19,
  },
];

// =================== Confirm Modal ===================
const CONFIRM_MODAL = {
  // 게시글 관련 확인 모달
  DELETE_POST: {
    title: '게시글을 삭제할까요?',
    description: '삭제 시 포인트가 차감돼요',
    confirmText: '삭제',
    cancelText: '취소',
  },
  DELETE_POST_WITHOUT_POINT_DEDUCTION: {
    title: '게시글을 삭제할까요?', // 베숙트 게시글 삭제는 포인트 차감 없음
    description: null,
    confirmText: '삭제',
    cancelText: '취소',
  },
  REPORT_POST: {
    title: '게시글을 신고할까요?',
    description: null,
    confirmText: '신고',
    cancelText: '취소',
  },
  // 시험후기 관련 확인 모달
  DELETE_EXAM_REVIEW: {
    title: '시험후기를 삭제할까요?',
    description: '삭제 시 포인트가 차감돼요',
    confirmText: '삭제',
    cancelText: '취소',
  },
  REPORT_EXAM_REVIEW: {
    title: '시험후기를 신고할까요?',
    description: null,
    confirmText: '신고',
    cancelText: '취소',
  },
  EXAM_REVIEW_DUPLICATION: {
    title: `중복 후기가 있어요<br />계속 업로드할까요?`,
    description: `<span style="font-size: 14px; white-space: nowrap;">중복 후기의 경우, 먼저 올라온 후기보다<br /> 더 많은 문제가 기록된 경우만 허용돼요.<br />이외 모든 족보는 무통보 삭제되며 <br />포인트 회수 및 <span style="color: #FF4B6C;">경고 1회</span>가 부여돼요.</span>`,
    confirmText: '확인',
    cancelText: '취소',
  },
  EXAM_REVIEW_DOWNLOAD: {
    title: '다운로드할까요?',
    description: '다운로드시 50 포인트가 차감돼요',
    confirmText: '확인',
    cancelText: '취소',
  },

  // 댓글 관련 확인 모달
  DELETE_COMMENT: {
    title: '댓글을 삭제할까요?',
    description: '삭제 시 포인트가 차감돼요',
    confirmText: '삭제',
    cancelText: '취소',
  },
  DELETE_COMMENT_WITHOUT_POINT_DEDUCTION: {
    title: '댓글을 삭제할까요?', // 시험후기 댓글 삭제는 포인트 차감 없음
    description: null,
    confirmText: '삭제',
    cancelText: '취소',
  },

  REPORT_COMMENT: {
    title: '댓글을 신고할까요?',
    description: null,
    confirmText: '신고',
    cancelText: '취소',
  },

  // 유저 관련 확인 모달
  REPORT_USER: {
    title: '이용자를 신고할까요?',
    description: null,
    confirmText: '신고',
    cancelText: '취소',
  },
  WITHDRAW_ACCOUNT: {
    title: '정말 탈퇴하시겠습니까?',
    description: null,
    confirmText: '확인',
    cancelText: '취소',
  },

  // etc 확인 모달
  EXIT_PAGE: {
    title: '작성 중인 글을 삭제할까요?',
    description: '지금까지 작성한 내용은\n저장되지 않아요',
    confirmText: '삭제',
    cancelText: '취소',
  },
  ACCESS_DENIED: {
    title: null,
    description: '인증 페이지로 이동할까요?',
    confirmText: '네',
    cancelText: '아니요',
  },

  // 알림 해제 모달
  DISABLE_NOTIFICATION: {
    title: '알림을 끌까요?',
    description:
      '알림을 끄시면 강등, 무통보 삭제 등의\n중요한 안내를 받지 못해요.',
    confirmText: '끄기',
    cancelText: '취소',
  },
};

// =================== Notice Modal ===================
const NOTICE_MODAL = {
  ALREADY_VERIFIED: {
    title: '인증이 필요하지 않아요',
    description: '이미 인증을 완료했거나 인증 대상이 아니에요.',
    confirmText: '홈으로 이동',
  },
  MAEKETING_NOTICE_MODAL: {
    id: 'marketing-notice',
    title: (isMarketingAgreed) =>
      isMarketingAgreed
        ? '광고성 정보 수신 동의 완료'
        : '광고성 정보 수신 동의 해제 완료',
    description: (isMarketingAgreed, date) =>
      isMarketingAgreed
        ? `${date}\n\n매체 : 앱 푸시\n목적 :  마케팅 정보 수신\n수신거부 : 알림 설정에서 수신 거부 가능`
        : date,
    confirmText: '닫기',
  },
};

// =================== Option Modal ===================
// 게시글 신고 모달
const REPORT_POST_TYPE_LIST = [
  {
    type: 'POST_PERSONAL_ABUSE',
    iconId: 'comment-exclamation-question-mark',
    label: '특정인에 대한 욕설 및 비하',
    width: 20,
    height: 20,
  },
  {
    type: 'POST_COMMERCIAL_AD',
    iconId: 'dollar-circle',
    label: '상업적 광고 및 판매',
    width: 20,
    height: 20,
  },
  {
    type: 'POST_ILLEGAL_DISTRIBUTION',
    iconId: 'camera-blue-stroke',
    label: '불법촬영물 등의 유통',
    width: 20,
    height: 19,
  },
  {
    type: 'POST_PRIVACY_VIOLATION',
    iconId: 'x-shield',
    label: '개인정보 유출',
    width: 18,
    height: 20,
  },
  {
    type: 'POST_INCITEMENT_DIVISION',
    iconId: 'traffic-cone',
    label: '선동 및 분란 유발',
    width: 20,
    height: 20,
  },
  {
    type: 'POST_ADULT_CONTENT',
    iconId: 'hand-stop',
    label: '음란물 / 불건전한 만남 및 대화',
    width: 20,
    height: 22,
  },
  {
    type: 'POST_INSINCERE_CONTENT',
    iconId: 'list-x-circle',
    label: '무성의한 게시글',
    width: 20,
    height: 16,
  },
  {
    type: 'POST_HATEFUL_CONTENT',
    iconId: 'sad-face',
    label: '타인에게 혐오감 선사',
    width: 20,
    height: 20,
  },
];

// 시험후기 신고 모달
const REPORT_EXAM_REVIEW_TYPE_LIST = [
  {
    type: 'POST_PERSONAL_ABUSE',
    iconId: 'comment-exclamation-question-mark',
    label: '특정인에 대한 욕설 및 비하',
    width: 20,
    height: 20,
  },
  {
    type: 'POST_COMMERCIAL_AD',
    iconId: 'dollar-circle',
    label: '상업적 광고 및 판매',
    width: 20,
    height: 20,
  },
  {
    type: 'POST_ILLEGAL_DISTRIBUTION',
    iconId: 'camera-blue-stroke',
    label: '불법촬영물 등의 유통',
    width: 20,
    height: 19,
  },
  {
    type: 'POST_PRIVACY_VIOLATION',
    iconId: 'x-shield',
    label: '개인정보 유출',
    width: 18,
    height: 20,
  },
  {
    type: 'POST_INCITEMENT_DIVISION',
    iconId: 'traffic-cone',
    label: '선동 및 분란 유발',
    width: 20,
    height: 20,
  },
  {
    type: 'POST_ADULT_CONTENT',
    iconId: 'hand-stop',
    label: '음란물 / 불건전한 만남 및 대화',
    width: 20,
    height: 22,
  },
  {
    type: 'POST_INSINCERE_CONTENT',
    iconId: 'list-x-circle',
    label: '무성의한 게시글',
    width: 20,
    height: 16,
  },
  {
    type: 'POST_HATEFUL_CONTENT',
    iconId: 'sad-face',
    label: '타인에게 혐오감 선사',
    width: 20,
    height: 20,
  },
];

// 유저 신고 모달
const REPORT_USER_TYPE_LIST = [
  {
    type: 'USER_IMPERSONATION',
    iconId: 'user-question-mark',
    label: '타인 사칭',
    width: 20,
    height: 18,
  },
  {
    type: 'USER_FRAUD',
    iconId: 'dollar-circle',
    label: '사기',
    width: 20,
    height: 20,
  },
  {
    type: 'USER_EXTERNAL_PARTY',
    iconId: 'question-mark-circle',
    label: '외부인 의심',
    width: 20,
    height: 20,
  },
  {
    type: 'USER_HARASSMENT',
    iconId: 'skull-face',
    label: '괴롭힘 / 사이버폭력',
    width: 20,
    height: 20,
  },
  {
    type: 'USER_OTHER',
    iconId: 'null',
    label: '기타',
    width: 20,
    height: 20,
  },
];

// 댓글 신고 모달
const REPORT_COMMENT_TYPE_LIST = [
  {
    type: 'COMMENT_PERSONAL_ABUSE',
    iconId: 'comment-exclamation-question-mark',
    label: '특정인에 대한 욕설 및 비하',
    width: 20,
    height: 20,
  },
  {
    type: 'COMMENT_COMMERCIAL_AD',
    iconId: 'dollar-circle',
    label: '상업적 광고 및 판매',
    width: 20,
    height: 20,
  },
  {
    type: 'COMMENT_PRIVACY_VIOLATION',
    iconId: 'x-shield',
    label: '개인정보 유출',
    width: 18,
    height: 20,
  },
  {
    type: 'COMMENT_INCITEMENT_DIVISION',
    iconId: 'traffic-cone',
    label: '선동 및 분란 유발',
    width: 20,
    height: 20,
  },
  {
    type: 'COMMENT_ADULT_CONTENT',
    iconId: 'hand-stop',
    label: '음란물 / 불건전한 만남 및 대화',
    width: 20,
    height: 22,
  },
  {
    type: 'COMMENT_SPAM',
    iconId: 'list-x-circle',
    label: '스팸 / 무성의한 댓글',
    width: 20,
    height: 16,
  },
  {
    type: 'COMMENT_OTHER',
    iconId: 'null',
    label: '기타',
    width: 20,
    height: 20,
  },
];

//첨부파일 모달
const ATTACHMENT_MODAL = {
  DELETE_ATTACHMENT: {
    title: '삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
  },
};

export const MORE_OPTION_MODAL_TEXT = {
  POST_MORE_OPTION_LIST,
  MY_POST_MORE_OPTION_LIST,
  EXAM_REVIEW_MORE_OPTION_LIST,
  MY_EXAM_REVIEW_MORE_OPTION_LIST,
  COMMENT_MORE_OPTION_LIST,
  MY_COMMENT_MORE_OPTION_LIST,
  EVENT_MORE_OPTION_LIST,
};

export const CONFIRM_MODAL_TEXT = CONFIRM_MODAL;

export const NOTICE_MODAL_TEXT = NOTICE_MODAL;

export const OPTION_MODAL_TEXT = {
  REPORT_POST_TYPE_LIST,
  REPORT_EXAM_REVIEW_TYPE_LIST,
  REPORT_USER_TYPE_LIST,
  REPORT_COMMENT_TYPE_LIST,
};

export const ATTACHMENT_MODAL_TEXT = ATTACHMENT_MODAL;
