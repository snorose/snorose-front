import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchFAQs } from '@/feature/support/api';

export default function useFAQ(category: string) {
  return useSuspenseQuery({
    queryKey: ['list', 'faqs', category],
    queryFn: () => fetchFAQs(category === '전체' ? null : category),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
