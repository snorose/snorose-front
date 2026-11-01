import { useQuery } from '@tanstack/react-query';

import { fetchFAQs } from '@/feature/support/api';

export default function useFAQ(category: string) {
  return useQuery({
    queryKey: ['list', 'faqs', category],
    queryFn: () => fetchFAQs(category),
  });
}
