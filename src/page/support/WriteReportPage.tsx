import { useContext, useState } from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConfirmModal } from '@/shared/component';
import {
  BOARD_ID,
  CONFIRM_MODAL_TEXT,
  QUERY_KEY,
  TOAST,
} from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useToast } from '@/shared/hook';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { Attachment, UploadFile } from '@/feature/attachment/types';
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
import { Option } from '@/types';

export default function WriteReportPage() {
  const { reportType } = useLoaderData() as { reportType: ReportType };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const { modal, setModal } = useContext(ModalContext);
  const { toast } = useToast();

  const { mutate: submitReport } = useMutation({
    mutationFn: () =>
      createReport({
        reportType: REPORT_TYPE_MAP[reportType],
        targetId: targetId!,
        title,
        content,
        reportCategory: selectedOption!.key,
        attachments: files.map(mapFileToAttachment),
      }),

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

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const targetId = searchParams.get('targetId');

  return (
    <>
      <SupportFormView
        title={title}
        content={content}
        selectedOption={selectedOption}
        attachments={attachments}
        files={files}
        setTitle={setTitle}
        setContent={setContent}
        setSelectedOption={setSelectedOption}
        setAttachments={setAttachments}
        setFiles={setFiles}
        options={REPORT_OPTIONS[reportType]}
        contentLabel={'신고 내용'}
        placeholders={REPORT_PLACEHOLDERS[reportType]}
        tag={REPORT_TYPE_TAG[reportType]}
        modalId='confirm-report-write'
      />

      {modal.id === 'confirm-report-write' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.REPORT_CREATE}
          onConfirm={submitReport}
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
