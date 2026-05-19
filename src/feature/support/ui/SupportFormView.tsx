import { useContext } from 'react';

import {
  CloseAppBar,
  DropdownBlue,
  Icon,
  Profile,
  TextareaFieldBlue,
  TextFieldBlue,
} from '@/shared/component';
import { ModalContext } from '@/shared/context/ModalContext';
import { useAuth } from '@/shared/hook';

import { Attachment, UploadFile } from '@/feature/attachment/types';
import { FileUploadSection, SubmitButton } from '@/feature/support/ui';

import { Option } from '@/types';

import styles from './SupportFormView.module.css';

type SupportFormViewProps = {
  title: string;
  content: string;
  selectedOption?: Option;
  attachments: Attachment[];
  files: UploadFile[];
  url?: string;

  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<Option | undefined>>;
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  setUrl?: React.Dispatch<React.SetStateAction<string>>;

  options: readonly Option[];
  contentLabel: string;
  placeholders: {
    dropdown: string;
    title: string;
    content: string;
  };

  modalId: string;
  showLinkField?: boolean;
  tag?: string;
};

export default function SupportFormView({
  title,
  content,
  url,
  selectedOption,
  attachments,
  files,

  setTitle,
  setContent,
  setUrl,
  setSelectedOption,
  setAttachments,
  setFiles,

  options,
  contentLabel,
  placeholders,

  tag,
  showLinkField = false,
  modalId,
}: SupportFormViewProps) {
  const { userInfo } = useAuth();
  const { setModal } = useContext(ModalContext);

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
          onClick={() => {
            setModal({ id: modalId, type: null });
          }}
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
              onClick={() => setSelectedOption(option)}
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

        {showLinkField && (
          <TextFieldBlue>
            <TextFieldBlue.Label>게시글 링크</TextFieldBlue.Label>
            <TextFieldBlue.Input
              placeholder={'게시글 링크를 입력해주세요'}
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
          setFiles={setFiles}
        />

        <div className={styles.fileContainer}>
          {attachments.length > 0 && (
            <div className={styles.fileList}>
              {attachments.map(({ id, fileName }) => (
                <Item
                  key={id}
                  name={fileName}
                  onClick={() => handleRemoveAttachment(id)}
                />
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map(({ id, file }) => (
                <Item
                  key={id}
                  name={file.name}
                  onClick={() => handleRemoveFile(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Item({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <div className={styles.fileItem}>
      <div>{name}</div>
      <span
        role='button'
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <Icon id='x' width={12} height={12} />
      </span>
    </div>
  );
}
