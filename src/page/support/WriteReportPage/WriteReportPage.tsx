import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import {
  CloseAppBar,
  DropdownBlue,
  Profile,
  TextFieldBlue,
  TextareaFieldBlue,
} from '@/shared/component';

import { NotFoundPage } from '@/page/etc';

import { SubmitButton, FileUploadSection } from '@/feature/support/ui';
import { REPORT_OPTION } from '@/feature/support/data';
import { REPORT_PLACEHOLDERS } from '@/feature/support/constant';

import { Option } from '@/types';

import styles from './WriteReportPage.module.css';

const VALID_REPORT_TYPES = ['post', 'comment', 'user', 'exam'] as const;

type ReportType = (typeof VALID_REPORT_TYPES)[number];

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
        <SubmitButton onClick={() => alert('submit!')} disabled={disabled}>
          등록
        </SubmitButton>
      </CloseAppBar>

      <DropdownBlue className={styles.dropdown}>
        <DropdownBlue.Trigger>
          {selectedOption?.label ?? placeholder.dropdown}
        </DropdownBlue.Trigger>

        <DropdownBlue.Menu>
          {options.map((option) => (
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
