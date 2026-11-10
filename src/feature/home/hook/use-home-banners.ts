import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { readHomeBanners } from '@/feature/home/api';

export default function useHomeBanners() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY.banner.home,
    queryFn: readHomeBanners,
    staleTime: 1000 * 60 * 60 * 1,
    gcTime: 1000 * 60 * 60 * 1,
  });
}
