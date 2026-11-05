import { useEffect } from 'react';

import { DateTime } from '@/shared/lib';

import { EditorContainer } from '@/feature/editor/component';
import { preserveEmptyParagraphs, sanitizeHtml } from '@/feature/editor/lib';
import { DateField, TextField } from '@/feature/event/component';
import { validateRequiredFields } from '@/feature/event/lib';

import EventAttachmentField from '../EventAttachmentField/EventAttachmentField';
import styles from './EventForm.module.css';

export default function EventForm({
  formType,
  data,
  onChange,
  onValid,
  errors,
  onEditorReady,
  attachmentsInfo = [],
  setAttachmentsInfo,
  onDeleteAttachment,
}) {
  useEffect(() => {
    onValid(validateRequiredFields(formType, data, errors));
  }, [formType, data, errors, onValid]);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <RequiredLabel>제목</RequiredLabel>
        <TextField
          label='제목'
          name='title'
          value={data.title}
          placeholder='이벤트 제목을 입력해주세요'
          onChange={onChange}
          error={errors.title}
        />
      </div>
      <div className={styles.section}>
        <RequiredLabel>
          {formType === 'theater'
            ? '공연명'
            : formType === 'movie'
              ? '영화명'
              : '주최'}
        </RequiredLabel>
        <TextField
          label={
            formType === 'theater'
              ? '공연명'
              : formType === 'movie'
                ? '영화명'
                : '주최'
          }
          name='host'
          value={data.host}
          placeholder={
            formType === 'theater'
              ? '공연명을 입력해주세요'
              : formType === 'movie'
                ? '영화명을 입력해주세요'
                : '주최사를 입력해주세요'
          }
          onChange={onChange}
          error={errors.host}
        />
      </div>
      {['theater', 'movie'].includes(formType) && (
        <div className={styles.section}>
          <RequiredLabel>장소</RequiredLabel>
          <TextField
            label='장소'
            name='place'
            value={data.place}
            placeholder='장소를 입력해주세요'
            onChange={onChange}
            error={errors.place}
          />
        </div>
      )}

      <div className={styles.section}>
        <RequiredLabel>상세 설명</RequiredLabel>
        <div
          className={`${styles.editorArea} ${errors.content ? styles.error : ''}`}
        >
          <EditorContainer
            placeholder='이벤트 추첨 방식, 유의사항 등 상세한 설명을 입력해주세요'
            text={data.content}
            onEditorReady={onEditorReady}
            onChangeEditor={(editor) =>
              onChange(
                'content',
                sanitizeHtml(preserveEmptyParagraphs(editor.getHTML()))
              )
            }
          />
        </div>
        {errors.content && (
          <span className={styles.errorMessage} role='alert'>
            {errors.content}
          </span>
        )}
      </div>

      <EventAttachmentField
        attachmentsInfo={attachmentsInfo}
        setAttachmentsInfo={setAttachmentsInfo}
        onDeleteAttachment={onDeleteAttachment}
      />

      <div className={styles.section}>
        <p>
          신청 링크 <span className={styles.optional}>(선택)</span>
        </p>
        <TextField
          label='신청 링크'
          name='link'
          value={data.link}
          placeholder='링크를 입력하면 상세 페이지에 신청 버튼이 표시돼요.'
          onChange={onChange}
          error={errors.link}
          data={data}
        />
      </div>

      <div className={styles.section}>
        <p>
          응모 날짜 <span className={styles.optional}>(선택)</span>
        </p>
        <DateField
          label='시작일'
          name='startAt'
          type='datetime-local'
          value={
            data.startAt
              ? DateTime.format(data.startAt, 'ISO').slice(0, 16)
              : ''
          }
          onChange={onChange}
          error={errors.startAt}
        />
        <DateField
          label='종료일'
          name='endAt'
          type='datetime-local'
          value={
            data.endAt ? DateTime.format(data.endAt, 'ISO').slice(0, 16) : ''
          }
          min={data.startAt}
          onChange={onChange}
          error={errors.endAt}
        />
        <DateField
          label='당첨자 발표일'
          name='announceAt'
          type='datetime-local'
          value={
            data.announceAt
              ? DateTime.format(data.announceAt, 'ISO').slice(0, 16)
              : ''
          }
          min={data.endAt}
          onChange={onChange}
          error={errors.announceAt}
        />
      </div>
      <div className={styles.section}>
        <p>
          추첨 인원 <span className={styles.optional}>(선택)</span>
        </p>
        <TextField
          label='추첨 인원'
          name='drawCount'
          value={data.drawCount}
          placeholder='비워두면 표시하지 않아요. (예: 10명)'
          onChange={onChange}
          error={errors.drawCount}
        />
      </div>
    </div>
  );
}

function RequiredLabel({ children }) {
  return (
    <p>
      {children}
      <span className={styles.required} aria-label='필수 입력'>
        *
      </span>
    </p>
  );
}
