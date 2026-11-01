import { IconX } from '@snorose/icons';

import { AttachmentList } from '@/shared/component';

import styles from './NoticeAttachmentList.module.css';

export default function NoticeAttachmentList({
  attachmentsInfo,
  setAttachmentsInfo,
  onDelete,
}) {
  return (
    <div className={styles.wrapper}>
      <AttachmentList
        attachmentsInfo={attachmentsInfo}
        setAttachmentsInfo={setAttachmentsInfo}
      />
      {attachmentsInfo.map((attachment, index) => (
        <button
          key={`${attachment.fileName}-${attachment.id || attachment.file?.lastModified || index}`}
          type='button'
          className={styles.deleteButton}
          style={{ '--attachment-index': index }}
          aria-label={`${attachment.fileName} 삭제`}
          onClick={() => onDelete(index)}
        >
          <IconX width={12} height={12} color='#fff' aria-hidden='true' />
        </button>
      ))}
    </div>
  );
}
