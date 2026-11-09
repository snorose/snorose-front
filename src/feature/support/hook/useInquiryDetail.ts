import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constant';

import { readInquiry } from '@/feature/support/api';

export default function useInquiryDetail(inquiryId: number) {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.inquiry.byId(inquiryId),
    queryFn: () => readInquiry(inquiryId),
    staleTime: 1000 * 60 * 5,
  });
}
