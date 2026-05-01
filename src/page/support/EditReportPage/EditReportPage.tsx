import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { BOARD_ID } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { updateReport } from '@/feature/support/api';
import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';
import { REPORT_OPTIONS, ReportType } from '@/feature/support/data';
import type { ReportDTO } from '@/feature/support/types';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';

export default function EditReportPage() {
  const post = useLoaderData() as ReportDTO;
  const reportType = post.reportType.toLowerCase() as ReportType;

  const { postId } = useParams();
  const navigate = useNavigate();

  const { toast } = useToast();

  const { mutate: submit } = useMutation({
    mutationFn: updateReport,
    onSuccess: (data) => {
      const { postId } = data;

      navigate(`/report/${postId}`, { replace: true });

      createThumbnail(BOARD_ID.inquiryAndReport, postId) //
        .catch((error) => {
          /**
           * TODO: 썸네일 생성 실패는 치명적이지 않으므로, 에러를 사용자에게 알리지 않고 조용히 실패 처리합니다.
           * 에러 로그 수집 (모니터링: sentry)
           */
        });
    },
    onError: (error) => {
      console.log(error);
      toast({ message: error.message, variant: 'error' });
    },
  });

  const { dropdown, title, content } = REPORT_PLACEHOLDERS[reportType];

  return (
    <SupportFormView
      post={post}
      initialOption={REPORT_OPTIONS[reportType].find(
        (option) => option.key === post.reportCategory
      )}
      submit={({ title, content, selectedOption, attachments, files }) => {
        const originalIds = post.attachments.map((at) => at.id);
        const remainingIds = new Set(attachments.map((at) => at.id));
        const deletedIds = originalIds.filter((id) => !remainingIds.has(id));

        submit({
          postId,
          title,
          content,
          reportCategory: selectedOption.key,
          oldAttachments: attachments,
          newAttachments: files.map(mapFileToAttachment),
          deleteAttachments: deletedIds,
        });
      }}
      options={REPORT_OPTIONS[reportType]}
      contentLabel={'신고 내용'}
      placeholders={{ dropdown, title, content }}
      tag={REPORT_TYPE_TAG[reportType]}
    />
  );
}
