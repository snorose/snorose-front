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
import { updateInquiry } from '@/feature/support/api';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import type { InquiryDTO } from '@/feature/support/types';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';
import { Option } from '@/types';

export default function EditInquiryPage() {
  const post = useLoaderData() as InquiryDTO;

  const { postId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { modal, setModal } = useContext(ModalContext);
  const { toast } = useToast();

  const { mutate: submitInquiry } = useMutation({
    mutationFn: () => {
      const originalIds = post.attachments.map((at) => at.id);
      const remainingIds = new Set(attachments.map((at) => at.id));
      const deletedIds = originalIds.filter((id) => !remainingIds.has(id));

      return updateInquiry({
        postId: postId!,
        title,
        content,
        targetUrl: url,
        inquiryCategory: selectedOption.key,
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

      toast({ message: TOAST.INQUIRY.update, variant: 'success' });

      queryClient.invalidateQueries({ queryKey: QUERY_KEY.post(postId) });

      navigate(`/inquiry/${postId}`, { replace: true });
    },

    onError: (error) => {
      toast({ message: error.message, variant: 'error' });
    },
  });

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [url, setUrl] = useState(post.link ?? '');
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    INQUIRY_OPTIONS.find((option) => option.key === post.inquiryCategory)
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
        modalId='confirm-inquiry-update'
      />

      {modal.id === 'confirm-inquiry-update' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.INQUIRY_UPDATE}
          onConfirm={submitInquiry}
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
