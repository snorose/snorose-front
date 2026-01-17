import { useId, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import {
  CloseAppBar,
  DropdownBlue,
  Icon,
  Profile,
  TextFieldBlue,
  TextareaFieldBlue,
} from '@/shared/component';

import { NotFoundPage } from '@/page/etc';

import { REPORT_OPTION } from '@/feature/report/data';
import { REPORT_PLACEHOLDERS } from '@/feature/report/constant';

import { Option } from '@/types';

import styles from './WriteReportPage.module.css';

type ReportType = (typeof VALID_REPORT_TYPES)[number];

const VALID_REPORT_TYPES = ['post', 'comment', 'user', 'exam'] as const;

function isValidReportType(x: any): x is ReportType {
  return VALID_REPORT_TYPES.includes(x);
}

export default function WriteReportPage() {
  const { reportType } = useParams();
  const { userInfo } = useAuth();

  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const updateOption = (option: Option) => setSelectedOption(option);
  const updateFiles = (files: File[]) => setFiles(files);

  const placeholder = REPORT_PLACEHOLDERS[reportType];
  const options = REPORT_OPTION[reportType];

  if (!isValidReportType(reportType)) {
    return <NotFoundPage />;
  }

  if (!userInfo) {
    return null;
  }

  const disabled =
    !selectedOption || title.trim() === '' || content.trim() === '';

  return (
    <div className={styles.container}>
      <CloseAppBar backgroundColor={'#eaf5fd'}>
        <SubmitButton disabled={disabled} />
      </CloseAppBar>

      <DropdownBlue>
        <DropdownBlue.Trigger>
          {selectedOption?.label ?? placeholder.dropdown}
        </DropdownBlue.Trigger>

        <DropdownBlue.Menu>
          {options.map((option) => (
            <DropdownBlue.Item
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
            placeholder={placeholder.title}
            value={title}
            onChange={(next) => setTitle(next)}
          />
        </TextFieldBlue>

        <TextareaFieldBlue>
          <TextareaFieldBlue.Label>신고 내용</TextareaFieldBlue.Label>
          <TextareaFieldBlue.Input
            placeholder={placeholder.content}
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
