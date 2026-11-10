import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { readBannerByPage } from '@/feature/advertisement/api';

export default function useBannerByPage(page: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEY.banner.page(page),
    queryFn: () => readBannerByPage(page),
    staleTime: 1000 * 60 * 60 * 1,
    gcTime: 1000 * 60 * 60 * 1,
  });
}
