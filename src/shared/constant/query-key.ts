type MY_ACTIVITY =
  | 'post'
  | 'commentedPost'
  | 'downloadedReview'
  | 'inquiryReport'
  | 'scrapedPost'
  | 'scrapedExamReview';

export const QUERY_KEYS = {
  inquiry: {
    all: ['inquiry'],
    byId: (inquiryId: number) => ['inquiry', 'byId', inquiryId],
  },
  report: {
    all: ['report'],
    byId: (reportId: number) => ['report', 'byId', reportId],
  },
};
