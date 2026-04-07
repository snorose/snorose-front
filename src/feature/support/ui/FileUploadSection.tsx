import { useId } from 'react';

import { Icon } from '@/shared/component';
import { useToast } from '@/shared/hook';

import styles from './FileUploadSection.module.css';

export default function FileUploadSection({
  fileNames,
  updateFiles,
}: {
  fileNames: string[];
  updateFiles: (file: File[]) => void;
}) {
  const id = useId();
  const { toast } = useToast();

  return (
    <label htmlFor={id} className={styles.container}>
      <input
        className={styles.srOnly}
        id={id}
        type='file'
        accept='image/*'
        onChange={(e) => {
          const files = Array.from(e.target.files);

          if (files.some((file) => !file.type.startsWith('image/'))) {
            toast({ message: '이미지만 업로드할 수 있어요', variant: 'info' });
            return;
          }

          if (fileNames.length + files.length > 3) {
            toast({
              message: '이미지는 3개까지 업로드할 수 있어요',
              variant: 'info',
            });
            return;
          }

          updateFiles(files);
        }}
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
