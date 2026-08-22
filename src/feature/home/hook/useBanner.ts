import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { getBannerImage } from '@/apis';

export default function useBanner() {
  return useSuspenseQuery({
    queryKey: [QUERY_KEY.banner],
    queryFn: getBannerImage,
    gcTime: Infinity,
    staleTime: 1000 * 60 * 5,
  });
}
