import { useEffect } from 'react';
import { validateRequiredFields } from '@/feature/event/lib';
import { DateTime } from '@/shared/lib';
import { TextField, DateField } from '@/feature/event/component';
import styles from './EventForm.module.css';

export default function EventForm({
  formType,
  data,
  onChange,
  onValid,
  errors,
}) {
  const today = new Date().toISOString().slice(0, 16);

  const handleDrawCountChange = (e) => {
    const value = e.target.value;
    onChange('drawCount', value);
  };

  const handleDrawCountBlur = () => {
    const num = Number(data.drawCount);
    if (!num || num < 1) {
      onChange('drawCount', 1);
    } else {
      onChange('drawCount', num);
    }
  };

  useEffect(() => {
    onValid(validateRequiredFields(formType, data, errors));
  }, [formType, data, errors, onValid]);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <p>제목</p>
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
        <p>
          {formType === 'theater'
            ? '공연명'
            : formType === 'movie'
              ? '영화명'
              : '주최'}
        </p>
        <TextField
          label='호스트'
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
          <p>장소</p>
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

      {/* 날짜 그룹 */}
      <p>응모 날짜</p>
      <DateField
        label='시작일'
        name='startAt'
        type='datetime-local'
        value={DateTime.format(data.startAt, 'ISO').slice(0, 16)}
        min={today}
        onChange={onChange}
        error={errors.startAt}
      />
      <DateField
        label='종료일'
        name='endAt'
        type='datetime-local'
        value={DateTime.format(data.endAt, 'ISO').slice(0, 16)}
        min={data.startAt || today}
        onChange={onChange}
        error={errors.endAt}
      />
      <hr className={styles.divider} />
      <DateField
        label='당첨자 발표일'
        name='announceAt'
        type='datetime-local'
        value={DateTime.format(data.announceAt, 'ISO').slice(0, 16)}
        min={data.endAt || today}
        onChange={onChange}
        error={errors.announceAt}
      />

      {/* 추첨 인원 */}
      <div className={styles.drawCount}>
        <p>추첨 인원</p>
        <div className={styles.counterControls}>
          <button
            className={styles.minus}
            onClick={() =>
              onChange(
                'drawCount',
                Math.max(Number(data.drawCount || 1) - 1, 1)
              )
            }
            disabled={data.drawCount <= 1}
          >
            -
          </button>
          <input
            type='number'
            className={styles.drawNumber}
            value={data.drawCount ?? ''}
            onChange={handleDrawCountChange}
            onBlur={handleDrawCountBlur}
            min={1}
          />
          <button
            className={styles.plus}
            onClick={() =>
              onChange('drawCount', Number(data.drawCount || 1) + 1)
            }
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <p>상세 설명</p>
        <TextField
          label='상세 설명'
          name='content'
          value={data.content}
          placeholder='이벤트 추첨 방식, 유의사항 등 상세한 설명을 입력해주세요'
          onChange={onChange}
          error={errors.content}
        />
      </div>

      <div className={styles.section}>
        <p>연계 링크</p>
        <TextField
          label='연계 링크'
          name='link'
          value={data.link}
          placeholder={
            ['theater', 'movie'].includes(formType)
              ? '추첨 구글폼을 넣어주세요'
              : '관련 링크를 넣어주세요'
          }
          onChange={onChange}
          error={errors.link}
          data={data}
        />
      </div>
    </div>
  );
}
