import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import {
  CloseAppBar,
  Icon,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';

import { SubmitButton, FileUploadSection } from '@/feature/support/ui';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';

import type { InquiryDTO } from '@/feature/board/types';

import styles from './EditInquiryPage.module.css';

const INQUIRY_OPTION_MAP = INQUIRY_OPTIONS.reduce(
  (acc, cur) => ({ ...acc, [cur.key]: cur.label }),
  {}
);

/*  TODO: 답변 완료 후에는 접근 불가 -> 라우트 레벨에서 loader로 처리할 것  */
export default function EditInquiryPage() {
  const post = useLoaderData() as InquiryDTO;

  const { userInfo } = useAuth();

  const [title, setTitle] = useState(post.title);
  const [url, setUrl] = useState(post.link);
  const [content, setContent] = useState(post.content);
  const [files, setFiles] = useState<File[]>([]);

  const updateFiles = (files: File[]) => setFiles(files);

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

      <div className={styles.category}>
        <div>
          <Icon
            className={styles.icon}
            id='clip-board-list'
            width={21}
            height={22}
          />
          <p>{INQUIRY_OPTION_MAP[post.category]}</p>
        </div>
      </div>

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
