import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constant';

import { readReport } from '@/feature/support/api';

export default function useReportDetail(reportId: number) {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.report.byId(reportId),
    queryFn: () => readReport(reportId),
    staleTime: 1000 * 60 * 5,
  });
}
