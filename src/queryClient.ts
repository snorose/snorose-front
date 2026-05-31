import { QueryCache, QueryClient } from '@tanstack/react-query';

import { handleQueryError } from '@/query-error-handler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },

  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
});
