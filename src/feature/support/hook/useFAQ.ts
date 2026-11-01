import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchFAQs } from '@/feature/support/api';

export default function useFAQ(category: string) {
  return useSuspenseQuery({
    queryKey: ['list', 'faqs', category],
    queryFn: () => fetchFAQs(category),
  });
}
