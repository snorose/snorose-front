import { useContext, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';

import { ConfirmModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { Attachment, UploadFile } from '@/feature/attachment/types';
import {
  REPORT_PLACEHOLDERS,
  REPORT_SUB_GROUP_TAG,
} from '@/feature/support/constant';
import {
  REPORT_OPTIONS,
  REPORT_SUB_GROUP_MAP,
  ReportSubGroup,
} from '@/feature/support/data';
import useReportCreate from '@/feature/support/hook/useReportCreate';
import { SupportFormView } from '@/feature/support/ui';

import { Option } from '@/types';

export default function WriteReportPage() {
  const { subGroup } = useLoaderData() as { subGroup: ReportSubGroup };
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('targetId');

  const { mutate: createReport } = useReportCreate();

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
        options={REPORT_OPTIONS[subGroup]}
        contentLabel={'신고 내용'}
        placeholders={REPORT_PLACEHOLDERS[subGroup]}
        tag={REPORT_SUB_GROUP_TAG[subGroup]}
        modalId='confirm-report-write'
      />

      {modal.id === 'confirm-report-write' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.REPORT_CREATE}
          onConfirm={() =>
            createReport({
              targetId: targetId!,
              title,
              content,
              subGroup: REPORT_SUB_GROUP_MAP[subGroup],
              reportCause: selectedOption!.key,
              attachments: files.map(mapFileToAttachment),
            })
          }
          onCancel={() => setModal({ id: null })}
        />
      )}
    </>
  );
}
