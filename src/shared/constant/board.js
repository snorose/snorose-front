import {
  IllustrationBoxStarsCircle,
  IllustrationSnowfallCircle,
  IllustrationSnowGroundCircle,
  IllustrationSnowMountainCircle,
} from '@snorose/icons';

export const BOARD_CATEGORY = {
  COMMUNITY: {
    value: 'community',
    label: '커뮤니티',
  },
  OFFICIAL: {
    value: 'official',
    label: '공식 게시판',
  },
  SNOROSE: {
    value: 'snorose',
    label: '스노로즈',
  },
  LIFE: {
    value: 'life',
    label: '로즈 라이프',
  },
  CULTURE: {
    value: 'culture',
    label: '문화생활',
  },
  HIDDEN: {
    value: 'hidden',
    label: '숨김', //아직 게시글 리스트에 띄우지 않을 board들
  },
};

export const BOARD_ID = Object.freeze({
  all: 0, // 프론트에서만 사용하는 보드 ID
  inquiryAndReport: 13,
  event: 14,
  besookt: 20,
  'first-snow': 21,
  'large-snow': 22,
  'permanent-snow': 23,
  'exam-review': 32,
  sookplace: 43,
  'student-council': 60,
  'graduation-preparation': 61,
  'finance-audit': 62,
  residence: 41,
  'video-content': 1001,
  'anime-comics': 1002,
  book: 1003,
  music: 1004,
  performance: 1005,
  exhibition: 1006,
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
    mainImage: IllustrationBoxStarsCircle,
  },
  {
    id: 21,
    name: '첫눈온방',
    path: '/board/first-snow',
    mainImage: IllustrationSnowfallCircle,
  },
  {
    id: 22,
    name: '함박눈방',
    path: '/board/large-snow',
    mainImage: IllustrationSnowGroundCircle,
  },
  {
    id: 23,
    name: '만년설방',
    path: '/board/permanent-snow',
    mainImage: IllustrationSnowMountainCircle,
  },
  {
    id: 43,
    name: '숙플레이스',
    path: '/board/sookplace',
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
  {
    id: 41,
    name: '주거',
    path: '/board/residence',
  },
  {
    id: 1001,
    name: '영상 컨텐츠',
    path: '/board/video-content',
  },
  {
    id: 1002,
    name: '애니·만화·웹툰·웹소설',
    path: '/board/anime-comics',
  },
  {
    id: 1003,
    name: '책',
    path: '/board/book',
  },
  {
    id: 1004,
    name: '음악',
    path: '/board/music',
  },
  {
    id: 1005,
    name: '공연',
    path: '/board/performance',
  },
  {
    id: 1006,
    name: '전시',
    path: '/board/exhibition',
  },
]);

