import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { createInquiry } from '@/feature/support/api';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';
import { Option } from '@/types';

export default function WriteInquiryPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { modal, setModal } = useContext(ModalContext);
  const { toast } = useToast();

  const { mutate: submitInquiry } = useMutation({
    mutationFn: () =>
      createInquiry({
        title,
        content,
        inquiryCategory: selectedOption.key,
        target: url,
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

      toast({ message: TOAST.INQUIRY.create, variant: 'success' });

      queryClient.removeQueries({
        queryKey: [QUERY_KEY.myInquiriesAndReports],
      });

      navigate(`/inquiry/${postId}`, { replace: true });
    },

    onError: (error) => {
      toast({ message: error.message, variant: 'error' });
    },
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [files, setFiles] = useState<UploadFile[]>([]);

  return (
    <>
      <SupportFormView
        title={title}
        content={content}
        url={url}
        selectedOption={selectedOption}
        attachments={attachments}
        files={files}
        setTitle={setTitle}
        setContent={setContent}
        setUrl={setUrl}
        setSelectedOption={setSelectedOption}
        setAttachments={setAttachments}
        setFiles={setFiles}
        options={INQUIRY_OPTIONS}
        contentLabel={'문의 내용'}
        placeholders={INQUIRY_PLACEHOLDERS}
        showLinkField
        modalId='confirm-inquiry-write'
      />

      {modal.id === 'confirm-inquiry-write' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.INQUIRY_CREATE}
          onConfirm={() => {
            submitInquiry();
          }}
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
