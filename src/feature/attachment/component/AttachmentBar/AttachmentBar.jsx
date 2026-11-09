import { useState } from 'react';

import {
  IconHashtag,
  IconHashtagThick,
  IconImage,
  IconImageFill,
  IconOpenEditor,
  IconOpenEditorThick,
  IconVideo,
  IconVideoFill,
} from '@snorose/icons';

import { ATTACHMENT_EXTENSION_LIMIT } from '@/shared/constant';

import {
  useAttachmentBarPosition,
  useAttachmentUpload,
} from '@/feature/attachment/hook';
import { FixedMenuEditor } from '@/feature/editor/component';

import styles from './AttachmentBar.module.css';

export default function AttachmentBar({
  attachmentsInfo,
  setAttachmentsInfo,
  editor,
  isTitleFocused,
}) {
  const attachmentBarRef = useAttachmentBarPosition();
  const { changeImageUpload, changeVideoUpload } = useAttachmentUpload({
    attachmentsInfo,
    setAttachmentsInfo,
  });

  // 에디터와 해시태그 버튼의 UI 상태
  const [isEditorIconHovered, setIsEditorIconHovered] = useState(false);
  const [isHashtagIconHovered, setIsHashtagIconHovered] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isEditorIconHighlighted =
    !isTitleFocused && (isEditorOpen || isEditorIconHovered);
  const isHashtagIconHighlighted = !isTitleFocused && isHashtagIconHovered;
  const EditorIcon = isEditorIconHighlighted
    ? IconOpenEditorThick
    : IconOpenEditor;
  const HashtagIcon = isHashtagIconHighlighted ? IconHashtagThick : IconHashtag;

  return (
    <div ref={attachmentBarRef} className={styles.bar}>
      {isEditorOpen && editor && !isTitleFocused && (
        <FixedMenuEditor editor={editor} />
      )}
      <div className={styles.attachmentBar}>
        <label className={styles.uploadControl}>
          <IconImage
            width={24}
            height={24}
            color='var(--blue-3)'
            className={styles.uploadIcon}
            aria-hidden='true'
          />
          <IconImageFill
            width={24}
            height={24}
            color='var(--blue-3)'
            className={styles.uploadIconFill}
            aria-hidden='true'
          />
          {/* 입력칸을 아이콘 위에 유지해 터치 대상과 첨부 메뉴의 기준 위치를 고정한다. */}
          <input
            type='file'
            aria-label='이미지 첨부'
            accept={ATTACHMENT_EXTENSION_LIMIT.imageExtensions.join(', ')}
            className={styles.uploadInput}
            onChange={changeImageUpload}
            multiple
          />
        </label>

        <label className={styles.uploadControl}>
          <IconVideo
            className={styles.uploadIcon}
            width={24}
            height={24}
            color='var(--blue-3)'
            aria-hidden='true'
          />
          <IconVideoFill
            className={styles.uploadIconFill}
            width={24}
            height={24}
            color='var(--blue-3)'
            aria-hidden='true'
          />
          <input
            type='file'
            aria-label='동영상 첨부'
            accept={ATTACHMENT_EXTENSION_LIMIT.videoExtensions.join(', ')}
            className={styles.uploadInput}
            onChange={changeVideoUpload}
            multiple
          />
        </label>

        <EditorIcon
          width={27}
          height={21}
          color='var(--blue-3)'
          className={`${styles.image} ${isTitleFocused ? styles.disabled : ''}`}
          onClick={() => {
            if (isTitleFocused) return;
            setIsEditorOpen((prev) => !prev);
          }}
          onPointerEnter={() => setIsEditorIconHovered(true)}
          onPointerLeave={() => setIsEditorIconHovered(false)}
          onMouseDown={(e) => e.preventDefault()}
        />

        <HashtagIcon
          width={23}
          height={21}
          color='var(--blue-3)'
          className={`${styles.image} ${isTitleFocused ? styles.disabled : ''}`}
          onClick={() => {
            if (isTitleFocused || !editor) return;
            editor.chain().focus().insertContent('#').run();
          }}
          onPointerEnter={() => setIsHashtagIconHovered(true)}
          onPointerLeave={() => setIsHashtagIconHovered(false)}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
