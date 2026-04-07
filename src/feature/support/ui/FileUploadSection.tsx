import { useId } from 'react';

import { Icon } from '@/shared/component';
import { useToast } from '@/shared/hook';

import type { UploadFile } from '@/feature/attachment/types';

import styles from './FileUploadSection.module.css';

export default function FileUploadSection({
  fileCount,
  updateFiles,
}: {
  fileCount: number;
  updateFiles: (file: UploadFile[]) => void;
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

          if (fileCount + files.length > 3) {
            toast({
              message: '이미지는 3개까지 업로드할 수 있어요',
              variant: 'info',
            });
            return;
          }

          updateFiles(files.map((file) => ({ file, id: crypto.randomUUID() })));
        }}
        multiple
      />

      <div className={styles.left}>
        <Icon id='clip-board-list' width={24} height={24} />
        <div>첨부파일</div>
      </div>

      <div className={styles.right}>
        <span className={styles.placeholder}>파일을 첨부하세요</span>
      </div>
    </label>
  );
}
