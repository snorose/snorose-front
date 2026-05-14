import { useId } from 'react';

import { Icon } from '@/shared/component';
import { useToast } from '@/shared/hook';

import { INVALID_NAME_REGEX } from '@/feature/attachment/lib/attachment';
import type { UploadFile } from '@/feature/attachment/types';

import styles from './FileUploadSection.module.css';

const MAX_FILE_COUNT = 3;
const MAX_TOTAL_FILE_SIZE = 10 * 1024 * 1024;

export default function FileUploadSection({
  currentFileCount,
  curruentTotalFileSize,
  setFiles,
}: {
  currentFileCount: number;
  curruentTotalFileSize: number;
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
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

          if (currentFileCount + selectedFiles.length > MAX_FILE_COUNT) {
            e.target.value = '';

            toast({
              message: `이미지는 ${MAX_FILE_COUNT}개까지 업로드할 수 있어요`,
              variant: 'info',
            });

            return;
          }

          const selectedFilesSize = selectedFiles.reduce(
            (total, { size }) => total + size,
            0
          );
          if (curruentTotalFileSize + selectedFilesSize > MAX_TOTAL_FILE_SIZE) {
            e.target.value = '';

            toast({
              message: '10MB까지 올릴 수 있어요',
              variant: 'info',
            });

            return;
          }

          const invalidCharsFound = new Set();

          selectedFiles.forEach(({ name }) => {
            const matches = name.match(INVALID_NAME_REGEX);
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

          setFiles((prev) => [
            ...prev,
            ...selectedFiles.map((file) => ({ file, id: crypto.randomUUID() })),
          ]);

          e.target.value = '';
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
