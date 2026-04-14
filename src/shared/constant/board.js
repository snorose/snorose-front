import besookt from '@/assets/images/besookt-board-page.svg';
import event from '@/assets/images/event-board-page.svg';
import eventMain from '@/assets/images/event-main.svg';
import financeAudit from '@/assets/images/financeAudit-board-page.svg';
import firstSnow from '@/assets/images/firstSnow-board-page.svg';
import firstSnowMain from '@/assets/images/firstSnow-main.svg';
import graduationPreparation from '@/assets/images/graduationPreparation-board-page.svg';
import largeSnow from '@/assets/images/largeSnow-board-page.svg';
import largeSnowMain from '@/assets/images/largeSnow-main.svg';
import permanentSnow from '@/assets/images/permanentSnow-board-page.svg';
import permanentSnowMain from '@/assets/images/permanentSnow-main.svg';
import studentCouncil from '@/assets/images/studentCouncil-board-page.svg';

export const BOARD_ID = Object.freeze({
  all: 0, // 프론트에서만 사용하는 보드 ID
  inquiryAndReport: 13,
  event: 14,
  besookt: 20,
  'first-snow': 21,
  'large-snow': 22,
  'permanent-snow': 23,
  'exam-review': 32,
  'student-council': 60,
  'graduation-preparation': 61,
  'finance-audit': 62,
});

export const BOARDS = Object.freeze([
  {
    id: 0,
    path: '/board/all',
  },
  {
    id: 14,
    name: '이벤트',
    path: '/board/event',
    mainImage: eventMain,
  },
  {
    id: 21,
    name: '첫눈온방',
    path: '/board/first-snow',
    mainImage: firstSnowMain,
  },
  {
    id: 22,
    name: '함박눈방',
    path: '/board/large-snow',
    mainImage: largeSnowMain,
  },
  {
    id: 23,
    name: '만년설방',
    path: '/board/permanent-snow',
    mainImage: permanentSnowMain,
  },
  {
    id: 60,
    name: '총학생회',
    path: '/board/student-council',
  },
  {
    id: 61,
    name: '졸업준비위원회',
    path: 'graduation-preparation',
  },
  {
    id: 62,
    name: '재정감사위원회',
    path: '/board/finance-audit',
  },
]);

export const BOARD_MENUS = [
  {
    id: 12,
    to: '/board/notice',
    textId: 'notice',
    title: '공지사항',
    desc: '',
    image: '',
  },
  {
    id: 14,
    to: '/board/event',
    textId: 'event',
    title: '스노로즈 이벤트',
    desc: '스노로즈 이벤트 게시판',
    image: event,
  },
  {
    id: 14,
    to: '/board/event-notice',
    textId: 'event-notice',
    title: '이벤트',
    desc: '이벤트 공지글',
    image: event,
  },
  {
    id: 21,
    to: '/board/first-snow',
    textId: 'first-snow',
    title: '첫눈온방',
    desc: '새내기 전용 커뮤니티',
    image: firstSnow,
  },
  {
    id: 22,
    to: '/board/large-snow',
    textId: 'large-snow',
    title: '함박눈방',
    desc: '눈송이 모두의\n커뮤니티',
    image: largeSnow,
  },
  {
    id: 23,
    to: '/board/permanent-snow',
    textId: 'permanent-snow',
    title: '만년설방',
    desc: '졸업생 전용 커뮤니티',
    image: permanentSnow,
  },
  {
    id: 20,
    to: '/board/besookt',
    textId: 'besookt',
    title: '베숙트',
    desc: '추천을 가장 많이\n받은 게시물 모아보기',
    image: besookt,
  },
  {
    id: 32,
    to: '/board/exam-review',
    textId: 'exam-review',
    title: '시험후기',
    desc: '시험 정보를 조회할 수\n있는 게시판입니다.',
    image: besookt,
  },
  {
    id: 32,
    to: '/board/exam-review-notice',
    textId: 'exam-review-notice',
    title: '시험후기',
    desc: '시험후기 공지글 게시판',
    image: besookt,
  },
  {
    id: 60,
    to: '/board/student-council',
    textId: 'student-council',
    title: '총학생회',
    desc: '총학생회 공지',
    image: studentCouncil,
  },
  {
    id: 61,
    to: '/board/graduation-preparation',
    textId: 'graduation-preparation',
    title: '졸업준비위원회',
    desc: '졸업준비위원회 공지',
    image: graduationPreparation,
  },
  {
    id: 62,
    to: '/board/finance-audit',
    textId: 'finance-audit',
    title: '재정감사위원회',
    desc: '재정감사 보고',
    image: financeAudit,
  },
];

