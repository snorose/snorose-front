import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import {
  CloseAppBar,
  DropdownBlue,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';
import { useAuth } from '@/shared/hook';

import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';
import { REPORT_OPTIONS } from '@/feature/support/data';
import type { ReportParamsLoaderData } from '@/feature/support/loader';
import { FileUploadSection, SubmitButton } from '@/feature/support/ui';

import type { Option } from '@/types';

import styles from './WriteReportPage.module.css';

export default function WriteReportPage() {
  const { reportType, reportParams } =
    useLoaderData() as ReportParamsLoaderData;

  const { userInfo } = useAuth();

  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const updateOption = (option: Option) => setSelectedOption(option);
  const updateFiles = (files: File[]) => setFiles(files);

  const placeholder = REPORT_PLACEHOLDERS[reportType];
  const options = REPORT_OPTIONS[reportType];

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
          <span className={styles.reportType}>
            [{REPORT_TYPE_TAG[reportType]} 신고]
          </span>
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
