import { useContext, useState } from 'react';

import { ConfirmModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { Attachment, UploadFile } from '@/feature/attachment/types';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import useInquiryCreate from '@/feature/support/hook/useInquiryCreate';
import { SupportFormView } from '@/feature/support/ui';

import { Option } from '@/types';

export default function WriteInquiryPage() {
  const { mutate: createInquiry } = useInquiryCreate();

  const { modal, setModal } = useContext(ModalContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
        options={INQUIRY_OPTIONS}
        contentLabel={'문의 내용'}
        placeholders={INQUIRY_PLACEHOLDERS}
        modalId='confirm-inquiry-write'
      />

      {modal.id === 'confirm-inquiry-write' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.INQUIRY_CREATE}
          onConfirm={() =>
            createInquiry({
              title,
              content,
              subGroup: selectedOption!.key,
              attachments: files.map(mapFileToAttachment),
            })
          }
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
