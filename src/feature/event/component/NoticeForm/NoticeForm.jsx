import { useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import styles from './NoticeForm.module.css';

export default function NoticeForm({ data, onChange, onValid }) {
  useEffect(() => {
    const valid = !!(data.title.trim() && data.content.trim());
    onValid(valid);
  }, [data.title, data.content, onValid]);

  return (
    <div className={styles.noticeArea}>
      <TextareaAutosize
        className={styles.title}
        placeholder='제목을 입력해주세요'
        value={data.title}
        onChange={(e) => onChange('title', e.target.value)}
      />
      <TextareaAutosize
        className={styles.content}
        placeholder='내용을 작성해주세요'
        value={data.content}
        onChange={(e) => onChange('content', e.target.value)}
      />
    </div>
  );
}
