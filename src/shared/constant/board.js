import {
  IllustrationBooksCap,
  IllustrationBoxStarsCircle,
  IllustrationBoxStarsOpen,
  IllustrationFolderSearch,
  IllustrationMicrophone,
  IllustrationSnowfall,
  IllustrationSnowfallCircle,
  IllustrationSnowGround,
  IllustrationSnowGroundCircle,
  IllustrationSnowMountain,
  IllustrationSnowMountainCircle,
  IllustrationStarHonorBoard,
} from '@snorose/icons';

import residence from '@/assets/images/residence.svg';
import sookplace from '@/assets/images/sookPlace.svg';

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
    label: '라이프',
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
]);

export const BOARD_MENUS = [
  {
    id: 12,
    to: '/board/notice',
    textId: 'notice',
    title: '공지사항',
    desc: '',
    image: '',
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 14,
    to: '/board/event',
    textId: 'event',
    title: '스노로즈 이벤트',
    desc: '스노로즈 이벤트 게시판',
    image: IllustrationBoxStarsOpen,
    category: BOARD_CATEGORY.SNOROSE,
  },
  {
    id: 14,
    to: '/board/event-notice',
    textId: 'event-notice',
    title: '이벤트',
    desc: '이벤트 공지글',
    image: IllustrationBoxStarsOpen,
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 21,
    to: '/board/first-snow',
    textId: 'first-snow',
    title: '첫눈온방',
    desc: '새내기 전용 커뮤니티',
    image: IllustrationSnowfall,
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 22,
    to: '/board/large-snow',
    textId: 'large-snow',
    title: '함박눈방',
    desc: '눈송이 모두의\n커뮤니티',
    image: IllustrationSnowGround,
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 23,
    to: '/board/permanent-snow',
    textId: 'permanent-snow',
    title: '만년설방',
    desc: '졸업생 전용 커뮤니티',
    image: IllustrationSnowMountain,
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 20,
    to: '/board/besookt',
    textId: 'besookt',
    title: '베숙트',
    desc: '추천을 가장 많이\n받은 게시물 모아보기',
    image: IllustrationStarHonorBoard,
    category: BOARD_CATEGORY.COMMUNITY,
  },
  {
    id: 32,
    to: '/board/exam-review',
    textId: 'exam-review',
    title: '시험후기',
    desc: '시험 정보를 조회할 수\n있는 게시판입니다.',
    image: IllustrationStarHonorBoard,
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 32,
    to: '/board/exam-review-notice',
    textId: 'exam-review-notice',
    title: '시험후기',
    desc: '시험후기 공지글 게시판',
    image: IllustrationStarHonorBoard,
    category: BOARD_CATEGORY.HIDDEN,
  },
  {
    id: 60,
    to: '/board/student-council',
    textId: 'student-council',
    title: '총학생회',
    desc: '총학생회 공지',
    image: IllustrationMicrophone,
    category: BOARD_CATEGORY.OFFICIAL,
  },
  {
    id: 61,
    to: '/board/graduation-preparation',
    textId: 'graduation-preparation',
    title: '졸업준비위원회',
    desc: '졸업준비위원회 공지',
    image: IllustrationBooksCap,
    category: BOARD_CATEGORY.OFFICIAL,
  },
  {
    id: 62,
    to: '/board/finance-audit',
    textId: 'finance-audit',
    title: '재정감사위원회',
    desc: '재정감사 보고',
    image: IllustrationFolderSearch,
    category: BOARD_CATEGORY.OFFICIAL,
  },
  {
    id: 43,
    to: '/board/sookplace',
    textId: 'sookplace',
    title: '숙플레이스',
    desc: '눈송이 맛집 커뮤니티',
    category: BOARD_CATEGORY.LIFE,
    image: sookplace,
  },
  {
    id: 41,
    to: '/board/residence',
    textId: 'residence',
    title: '주거',
    desc: '자취·주거 정보 커뮤니티',
    image: residence,
    category: BOARD_CATEGORY.LIFE,
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

// 게시판과 카테고리를 연결
export const BOARD_CATEGORY_MAP = {
  [BOARD_ID.residence]: RESIDENCE_CATEGORIES,
  [BOARD_ID.sookplace]: SOOKPLACE_CATEGORIES,
};
