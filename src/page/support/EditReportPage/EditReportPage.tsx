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

import type { Attachment, UploadFile } from '@/feature/attachment/types';
import { REPORT_PLACEHOLDERS } from '@/feature/support/constant';
import { REPORT_OPTIONS } from '@/feature/support/data';
import type { ReportDTO } from '@/feature/support/types';
import { FileUploadSection, SubmitButton } from '@/feature/support/ui';

import type { Option } from '@/types';

import styles from './EditReportPage.module.css';

const REPORT_TYPE_MAP = {
  POST_REPORT: 'post',
  EXAM_REVIEW_REPORT: 'exam',
  COMMENT_REPORT: 'comment',
  USER_REPORT: 'user',
} as const;

const REPORT_TYPE_TAG = {
  post: '게시글',
  exam: '시험후기',
  comment: '댓글',
  user: '유저',
} as const;

export default function EditReportPage() {
  const post = useLoaderData() as ReportDTO;

  const { userInfo } = useAuth();

  const reportType = REPORT_TYPE_MAP[post.reportType];

  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    () => {
      const options = (REPORT_OPTIONS[reportType] ?? []) as readonly Option[];
      return options.find((option) => option.key === post.category);
    }
  );
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [attachments, setAttachments] = useState<Attachment[]>(
    post.attachments
  );
  const [files, setFiles] = useState<UploadFile[]>([]);

  const updateOption = (option: Option) => setSelectedOption(option);
  const updateFiles = (files: UploadFile[]) => setFiles(files);

  const placeholder = REPORT_PLACEHOLDERS[reportType];
  const options = REPORT_OPTIONS[reportType];

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

        <FileUploadSection
          currentFileCount={attachments.length + files.length}
          curruentTotalFileSize={files.reduce(
            (total, { file }) => total + file.size,
            0
          )}
          updateFiles={updateFiles}
        />
      </div>
    </div>
  );
}
