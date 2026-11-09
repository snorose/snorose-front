type MY_ACTIVITY =
  | 'post'
  | 'commentedPost'
  | 'downloadedReview'
  | 'inquiryReport'
  | 'scrapedReview'
  | 'scrapedPost';

export const QUERY_KEYS = {
  inquiry: {
    all: ['inquiry'],
    byId: (inquiryId: number) => ['inquiry', 'byId', inquiryId],
  },
  report: {
    all: ['report'],
    byId: (reportId: number) => ['report', 'byId', reportId],
  },
  myActivity: {
    all: ['myActivity'],
    list: (type: MY_ACTIVITY) => ['myActivity', type],
  },
};
