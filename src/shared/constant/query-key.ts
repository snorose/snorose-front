export const QUERY_KEYS = {
  report: {
    all: ['report'],
    byId: (reportId: number) => ['report', 'byId', reportId],
  },
};