// 공식게시판
export const OFFICIAL_BOARD = Object.freeze([
  'student-council',
  'graduation-preparation',
  'finance-audit',
]);

// 뱃지가 보이는 경로 (일반 게시판에서는 리자의 뱃지가 안보이게 설정)
export const SHOW_BADGE_PATH = Object.freeze([
  '/notice',
  '/event',
  '/student-council',
  '/finance-audit',
  '/graduation-preparation',
]);

// 게시글 신고
export const POST_REPORT_TYPE_ENUM = Object.freeze({
  POST_PERSONAL_ABUSE: 'POST_PERSONAL_ABUSE',
  POST_COMMERCIAL_AD: 'POST_COMMERCIAL_AD',
  POST_ILLEGAL_DISTRIBUTION: 'POST_ILLEGAL_DISTRIBUTION',
  POST_PRIVACY_VIOLATION: 'POST_PRIVACY_VIOLATION',
  POST_INCITEMENT_DIVISION: 'POST_INCITEMENT_DIVISION',
  POST_ADULT_CONTENT: 'POST_ADULT_CONTENT',
  POST_INSINCERE_CONTENT: 'POST_INSINCERE_CONTENT',
  POST_HATEFUL_CONTENT: 'POST_HATEFUL_CONTENT',
});

export const POST_REPORT_TYPE_KOREAN_ENUM = Object.freeze({
  POST_PERSONAL_ABUSE: '특정인에 대한 욕설 및 비하',
  POST_COMMERCIAL_AD: '상업적 광고 및 판매글',
  POST_ILLEGAL_DISTRIBUTION: '불법촬영물 등의 유통',
  POST_PRIVACY_VIOLATION: '개인정보 유출',
  POST_INCITEMENT_DIVISION: '선동 및 분란 유발',
  POST_ADULT_CONTENT: '음란물/불건전한 만남 및 대화',
  POST_INSINCERE_CONTENT: '무성의한 게시',
  POST_HATEFUL_CONTENT: '타인에게 혐오감을 주는 게시글',
});

export const POST_REPORT_TYPE_MODAL_OPTION_CHILDREN = [
  {
    iconId: 'abuse-comment',
    IconWidth: 25,
    IconHeight: 18,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_PERSONAL_ABUSE,
    value: POST_REPORT_TYPE_ENUM.POST_PERSONAL_ABUSE,
  },
  {
    iconId: 'dollar',
    IconWidth: 25,
    IconHeight: 14,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_COMMERCIAL_AD,
    value: POST_REPORT_TYPE_ENUM.POST_COMMERCIAL_AD,
  },
  {
    iconId: 'camera',
    IconWidth: 25,
    IconHeight: 18,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_ILLEGAL_DISTRIBUTION,
    value: POST_REPORT_TYPE_ENUM.POST_ILLEGAL_DISTRIBUTION,
  },
  {
    iconId: 'ban',
    IconWidth: 18,
    IconHeight: 18,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_PRIVACY_VIOLATION,
    value: POST_REPORT_TYPE_ENUM.POST_PRIVACY_VIOLATION,
  },
  {
    iconId: 'flag',
    IconWidth: 22,
    IconHeight: 22,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_INCITEMENT_DIVISION,
    value: POST_REPORT_TYPE_ENUM.POST_INCITEMENT_DIVISION,
  },
  {
    iconId: 'adult',
    IconWidth: 18,
    IconHeight: 18,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_ADULT_CONTENT,
    value: POST_REPORT_TYPE_ENUM.POST_ADULT_CONTENT,
  },
  {
    iconId: 'horizontal-dot3',
    IconWidth: 18,
    IconHeight: 18,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_INSINCERE_CONTENT,
    value: POST_REPORT_TYPE_ENUM.POST_INSINCERE_CONTENT,
  },
  {
    iconId: 'user-disgust',
    IconWidth: 19,
    IconHeight: 21,
    text: POST_REPORT_TYPE_KOREAN_ENUM.POST_HATEFUL_CONTENT,
    value: POST_REPORT_TYPE_ENUM.POST_HATEFUL_CONTENT,
  },
];

// 유저 신고
export const USER_REPORT_TYPE_ENUM = Object.freeze({
  USER_IMPERSONATION: 'USER_IMPERSONATION',
  USER_FRAUD: 'USER_FRAUD',
  USER_EXTERNAL_PARTY: 'USER_EXTERNAL_PARTY',
  USER_HARASSMENT: 'USER_HARASSMENT',
  USER_OTHER: 'USER_OTHER',
});

