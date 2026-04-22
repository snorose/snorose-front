import { useState } from 'react';

import {
  CloseAppBar,
  DropdownBlue,
  Icon,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';
import { useAuth } from '@/shared/hook';

import type { Attachment, UploadFile } from '@/feature/attachment/types';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import type { InquiryDTO, ReportDTO } from '@/feature/support/types';
import { FileUploadSection, SubmitButton } from '@/feature/support/ui';

import { Option } from '@/types';

import styles from './SupportFormView.module.css';

type SupportFormViewProps = {
  submit: (values: SupportAllState) => void;
  options: readonly Option[];
  contentLabel: string;
  placeholders: {
    dropdown: string;
    title: string;
    content: string;
  };
  post?: InquiryDTO | ReportDTO;
  showLinkFiled?: boolean;
  tag?: string;
};

export type SupportAllState = {
  selectedOption: Option;
  title: string;
  url: string;
  content: string;
  attachments: Attachment[];
  files: UploadFile[];
};

export default function SupportFormView({
  post,
  submit,
  options,
  contentLabel,
  placeholders,
  tag,
  showLinkFiled = false,
}: SupportFormViewProps) {
  const { userInfo } = useAuth();

  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>(
    post?.attachments ?? []
  );
  const [files, setFiles] = useState<UploadFile[]>([]);

  const updateOption = (option: Option) => setSelectedOption(option);

  const updateFiles = (files: UploadFile[]) =>
    setFiles((prev) => [...prev, ...files]);

  const handleRemoveAttachment = (targetId: number) =>
    setAttachments((prev) => prev.filter(({ id }) => id !== targetId));

  const handleRemoveFile = (targetId: string) =>
    setFiles((prev) => prev.filter((file) => file.id !== targetId));

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
            submit({
              selectedOption,
              title,
              url,
              content,
              attachments,
              files,
            })
          }
          disabled={disabled}
        >
          등록
        </SubmitButton>
      </CloseAppBar>

      <DropdownBlue className={styles.dropdown}>
        <DropdownBlue.Trigger>
          {tag && <span className={styles.reportType}>[{tag} 신고]</span>}
          {selectedOption?.label ?? placeholders.dropdown}
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
            placeholder={placeholders.title}
            value={title}
            onChange={(next) => setTitle(next)}
          />
        </TextFieldBlue>

        {showLinkFiled && (
          <TextFieldBlue>
            <TextFieldBlue.Label>게시글 링크</TextFieldBlue.Label>
            <TextFieldBlue.Input
              placeholder={INQUIRY_PLACEHOLDERS.url}
              value={url}
              onChange={(next) => setUrl(next)}
            />
          </TextFieldBlue>
        )}

        <TextareaFieldBlue>
          <TextareaFieldBlue.Label>{contentLabel}</TextareaFieldBlue.Label>
          <TextareaFieldBlue.Input
            placeholder={placeholders.content}
            value={content}
            onChange={(next) => setContent(next)}
            minRows={5}
            maxRows={10}
          />
        </TextareaFieldBlue>

        <FileUploadSection
          currentFileCount={attachments.length + files.length}
          curruentTotalFileSize={files.reduce(
            (total, { file }) => total + file.size,
            0
          )}
          updateFiles={updateFiles}
        />

        <div className={styles.fileContainer}>
          <div className={styles.fileList}>
            {attachments.map(({ id, fileName }) => (
              <Item
                key={id}
                name={fileName}
                onClick={() => handleRemoveAttachment(id)}
              />
            ))}
          </div>
          <div className={styles.fileList}>
            {files.map(({ id, file }) => (
              <Item
                key={id}
                name={file.name}
                onClick={() => handleRemoveFile(id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <div className={styles.fileItem}>
      <div>{name}</div>
      <span onClick={onClick}>
        <Icon id='x' width={12} height={12} />
      </span>
    </div>
  );
}
