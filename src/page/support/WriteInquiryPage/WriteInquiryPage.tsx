import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import {
  CloseAppBar,
  DropdownBlue,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';
import { useAuth } from '@/shared/hook';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { createInquiry } from '@/feature/support/api';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import { FileUploadSection, SubmitButton } from '@/feature/support/ui';

import { Option } from '@/types';

import styles from './WriteInquiryPage.module.css';

export default function WriteInquiryPage() {
  const navigate = useNavigate();

  const { mutate: submitInquiry } = useMutation({
    mutationFn: createInquiry,
    onSuccess: async (data) => {
      const { postId } = data;
      navigate(`/inquiry/${postId}`, { replace: true });
    },
  });

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
        <SubmitButton
          onClick={() =>
            submitInquiry({
              title,
              content,
              inquiryCategory: selectedOption.key,
              target: url,
              attachments: files.map(mapFileToAttachment),
            })
          }
          disabled={disabled}
        >
          등록
        </SubmitButton>
      </CloseAppBar>

      <DropdownBlue className={styles.dropdown}>
        <DropdownBlue.Trigger>
          {selectedOption?.label ?? INQUIRY_PLACEHOLDERS.dropdown}
        </DropdownBlue.Trigger>

        <DropdownBlue.Menu>
          {INQUIRY_OPTIONS.map((option) => (
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

        <FileUploadSection
          fileNames={files.map((file) => file.name)}
          updateFiles={updateFiles}
        />
      </div>
    </div>
  );
}