export const USER_REPORT_TYPE_KOREAN_ENUM = Object.freeze({
  USER_IMPERSONATION: '타인 사칭',
  USER_FRAUD: '사기',
  USER_EXTERNAL_PARTY: '외부인',
  USER_HARASSMENT: '괴롭힘/사이버폭력',
  USER_OTHER: '기타',
});

export const USER_REPORT_TYPE_MODAL_OPTION_CHILDREN = [
  {
    iconId: 'user-sunglasses',
    IconWidth: 18,
    IconHeight: 21,
    text: USER_REPORT_TYPE_KOREAN_ENUM.USER_IMPERSONATION,
    value: USER_REPORT_TYPE_ENUM.USER_IMPERSONATION,
  },
  {
    iconId: 'ban',
    IconWidth: 18,
    IconHeight: 18,
    text: USER_REPORT_TYPE_KOREAN_ENUM.USER_FRAUD,
    value: USER_REPORT_TYPE_ENUM.USER_FRAUD,
  },
  {
    iconId: 'user-stranger',
    IconWidth: 18,
    IconHeight: 21,
    text: USER_REPORT_TYPE_KOREAN_ENUM.USER_EXTERNAL_PARTY,
    value: USER_REPORT_TYPE_ENUM.USER_EXTERNAL_PARTY,
  },
  {
    iconId: 'abuse-comment',
    IconWidth: 25,
    IconHeight: 18,
    text: USER_REPORT_TYPE_KOREAN_ENUM.USER_HARASSMENT,
    value: USER_REPORT_TYPE_ENUM.USER_HARASSMENT,
  },
  {
    iconId: 'horizontal-dot3',
    IconWidth: 18,
    IconHeight: 18,
    text: USER_REPORT_TYPE_KOREAN_ENUM.USER_OTHER,
    value: USER_REPORT_TYPE_ENUM.USER_OTHER,
  },
];

// 댓글 신고
export const COMMENT_REPORT_TYPE_ENUM = Object.freeze({
  COMMENT_PERSONAL_ABUSE: 'COMMENT_PERSONAL_ABUSE',
  COMMENT_COMMERCIAL_AD: 'COMMENT_COMMERCIAL_AD',
  COMMENT_PRIVACY_VIOLATION: 'COMMENT_PRIVACY_VIOLATION',
  COMMENT_INCITEMENT_DIVISION: 'COMMENT_INCITEMENT_DIVISION',
  COMMENT_ADULT_CONTENT: 'COMMENT_ADULT_CONTENT',
  COMMENT_SPAM: 'COMMENT_SPAM',
  COMMENT_OTHER: 'COMMENT_OTHER',
});

export const COMMENT_REPORT_TYPE_KOREAN_ENUM = Object.freeze({
  COMMENT_PERSONAL_ABUSE: '특정인에 대한 욕설 및 비하',
  COMMENT_COMMERCIAL_AD: '상업적 광고 및 판매 댓글',
  COMMENT_PRIVACY_VIOLATION: '개인정보 유출',
  COMMENT_INCITEMENT_DIVISION: '선동 및 분란 유발',
  COMMENT_ADULT_CONTENT: '음란물/불건전한 만남 및 대화',
  COMMENT_SPAM: '스팸/무성의한 댓글',
  COMMENT_OTHER: '기타',
});

export const COMMENT_REPORT_TYPE_MODAL_OPTION_CHILDREN = [
  {
    iconId: 'abuse-comment',
    IconWidth: 25,
    IconHeight: 18,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_PERSONAL_ABUSE,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_PERSONAL_ABUSE,
  },
  {
    iconId: 'dollar',
    IconWidth: 25,
    IconHeight: 14,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_COMMERCIAL_AD,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_COMMERCIAL_AD,
  },
  {
    iconId: 'ban',
    IconWidth: 18,
    IconHeight: 18,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_PRIVACY_VIOLATION,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_PRIVACY_VIOLATION,
  },
  {
    iconId: 'flag',
    IconWidth: 22,
    IconHeight: 22,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_INCITEMENT_DIVISION,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_INCITEMENT_DIVISION,
  },
  {
    iconId: 'adult',
    IconWidth: 18,
    IconHeight: 18,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_ADULT_CONTENT,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_ADULT_CONTENT,
  },
  {
    iconId: 'comment',
    IconWidth: 18,
    IconHeight: 18,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_SPAM,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_SPAM,
  },
  {
    iconId: 'horizontal-dot3',
    IconWidth: 19,
    IconHeight: 21,
    text: COMMENT_REPORT_TYPE_KOREAN_ENUM.COMMENT_OTHER,
    value: COMMENT_REPORT_TYPE_ENUM.COMMENT_OTHER,
  },
];
