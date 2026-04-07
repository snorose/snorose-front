import { useId } from 'react';

import { Icon } from '@/shared/component';

import styles from './FileUploadSection.module.css';

export default function FileUploadSection({
  fileNames,
  updateFiles,
}: {
  fileNames: string[];
  updateFiles: (file: File[]) => void;
}) {
  const id = useId();

  return (
    <label htmlFor={id} className={styles.container}>
      <input
        className={styles.srOnly}
        id={id}
        type='file'
        onChange={(e) => updateFiles(Array.from(e.target.files))}
        multiple
      />

      <div className={styles.left}>
        <Icon id='clip-board-list' width={24} height={24} />
        <div>첨부파일</div>
      </div>

      <div className={styles.right}>
        {fileNames.length > 0 && (
          <span className={styles.fileName}>{fileNames.join(', ')}</span>
        )}

        {fileNames.length === 0 && (
          <span className={styles.placeholder}>파일을 첨부하세요</span>
        )}
      </div>
    </label>
  );
}
