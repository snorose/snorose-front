import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import {
  CloseAppBar,
  DropdownBlue,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';

import { SubmitButton, FileUploadSection } from '@/feature/support/ui';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';

import type { Option } from '@/types';
import type { InquiryDTO } from '@/feature/support/types';
import type { Attachment } from '@/feature/attachment/types';

import styles from './EditInquiryPage.module.css';

export default function EditInquiryPage() {
  const post = useLoaderData() as InquiryDTO;

  const { userInfo } = useAuth();

  const [selectedOption, setSelectedOption] = useState<Option | undefined>(() =>
    INQUIRY_OPTIONS.find((option) => option.key === post.category)
  );
  const [title, setTitle] = useState(post.title);
  const [url, setUrl] = useState(post.link);
  const [content, setContent] = useState(post.content);
  const [files, setFiles] = useState<(File | Attachment)[]>(post.attachments);

  const updateOption = (option: Option) => setSelectedOption(option);
  const updateFiles = (files: (File | Attachment)[]) => setFiles(files);

  const disabled = title.trim() === '' || content.trim() === '';

  if (!userInfo) {
    return null;
  }

  return (
    <div className={styles.container}>
      <CloseAppBar backgroundColor={'#eaf5fd'}>
        <SubmitButton onClick={() => alert('submit!')} disabled={disabled}>
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

        <FileUploadSection files={files} updateFiles={updateFiles} />
      </div>
    </div>
  );
}
