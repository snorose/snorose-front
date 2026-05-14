import { useContext, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

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
import { updateReport } from '@/feature/support/api';
import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';
import { REPORT_OPTIONS, ReportType } from '@/feature/support/data';
import type { ReportDTO } from '@/feature/support/types';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';
import { Option } from '@/types';

export default function EditReportPage() {
  const post = useLoaderData() as ReportDTO;
  const reportType = post.reportType.split('_')[0].toLowerCase() as ReportType;

  const { postId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { modal, setModal } = useContext(ModalContext);
  const { toast } = useToast();

  const { mutate: submitReport } = useMutation({
    mutationFn: () => {
      const originalIds = post.attachments.map((at) => at.id);
      const remainingIds = new Set(attachments.map((at) => at.id));
      const deletedIds = originalIds.filter((id) => !remainingIds.has(id));

      return updateReport({
        postId: postId!,
        title,
        content,
        reportCategory: selectedOption!.key,
        oldAttachments: attachments,
        newAttachments: files.map(mapFileToAttachment),
        deleteAttachments: deletedIds,
      });
    },

    onSuccess: (data) => {
      const { postId } = data;

      createThumbnail(BOARD_ID.inquiryAndReport, postId) //
        .catch((error) => {
          /**
           * TODO: 썸네일 생성 실패는 치명적이지 않으므로, 에러를 사용자에게 알리지 않고 조용히 실패 처리합니다.
           * 에러 로그 수집 (모니터링: sentry)
           */
        });

      toast({ message: TOAST.REPORT.update, variant: 'success' });

      queryClient.invalidateQueries({ queryKey: QUERY_KEY.post(postId) });

      navigate(`/report/${postId}`, { replace: true });
    },

    onError: (error) => {
      toast({ message: error.message, variant: 'error' });
    },
  });

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    REPORT_OPTIONS[reportType].find(
      (option) => option.key === post.inquiryCategory
    )
  );
  const [attachments, setAttachments] = useState<Attachment[]>(
    post?.attachments ?? []
  );
  const [files, setFiles] = useState<UploadFile[]>([]);

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
        modalId='confirm-report-update'
      />

      {modal.id === 'confirm-report-update' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.REPORT_UPDATE}
          onConfirm={submitReport}
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
