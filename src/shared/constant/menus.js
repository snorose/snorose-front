import { BOARD_REGISTRY } from '@/shared/lib';
import { NEW_ROUTES } from '@/shared/constant/route';

export const NAVBAR_MENUS = Object.freeze([
  {
    id: 'home',
    to: NEW_ROUTES.root,
    label: '메인홈',
    width: 32,
    height: 32,
  },
  {
    id: 'board',
    to: NEW_ROUTES.boardHome,
    label: '게시판',
    width: 32,
    height: 32,
  },
  {
    id: 'test',
    to: NEW_ROUTES.post.list('exam-review'),
    label: '시험후기',
    width: 32,
    height: 32,
  },
  {
    id: 'bell',
    to: NEW_ROUTES.alert,
    label: '알림',
    width: 32,
    height: 32,
  },
  {
    id: 'mypage',
    to: NEW_ROUTES.mypage,
    label: '내정보',
    width: 32,
    height: 32,
  },
]);

export const SIDEBAR_MENUS = Object.freeze([
  {
    to: '/',
    title: '스노로즈',
    items: [
      { to: '/about', name: 'About 스노로즈' },
      { to: '/board/notice', name: '공지사항' },
      {
        to: 'https://snorose.notion.site/1a37ef0aa3bf8071bcd0cb35c035636e?pvs=4',
        name: '스노로즈 블로그',
      },
    ],
  },
  {
    to: '/board/event',
    title: '이벤트',
  },
  {
    to: '/verify',
    title: '인증',
  },
  {
    to: '/board',
    title: '커뮤니티',
    items: [
      { to: '/board/first-snow', name: '첫눈온방' },
      { to: '/board/large-snow', name: '함박눈방' },
      { to: '/board/permanent-snow', name: '만년설방' },
      { to: '/board/besookt', name: '베숙트' },
    ],
  },
  {
    to: '/board',
    title: '공식 게시판',
    items: [
      { to: '/board/student-council', name: '총학생회' },
      { to: '/board/graduation-preparation', name: '졸업준비위원회' },
      { to: '/board/finance-audit', name: '재정감사위원회' },
    ],
  },
  {
    to: '/board/exam-review',
    title: '시험후기',
  },
  {
    title: '문의 및 신고',
    to: '/my-page/inquiry-report',
    items: [
      { name: '문의하기', to: '/inquiry/write' },
      { name: '자주 묻는 질문', to: '/support/faq' },
    ],
  },
  {
    to: '/',
    title: '숙명여대',
    items: [
      {
        to: 'https://www.sookmyung.ac.kr/kr/index.do',
        name: '숙명여대 홈페이지',
      },
      { to: 'https://portal.sookmyung.ac.kr/irj/portal', name: '숙명포털' },
      { to: 'https://snowe.sookmyung.ac.kr/bbs5/index', name: '스노위' },
    ],
  },
]);

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체 필요
 */
export const NEW_SIDEBAR_MENUS = Object.freeze([
  {
    title: '스노로즈',
    to: NEW_ROUTES.root,
    items: [
      { name: 'About 스노로즈', to: NEW_ROUTES.about },
      { name: '공지사항', to: NEW_ROUTES.globalNotice.list },
      {
        name: '스노로즈 블로그',
        to: 'https://snorose.notion.site/1a37ef0aa3bf8071bcd0cb35c035636e?pvs=4',
      },
    ],
  },
  { title: '이벤트', to: NEW_ROUTES.post.list('event') },
  { title: '인증', to: NEW_ROUTES.verify },
  {
    title: '커뮤니티',
    to: NEW_ROUTES.boardHome,
    items: BOARD_REGISTRY.communities.map(({ key, name }) => ({
      name,
      to: NEW_ROUTES.post.list(key),
    })),
  },
  {
    title: '공식 게시판',
    to: NEW_ROUTES.boardHome,
    items: BOARD_REGISTRY.officials.map(({ key, name }) => ({
      name,
      to: NEW_ROUTES.post.list(key),
    })),
  },
  {
    title: BOARD_REGISTRY.find('exam-review').name,
    to: NEW_ROUTES.post.list('exam-review'),
  },
  {
    title: '문의 및 신고',
    to: NEW_ROUTES.inquiryReport,
    items: [
      { name: '문의하기', to: NEW_ROUTES.inquiryWrite },
      { name: '자주 묻는 질문', to: NEW_ROUTES.faq },
    ],
  },
  {
    title: '숙명여대',
    to: NEW_ROUTES.root,
    items: [
      {
        name: '숙명여대 홈페이지',
        to: 'https://www.sookmyung.ac.kr/kr/index.do',
      },
      { name: '숙명포털', to: 'https://portal.sookmyung.ac.kr/irj/portal' },
      { name: '스노위', to: 'https://snowe.sookmyung.ac.kr/bbs5/index' },
    ],
  },
]);

export const NOT_LOGIN_MENUS = Object.freeze([
  '스노로즈',
  '문의/신고',
  '숙명여대',
]);
