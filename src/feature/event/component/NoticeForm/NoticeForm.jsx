import { useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { AttachmentList } from '@/shared/component';

import { EditorContainer } from '@/feature/editor/component';
import { preserveEmptyParagraphs, sanitizeHtml } from '@/feature/editor/lib';

import styles from './NoticeForm.module.css';

export default function NoticeForm({
  data,
  editor,
  onChange,
  onValid,
  onEditorReady,
  onTitleFocusChange,
  attachmentsInfo,
  setAttachmentsInfo,
  withEditor = false,
}) {
  useEffect(() => {
    const content = withEditor ? editor?.getText() : data.content;
    const valid = Boolean(data.title.trim() && content?.trim());
    onValid(valid);
  }, [data.title, data.content, editor, onValid, withEditor]);

  return (
    <div className={styles.noticeArea}>
      <TextareaAutosize
        className={styles.title}
        placeholder='제목을 입력해주세요'
        value={data.title}
        onChange={(e) => {
          if (e.target.value.length <= 127) onChange('title', e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
          }
        }}
        onFocus={() => onTitleFocusChange?.(true)}
        onBlur={() => onTitleFocusChange?.(false)}
      />
      {withEditor ? (
        <>
          <EditorContainer
            placeholder='내용'
            text={data.content}
            onEditorReady={onEditorReady}
            onChangeEditor={(editor) =>
              onChange(
                'content',
                sanitizeHtml(preserveEmptyParagraphs(editor.getHTML()))
              )
            }
          />
          <AttachmentList
            attachmentsInfo={attachmentsInfo}
            setAttachmentsInfo={setAttachmentsInfo}
          />
        </>
      ) : (
        <TextareaAutosize
          className={styles.content}
          placeholder='내용을 작성해주세요'
          value={data.content}
          onChange={(e) => onChange('content', e.target.value)}
        />
      )}
    </div>
  );
}
