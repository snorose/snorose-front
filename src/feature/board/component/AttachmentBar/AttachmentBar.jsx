import { React, useRef, useState } from 'react';

import { Icon } from '@/shared/component';
import { ATTACHMENT_EXTENSION_LIMIT } from '@/shared/constant';
import { useAttachmentUpload } from '@/feature/attachment/hook';

import styles from './AttachmentBar.module.css';

export default function AttachmentBar({ attachmentsInfo, setAttachmentsInfo }) {
  const img = useRef();
  const vid = useRef();

  const { changeImageUpload, changeVideoUpload } = useAttachmentUpload({
    attachmentsInfo,
    setAttachmentsInfo,
  });

  //이미지*영상 첨부 버튼의 UI 상태를 좌우함
  const [isImageIconHighlighted, setIsImageIconHighlighted] = useState(false);
  const [isVideoIconHighlighted, setIsVideoIconHighlighted] = useState(false);

  return (
    <div className={styles.bar}>
      <div className={styles.attachmentBar}>
        <Icon
          id={isImageIconHighlighted ? 'image-fill' : 'image'}
          width={24}
          height={24}
          className={styles.image}
          onClick={() => {
            img.current.click();
          }}
          onPointerEnter={() => setIsImageIconHighlighted(true)}
          onPointerLeave={() => setIsImageIconHighlighted(false)}
        />
        <input
          type='file'
          accept={ATTACHMENT_EXTENSION_LIMIT.imageExtensions.join(', ')}
          className={styles.imageInput}
          ref={img}
          onChange={changeImageUpload}
          multiple
        />
        <Icon
          id={isVideoIconHighlighted ? 'video-fill' : 'video'}
          width={24}
          height={24}
          className={styles.image}
          onClick={() => {
            vid.current.click();
          }}
          onPointerEnter={() => setIsVideoIconHighlighted(true)}
          onPointerLeave={() => setIsVideoIconHighlighted(false)}
        />
        <input
          type='file'
          accept={ATTACHMENT_EXTENSION_LIMIT.videoExtensions.join(', ')}
          className={styles.videoInput}
          ref={vid}
          onChange={changeVideoUpload}
          multiple
        />
      </div>
    </div>
  );
}
