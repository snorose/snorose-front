import { BoardKey } from '@/types';

export const ROUTE = Object.freeze({
  root: '/',
  home: '/home',
  boardList: '/board',
  allSearch: (keyword) => `/board/all/search/${keyword}`,
  board: (boardKey) => `/board/${boardKey}`,
  boardNotice: (boardKey) => `/board/${boardKey}/notice`,
  boardSearch: (boardKey) => `/board/${boardKey}/search`,
  post: ({ boardKey, postId }) => `/board/${boardKey}/post/${postId}`,
  postWrite: (boardKey) => `/board/${boardKey}/post-write`,
  postEdit: ({ boardKey, postId }) => `/board/${boardKey}/post/${postId}/edit`,
  examReview: '/board/exam-review',
  examReviewDetail: (postId) => `/board/exam-review/post/${postId}`,
  examReviewWrite: '/board/exam-review-write',
  examReviewEdit: (postId) => `/board/exam-review/${postId}/edit`,
  alert: '/alert',
  alertSetting: '/alert/setting',
  mypage: '/my-page',
  mypagePassword: '/my-page/password',
  mypageEditInfo: '/my-page/edit-info',
  mypagePoint: '/my-page/view-point-list',
  mypageDeleteAccount: '/my-page/delete-account',
  mypagePraivacyPoicy: '/my-page/privacy-policy',
  mypageServicePolicy: '/my-page/service-policy',
  mypageMyPost: '/my-page/my-post',
  mypageComment: '/my-page/comment',
  mypageDownloadExamReview: '/my-page/download-exam-review',
  mypageScrap: '/my-page/scrap',
  mypageExamReviewScrap: '/my-page/scrap-exam-review',
  login: '/login',
  signUp: '/signup',
  signUpSuccess: '/signup/success',
  signUpFailure: '/signup/failure',
  findId: '/find-id',
  findPw: '/find-pw',
  foundId: '/found-id',
  foundPw: '/found-pw',
  notFoundId: '/not-found-id',
  notFoundPw: '/not-found-pw',
  about: '/about',
  verify: '/verify',
  help: '/help',
  notice: '/notice',
  attendance: '/attendance',
});

/**
 * TODO(route): 라우트 개선 작업 완료 후 교체
 */
export const NEW_ROUTES = Object.freeze({
  root: '/',
  home: '/home',
  boardHome: '/board',
  globalSearch: '/search',

  globalNotice: {
    list: '/notice',
    write: '/notice/write',
    detail: (postId: string) => `/notice/${postId}`,
    edit: (postId: string) => `/notice/${postId}/edit`,
  },

  post: {
    list: (boardKey: BoardKey) => `/board/${boardKey}`,
    write: (boardKey: BoardKey) => `/board/${boardKey}/write`,
    detail: (boardKey: BoardKey, postId: string) =>
      `/board/${boardKey}/${postId}`,
    edit: (boardKey: BoardKey, postId: string) =>
      `/board/${boardKey}/${postId}/edit`,
    search: (boardKey: BoardKey) => `/board/${boardKey}/search`,
  },

  notice: {
    list: (boardKey: BoardKey) => `/board/${boardKey}/notice`,
    write: (boardKey: BoardKey) => `/board/${boardKey}/notice/write`,
    detail: (boardKey: BoardKey, postId: string) =>
      `/board/${boardKey}/notice/${postId}`,
    edit: (boardKey: BoardKey, postId: string) =>
      `/board/${boardKey}/notice/${postId}/edit`,
  },

  /* 알림 */
  alert: '/alert',
  alertSetting: '/alert/setting',

  /* 마이페이지 */
  mypage: '/my-page',
  // mypagePassword: '/my-page/password',
  // mypageEditInfo: '/my-page/edit-info',
  // mypagePoint: '/my-page/view-point-list',
  // mypageDeleteAccount: '/my-page/delete-account',
  // mypageMyPost: '/my-page/my-post',
  // mypageComment: '/my-page/comment',
  // mypageDownloadExamReview: '/my-page/download-exam-review',
  // mypageScrap: '/my-page/scrap',
  // mypageExamReviewScrap: '/my-page/scrap-exam-review',

  /* 인증 */
  // login: '/login',
  // signUp: '/signup',
  // signUpSuccess: '/signup/success',
  // signUpFailure: '/signup/failure',
  // findId: '/find-id',
  // findPw: '/find-pw',
  // foundId: '/found-id',
  // foundPw: '/found-pw',
  // notFoundId: '/not-found-id',
  // notFoundPw: '/not-found-pw',

  /* 기타 */
  about: '/about',
  verify: '/verify',
  attendance: '/attendance',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  maintenance: '/maintenance',
});
