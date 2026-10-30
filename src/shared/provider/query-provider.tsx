import { useRef } from 'react';
import { NavigateFunction } from 'react-router-dom';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  clearAuthTokens,
  isRefreshTokenExpiredError,
  shouldHandleSessionExpired,
} from '@/feature/auth/libs';

type QueryProviderProps = {
  children: React.ReactNode;
  navigate: NavigateFunction;
};

type GlobalErrorMeta = {
  skipGlobalError?: boolean;
};

export function QueryProvider({ children, navigate }: QueryProviderProps) {
  const queryClientRef = useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          if (shouldSkipGlobalError(query.meta)) return;

          handleGlobalError(error, queryClientRef.current!, navigate);
        },
      }),
      mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
          if (shouldSkipGlobalError(mutation.meta)) return;

          handleGlobalError(error, queryClientRef.current!, navigate);
        },
      }),
      defaultOptions: {
        queries: {
          retry: 0,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function handleGlobalError(
  error: unknown,
  queryClient: QueryClient,
  navigate: NavigateFunction
) {
  if (isRefreshTokenExpiredError(error) && shouldHandleSessionExpired()) {
    clearAuthTokens();
    queryClient.clear();

    alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
    navigate('/login', {
      state: {
        from: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
        },
      },
      replace: true,
    });
  }
}

function shouldSkipGlobalError(meta: unknown) {
  return Boolean((meta as GlobalErrorMeta | undefined)?.skipGlobalError);
}
