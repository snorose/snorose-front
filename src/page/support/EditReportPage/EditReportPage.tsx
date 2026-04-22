import { useLoaderData } from 'react-router-dom';

import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_MAP,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';
import { REPORT_OPTIONS } from '@/feature/support/data';
import type { ReportDTO } from '@/feature/support/types';
import { SupportFormView } from '@/feature/support/ui';

export default function EditReportPage() {
  const post = useLoaderData() as ReportDTO;

  const reportType = REPORT_TYPE_MAP[post.reportType];

  const { dropdown, title, content } = REPORT_PLACEHOLDERS[reportType];

  return (
    <SupportFormView
      post={post}
      initialOption={REPORT_OPTIONS[reportType][post.category]}
      submit={() => alert('submit!')}
      options={REPORT_OPTIONS[reportType]}
      contentLabel={'신고 내용'}
      placeholders={{ dropdown, title, content }}
      tag={REPORT_TYPE_TAG[reportType]}
    />
  );
}
