import { QUERY_KEY, ROUTE } from '@/shared/constant';

import {
  getMyPosts,
  getMyComments,
  getDownloadedExamReviews,
  getMyInquiriesAndReports,
  getScrapedExamReviews,
  getScrapedPosts,
} from '@/apis/userInfo.js';

export const ACTIVITIES = [
  {
    path: ROUTE.mypageMyPost,
    title: '내가 쓴 글',
    queryKey: QUERY_KEY.myPosts,
    queryFn: getMyPosts,
    errorMessage: '아직 작성한 글이 없어요',
    emptyStateIllustration: 'noPostsIllustration',
  },
  {
    path: ROUTE.mypageComment,
    title: '댓글 단 글',
    queryKey: QUERY_KEY.myCommentedPosts,
    queryFn: getMyComments,
    errorMessage: '아직 작성한 댓글이 없어요',
    emptyStateIllustration: 'noCommentsIllustration',
  },
  {
    path: ROUTE.mypageDownloadExamReview,
    title: '다운받은 시험후기',
    queryKey: QUERY_KEY.myDownloadedExamReviews,
    queryFn: getDownloadedExamReviews,
    hasLike: false,
    errorMessage: '아직 다운받은 후기가 없어요',
    emptyStateIllustration: 'noScrapedPostsIllustration',
  },
  {
    path: ROUTE.mypageInquiryReport,
    title: '내가 작성한 문의 및 신고',
    queryKey: QUERY_KEY.myInquiriesAndReports,
    queryFn: getMyInquiriesAndReports,
    hasLike: false,
    errorMessage: '아직 작성한 문의 및 신고가 없어요',
    emptyStateIllustration: 'noPostsIllustration',
  },
  {
    path: ROUTE.mypageExamReviewScrap,
    title: '시험 후기 스크랩',
    queryKey: QUERY_KEY.myScrapedExamReviews,
    queryFn: getScrapedExamReviews,
    hasLike: false,
    errorMessage: '아직 스크랩한 시험 후기가 없어요',
    emptyStateIllustration: 'noScrapedPostsIllustration',
  },
  {
    path: ROUTE.mypageScrap,
    title: '스크랩',
    queryKey: QUERY_KEY.myScrapedPosts,
    queryFn: getScrapedPosts,
    errorMessage: '아직 스크랩 한 글이 없어요',
    emptyStateIllustration: 'noPostsIllustration',
  },
];
