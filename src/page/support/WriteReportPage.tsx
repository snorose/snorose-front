import { useContext, useState } from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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
  REPORT_SUB_GROUP_TAG,
} from '@/feature/support/constant';
import {
  REPORT_OPTIONS,
  REPORT_SUB_GROUP_MAP,
  ReportSubGroup,
} from '@/feature/support/data';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';
import { Option } from '@/types';

export default function WriteReportPage() {
  const { subGroup } = useLoaderData() as { subGroup: ReportSubGroup };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const { modal, setModal } = useContext(ModalContext);
  const { toast } = useToast();

  const { mutate: submitReport } = useMutation({
    mutationFn: () =>
      createReport({
        targetId: targetId!,
        title,
        content,
        subGroup: REPORT_SUB_GROUP_MAP[subGroup],
        reportCause: selectedOption!.key,
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

      queryClient.removeQueries({
        queryKey: [QUERY_KEY.myInquiriesAndReports],
      });

      toast.success(TOAST.REPORT.create, {
        label: '신고 확인',
        action: () => navigate(`/report/${postId}`),
      });

      navigate(-1);
    },

    onError: (error) => {
      if (!axios.isAxiosError(error) || !error.response) {
        toast.error('요청 처리 중 오류가 발생했어요');
        return;
      }

      const { code } = error.response.data;

      if (code === 2007) {
        toast.error('정회원 등업이 필요해요');
        navigate(-1);
        return;
      }

      if (code === 3032) {
        toast.error('첨부 파일은 최대 3개까지 업로드할 수 있어요');
        return;
      }

      if (code === 6103) {
        toast.error('신고 대상이 존재하지 않아요');
        return;
      }

      if (code === 6104) {
        toast.error('동일한 대상에 대한 신고가 아직 처리중이에요');
        return;
      }

      toast.error('잠시 후 다시 시도해주세요');
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
        options={REPORT_OPTIONS[subGroup]}
        contentLabel={'신고 내용'}
        placeholders={REPORT_PLACEHOLDERS[subGroup]}
        tag={REPORT_SUB_GROUP_TAG[subGroup]}
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

// http://localhost:3000/report/write/post?targetId=1725742
