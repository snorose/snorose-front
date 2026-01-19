import { useId, useState } from 'react';

import { useAuth } from '@/shared/hook';
import {
  CloseAppBar,
  DropdownBlue,
  Icon,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';

import { INQUIRY_OPTION } from '@/feature/support/data';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';

import { Option } from '@/types';

import styles from './WriteInquiryPage.module.css';

export default function WriteInquiryPage() {
  const { userInfo } = useAuth();

  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const updateOption = (option: Option) => setSelectedOption(option);
  const updateFiles = (files: File[]) => setFiles(files);

  const disabled =
    !selectedOption || title.trim() === '' || content.trim() === '';

  if (!userInfo) {
    return null;
  }

  return (
    <div className={styles.container}>
      <CloseAppBar backgroundColor={'#eaf5fd'}>
        <SubmitButton disabled={disabled} />
      </CloseAppBar>

      <DropdownBlue className={styles.dropdown}>
        <DropdownBlue.Trigger>
          {selectedOption?.label ?? INQUIRY_PLACEHOLDERS.dropdown}
        </DropdownBlue.Trigger>

        <DropdownBlue.Menu>
          {INQUIRY_OPTION.map((option) => (
            <DropdownBlue.Item
              key={option.key}
              id={option.key}
              selected={selectedOption?.key === option.key}
              onClick={() => updateOption(option)}
            >
              {option.label}
            </DropdownBlue.Item>
          ))}
        </DropdownBlue.Menu>
      </DropdownBlue>

      <Profile userRoleId={userInfo.userRoleId} nickname={userInfo.nickname} />

      <div className={styles.form}>
        <TextFieldBlue>
          <TextFieldBlue.Label>제목</TextFieldBlue.Label>
          <TextFieldBlue.Input
            placeholder={INQUIRY_PLACEHOLDERS.title}
            value={title}
            onChange={(next) => setTitle(next)}
          />
        </TextFieldBlue>

        <TextFieldBlue>
          <TextFieldBlue.Label>게시글 링크</TextFieldBlue.Label>
          <TextFieldBlue.Input
            placeholder={INQUIRY_PLACEHOLDERS.url}
            value={url}
            onChange={(next) => setUrl(next)}
          />
        </TextFieldBlue>

        <TextareaFieldBlue>
          <TextareaFieldBlue.Label>문의 내용</TextareaFieldBlue.Label>
          <TextareaFieldBlue.Input
            placeholder={INQUIRY_PLACEHOLDERS.content}
            value={content}
            onChange={(next) => setContent(next)}
            minRows={5}
            maxRows={10}
          />
        </TextareaFieldBlue>

        <FileUploadSection files={files} updateFiles={updateFiles} />
      </div>
    </div>
  );
}

function FileUploadSection({ files, updateFiles }) {
  const id = useId();

  return (
    <label htmlFor={id} className={styles.fileContainer}>
      <input
        id={id}
        type='file'
        onChange={(e) => updateFiles(Array.from(e.target.files))}
        multiple
        hidden
      />

      <div>
        <Icon
          id='clip-board-list'
          fill={'#bfd7ec'}
          stroke={'#5f86bf'}
          width={24}
          height={24}
        />
        <div>첨부파일</div>
      </div>

      {files.length === 0 && (
        <div className={`${styles.fileName} ${styles.placeholder}`}>
          파일을 첨부하세요
        </div>
      )}
      {files.length > 0 && (
        <div className={styles.fileName}>{files[0].name}</div>
      )}
    </label>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      className={styles.submit}
      onClick={() => alert('submit!')}
      disabled={disabled}
    >
      등록
    </button>
  );
}
