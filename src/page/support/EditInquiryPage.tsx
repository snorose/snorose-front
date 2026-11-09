import { useContext, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { ConfirmModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { Attachment, UploadFile } from '@/feature/attachment/types';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import useInquiryUpdate from '@/feature/support/hook/useInquiryUpdate';
import type { InquiryReadResponse } from '@/feature/support/types';
import { SupportFormView } from '@/feature/support/ui';

import { Option } from '@/types';

export default function EditInquiryPage() {
  const post = useLoaderData() as InquiryReadResponse;

  const { postId: postIdParam } = useParams();
  const inquiryId = Number(postIdParam);

  const { mutate: updateInquiry } = useInquiryUpdate();

  const { modal, setModal } = useContext(ModalContext);

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    INQUIRY_OPTIONS.find((option) => option.key === post.subGroup)
  );
  const [attachments, setAttachments] = useState<Attachment[]>(
    post?.attachments ?? []
  );
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleUpdate = async () => {
    const originalIds = post.attachments.map((at) => at.id);
    const remainingIds = new Set(attachments.map((at) => at.id));
    const deletedIds = originalIds.filter((id) => !remainingIds.has(id));

    await updateInquiry({
      inquiryId,
      title,
      content,
      subGroup: selectedOption!.key,
      oldAttachments: attachments,
      newAttachments: files.map(mapFileToAttachment),
      deleteAttachments: deletedIds,
    });
  };

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
        options={INQUIRY_OPTIONS}
        contentLabel={'문의 내용'}
        placeholders={INQUIRY_PLACEHOLDERS}
        modalId='confirm-inquiry-update'
      />

      {modal.id === 'confirm-inquiry-update' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.INQUIRY_UPDATE}
          onConfirm={handleUpdate}
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
