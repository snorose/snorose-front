import { useEffect, useState } from 'react';

import { IconImage, IconVideo, IconX } from '@snorose/icons';

import {
  ATTACHMENT_EXTENSION_LIMIT,
  ATTACHMENT_SIZE_LIMIT,
} from '@/shared/constant';

import { useAttachmentUpload } from '@/feature/attachment/hook';
import { getSafeSrc } from '@/feature/attachment/lib';

import altImage from '@/assets/images/altImage.png';

import styles from './EventAttachmentField.module.css';

export default function EventAttachmentField({
  attachmentsInfo,
  setAttachmentsInfo,
  onDeleteAttachment,
  disabled = false,
}) {
  const { changeImageUpload, changeVideoUpload } = useAttachmentUpload({
    attachmentsInfo,
    setAttachmentsInfo,
  });
  const photoCount = attachmentsInfo.filter(
    ({ type }) => type === 'PHOTO'
  ).length;
  const videoCount = attachmentsInfo.filter(
    ({ type }) => type === 'VIDEO'
  ).length;

  const moveAttachment = (from, to) => {
    if (disabled) return;
    setAttachmentsInfo((previous) => {
      if (
        !Number.isInteger(from) ||
        from < 0 ||
        from >= previous.length ||
        to < 0 ||
        to >= previous.length ||
        from === to
      )
        return previous;
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <section className={styles.field} aria-label='사진·영상 첨부'>
      <div className={styles.heading}>
        <span>
          사진·영상 <span className={styles.optional}>(선택)</span>
        </span>
        <span className={styles.count}>
          사진 {photoCount}/{ATTACHMENT_SIZE_LIMIT.imageQuantity} · 영상{' '}
          {videoCount}/{ATTACHMENT_SIZE_LIMIT.videoQuantity}
        </span>
      </div>
      <div className={styles.uploadArea}>
        <div className={styles.actions}>
          <label className={styles.upload}>
            <IconImage width={18} height={18} aria-hidden='true' /> 사진 추가
            <input
              type='file'
              aria-label='이미지 첨부'
              accept={ATTACHMENT_EXTENSION_LIMIT.imageExtensions.join(', ')}
              multiple
              disabled={disabled}
              onChange={changeImageUpload}
            />
          </label>
          <label className={styles.upload}>
            <IconVideo width={18} height={18} aria-hidden='true' /> 영상 추가
            <input
              type='file'
              aria-label='동영상 첨부'
              accept={ATTACHMENT_EXTENSION_LIMIT.videoExtensions.join(', ')}
              multiple
              disabled={disabled}
              onChange={changeVideoUpload}
            />
          </label>
        </div>
        {attachmentsInfo.length > 0 ? (
          <ul className={styles.previews} aria-label='첨부파일 목록'>
            {attachmentsInfo.map((attachment, index) => (
              <AttachmentCard
                key={`${attachment.id || attachment.file?.lastModified}-${attachment.fileName}-${index}`}
                attachment={attachment}
                index={index}
                count={attachmentsInfo.length}
                disabled={disabled}
                onDelete={() => onDeleteAttachment(index)}
                onMove={moveAttachment}
              />
            ))}
          </ul>
        ) : (
          <p className={styles.hint}>
            버튼을 눌러 사진이나 영상을 추가해주세요.
          </p>
        )}
        {attachmentsInfo.length > 1 && (
          <p className={styles.hint}>
            옆으로 밀어서 확인하고, 화살표로 순서를 바꿀 수 있어요.
          </p>
        )}
      </div>
    </section>
  );
}

function AttachmentCard({
  attachment,
  index,
  count,
  disabled,
  onDelete,
  onMove,
}) {
  const { file, url, fileName, type } = attachment;
  const [src, setSrc] = useState(url || undefined);
  useEffect(() => {
    const previewUrl = getSafeSrc({ file, url });
    setSrc(previewUrl);
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [file, url]);

  return (
    <li
      className={styles.card}
      draggable={!disabled}
      onDragStart={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData('text/plain', String(index));
        event.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const value = event.dataTransfer.getData('text/plain');
        if (value.trim()) onMove(Number(value), index);
      }}
    >
      {type === 'PHOTO' ? (
        <img
          className={styles.media}
          src={src}
          alt={fileName || `첨부 이미지 ${index + 1}`}
          draggable={false}
          onError={(event) => {
            event.currentTarget.src = altImage;
          }}
        />
      ) : (
        <video
          className={styles.media}
          src={src}
          muted
          playsInline
          preload='metadata'
        />
      )}
      <button
        type='button'
        className={styles.delete}
        aria-label={`${fileName} 삭제`}
        disabled={disabled}
        onClick={onDelete}
      >
        <IconX width={14} height={14} aria-hidden='true' />
      </button>
      <div className={styles.order}>
        <button
          type='button'
          aria-label={`${fileName} 앞으로 이동`}
          disabled={disabled || index === 0}
          onClick={() => onMove(index, index - 1)}
        >
          ←
        </button>
        <span aria-label={`${index + 1}번째 첨부파일`}>{index + 1}</span>
        <button
          type='button'
          aria-label={`${fileName} 뒤로 이동`}
          disabled={disabled || index === count - 1}
          onClick={() => onMove(index, index + 1)}
        >
          →
        </button>
      </div>
    </li>
  );
}
