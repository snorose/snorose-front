import { useParams } from 'react-router-dom';

import { NotFoundPage } from '@/page/etc';

const VALID_REPORT_TYPES = ['post', 'comment', 'user', 'exam'] as const;
type ReportType = (typeof VALID_REPORT_TYPES)[number];

function isValidReportType(x: any): x is ReportType {
  return VALID_REPORT_TYPES.includes(x);
}

export default function WriteReportPage() {
  const { reportType } = useParams();

  if (!isValidReportType(reportType)) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <div>WriteReportPage</div>
      <div>Report Type: {reportType}</div>
    </div>
  );
}