export const BOARD_MENUS = [
  {
    id: 12,
    to: '/board/notice',
    textId: 'notice',
    title: '공지사항',
    desc: '',
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 14,
    to: '/board/event',
    textId: 'event',
    title: '스노로즈 이벤트',
    desc: '스노로즈 이벤트 게시판',
    category: BOARD_CATEGORY.SNOROSE,
  },
  {
    id: 14,
    to: '/board/event-notice',
    textId: 'event-notice',
    title: '이벤트',
    desc: '이벤트 공지글',
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 21,
    to: '/board/first-snow',
    textId: 'first-snow',
    title: '첫눈온방',
    desc: '새내기 전용 커뮤니티',
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 22,
    to: '/board/large-snow',
    textId: 'large-snow',
    title: '함박눈방',
    desc: '눈송이 모두의 커뮤니티',
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 23,
    to: '/board/permanent-snow',
    textId: 'permanent-snow',
    title: '만년설방',
    desc: '졸업생 전용 커뮤니티',
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 20,
    to: '/board/besookt',
    textId: 'besookt',
    title: '베숙트',
    desc: '추천을 가장 많이 받은 게시물 모아보기',
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 32,
    to: '/board/exam-review',
    textId: 'exam-review',
    title: '시험후기',
    desc: '시험 정보를 조회할 수 있는 게시판입니다.',
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 32,
    to: '/board/exam-review-notice',
    textId: 'exam-review-notice',
    title: '시험후기',
    desc: '시험후기 공지글 게시판',
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 60,
    to: '/board/student-council',
    textId: 'student-council',
    title: '총학생회',
    desc: '총학생회 공지',
    category: BOARD_CATEGORY.OFFICIAL,
  },
  {
    id: 61,
    to: '/board/graduation-preparation',
    textId: 'graduation-preparation',
    title: '졸업준비위원회',
    desc: '졸업준비위원회 공지',
    category: BOARD_CATEGORY.OFFICIAL,
  },
  {
    id: 62,
    to: '/board/finance-audit',
    textId: 'finance-audit',
    title: '재정감사위원회',
    desc: '재정감사 보고',
    category: BOARD_CATEGORY.OFFICIAL,
  },
  {
    id: 43,
    to: '/board/sookplace',
    textId: 'sookplace',
    title: '숙플레이스',
    desc: '눈송이 맛집 커뮤니티',
    category: BOARD_CATEGORY.LIFE,
  },
  {
    id: 41,
    to: '/board/residence',
    textId: 'residence',
    title: '주거',
    desc: '자취·주거 정보 커뮤니티',
    category: BOARD_CATEGORY.LIFE,
  },
  // TODO(culture): 문화생활 게시판 일러스트 수급 후 image 채우기
  {
    id: 1001,
    to: '/board/video-content',
    textId: 'video-content',
    title: '영상 컨텐츠',
    desc: '영상 컨텐츠 커뮤니티',
    image: '',
    category: BOARD_CATEGORY.CULTURE,
  },
  {
    id: 1002,
    to: '/board/anime-comics',
    textId: 'anime-comics',
    title: '애니·만화·웹툰·웹소설',
    desc: '애니·만화·웹툰·웹소설 생활 커뮤니티',
    image: '',
    category: BOARD_CATEGORY.CULTURE,
  },
  {
    id: 1003,
    to: '/board/book',
    textId: 'book',
    title: '책',
    desc: '독서 생활 커뮤니티',
    image: '',
    category: BOARD_CATEGORY.CULTURE,
  },
  {
    id: 1004,
    to: '/board/music',
    textId: 'music',
    title: '음악',
    desc: '음악 생활 커뮤니티',
    image: '',
    category: BOARD_CATEGORY.CULTURE,
  },
  {
    id: 1005,
    to: '/board/performance',
    textId: 'performance',
    title: '공연',
    desc: '공연 관람·팬 활동 커뮤니티',
    image: '',
    category: BOARD_CATEGORY.CULTURE,
  },
  {
    id: 1006,
    to: '/board/exhibition',
    textId: 'exhibition',
    title: '전시',
    desc: '전시 관람·추천 커뮤니티',
    image: '',
    category: BOARD_CATEGORY.CULTURE,
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

export const RESIDENCE_CATEGORIES = Object.freeze([
  '명재관',
  '외부기숙사',
  '자취',
]);

export const SOOKPLACE_CATEGORIES = Object.freeze(['교내', '교외']);

export const VIDEO_CONTENT_CATEGORIES = Object.freeze([
  '영화',
  '시리즈',
  '예능',
  'OTT',
]);

export const ANIME_COMICS_CATEGORIES = Object.freeze([
  '애니',
  '만화',
  '웹툰',
  '웹소설',
]);

export const MUSIC_CATEGORIES = Object.freeze(['국내', '해외']);

export const PERFORMANCE_CATEGORIES = Object.freeze([
  '콘서트',
  '뮤지컬',
  '연극',
]);

// 게시판과 카테고리를 연결 (책·전시는 카테고리 없음)
export const BOARD_CATEGORY_MAP = {
  [BOARD_ID.residence]: RESIDENCE_CATEGORIES,
  [BOARD_ID.sookplace]: SOOKPLACE_CATEGORIES,
  [BOARD_ID['video-content']]: VIDEO_CONTENT_CATEGORIES,
  [BOARD_ID['anime-comics']]: ANIME_COMICS_CATEGORIES,
  [BOARD_ID.music]: MUSIC_CATEGORIES,
  [BOARD_ID.performance]: PERFORMANCE_CATEGORIES,
};
