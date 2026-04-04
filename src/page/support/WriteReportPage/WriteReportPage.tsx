import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
import { REPORT_OPTIONS } from '@/feature/support/data';
import {
  REPORT_PLACEHOLDERS,
  REPORT_TYPE_TAG,
} from '@/feature/support/constant';

import { Option } from '@/types';

import styles from './WriteReportPage.module.css';

export default function WriteReportPage() {
  const [searchParams] = useSearchParams();
  const { type: targetType, ...targetIds } = Object.fromEntries(searchParams);

  const { userInfo } = useAuth();

  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const updateOption = (option: Option) => setSelectedOption(option);
  const updateFiles = (files: File[]) => setFiles(files);

  const validReportTypes = Object.keys(REPORT_TYPE_TAG);
  if (!validReportTypes.includes(targetType)) {
    return <NotFoundPage />;
  }

  const placeholder = REPORT_PLACEHOLDERS[targetType];
  const options = REPORT_OPTIONS[targetType];

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
            [{REPORT_TYPE_TAG[targetType]} 신고]
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
