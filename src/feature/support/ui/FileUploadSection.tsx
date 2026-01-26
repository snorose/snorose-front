import { useId } from 'react';

import { Icon } from '@/shared/component';

import styles from './FileUploadSection.module.css';

export default function FileUploadSection({
  files,
  updateFiles,
}: {
  files: File[];
  updateFiles: (files: File[]) => void;
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
        <Icon
          id='clip-board-list'
          fill={'#bfd7ec'}
          stroke={'#5f86bf'}
          width={24}
          height={24}
        />
        <div>첨부파일</div>
      </div>

      <div className={styles.right}>
        {files.length > 0 && (
          <span className={styles.fileName}>
            {files.map((file) => file.name).join(', ')}
          </span>
        )}

        {files.length === 0 && (
          <span className={styles.placeholder}>파일을 첨부하세요</span>
        )}
      </div>
    </label>
  );
}
