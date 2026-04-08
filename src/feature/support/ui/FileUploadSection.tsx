import { useId } from 'react';

import { Icon } from '@/shared/component';
import { useToast } from '@/shared/hook';

import type { UploadFile } from '@/feature/attachment/types';

import styles from './FileUploadSection.module.css';

const LIMIT_SIZE = 10 * 1024 * 1024;

export default function FileUploadSection({
  currentFileCount,
  curruentTotalFileSize,
  updateFiles,
}: {
  currentFileCount: number;
  curruentTotalFileSize: number;
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
          const selectedFiles = Array.from(e.target.files);

          if (selectedFiles.some((file) => !file.type.startsWith('image/'))) {
            e.target.value = '';

            toast({ message: '이미지만 업로드할 수 있어요', variant: 'info' });

            return;
          }

          if (currentFileCount + selectedFiles.length > 3) {
            e.target.value = '';

            toast({
              message: '이미지는 3개까지 업로드할 수 있어요',
              variant: 'info',
            });

            return;
          }

          const selectedFilesSize = selectedFiles.reduce(
            (total, { size }) => total + size,
            0
          );
          if (curruentTotalFileSize + selectedFilesSize > LIMIT_SIZE) {
            e.target.value = '';

            toast({
              message: '10MB까지 올릴 수 있어요',
              variant: 'info',
            });

            return;
          }

          const invalidCharsRegex = /[^\p{L}\p{N} ~!@$^&()\-_=\[\]{};`',.]/gu;
          const invalidCharsFound = new Set();

          selectedFiles.forEach(({ name }) => {
            const matches = name.match(invalidCharsRegex);
            if (matches) {
              matches.forEach((char) => invalidCharsFound.add(char));
            }
          });

          if (invalidCharsFound.size > 0) {
            e.target.value = '';

            const invalidCharsString = Array.from(invalidCharsFound).join(', ');

            toast({
              message: `앗! 파일 이름에서 다음 문자를 지워주세요 ${invalidCharsString} `,
              variant: 'info',
            });

            return;
          }

          updateFiles(
            selectedFiles.map((file) => ({ file, id: crypto.randomUUID() }))
          );
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
