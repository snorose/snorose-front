import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BOARD_ID, QUERY_KEY, TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { createReport } from '@/feature/support/api';
import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';
import {
  REPORT_OPTIONS,
  REPORT_TYPE_MAP,
  ReportType,
} from '@/feature/support/data';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';

export default function WriteReportPage() {
  const { reportType } = useLoaderData() as { reportType: ReportType };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: submit } = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      const { postId } = data;

      createThumbnail(BOARD_ID.inquiryAndReport, postId) //
        .catch((error) => {
          /**
           * TODO: 썸네일 생성 실패는 치명적이지 않으므로, 에러를 사용자에게 알리지 않고 조용히 실패 처리합니다.
           * 에러 로그 수집 (모니터링: sentry)
           */
        });

      toast({ message: TOAST.REPORT.create, variant: 'success' });

      queryClient.removeQueries({
        queryKey: [QUERY_KEY.myInquiriesAndReports],
      });

      navigate(`/report/${postId}`, { replace: true });
    },
    onError: (error) => {
      toast({ message: error.message, variant: 'error' });
    },
  });

  const { dropdown, title, content } = REPORT_PLACEHOLDERS[reportType];
  const targetId = searchParams.get('targetId');

  return (
    <SupportFormView
      submit={({ title, content, selectedOption, files }) =>
        submit({
          reportType: REPORT_TYPE_MAP[reportType],
          targetId,
          title,
          content,
          reportCategory: selectedOption.key!,
          attachments: files.map(mapFileToAttachment),
        })
      }
      options={REPORT_OPTIONS[reportType]}
      contentLabel={'신고 내용'}
      placeholders={{ dropdown, title, content }}
      tag={REPORT_TYPE_TAG[reportType]}
    />
  );
}
