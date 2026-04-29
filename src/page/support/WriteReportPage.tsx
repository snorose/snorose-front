import { useLoaderData } from 'react-router-dom';

import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';
import { REPORT_OPTIONS } from '@/feature/support/data';
import type { ReportParamsLoaderData } from '@/feature/support/loader';
import { SupportFormView } from '@/feature/support/ui';

export default function WriteReportPage() {
  const { reportType, reportParams } =
    useLoaderData() as ReportParamsLoaderData;

  const { dropdown, title, content } = REPORT_PLACEHOLDERS[reportType];

  return (
    <SupportFormView
      submit={() => alert('submit!')}
      options={REPORT_OPTIONS[reportType]}
      contentLabel={'신고 내용'}
      placeholders={{ dropdown, title, content }}
      tag={REPORT_TYPE_TAG[reportType]}
    />
  );
}
