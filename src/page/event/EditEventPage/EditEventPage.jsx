import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IconMultiClipboardBlue, IconMultiCloudLogo } from '@snorose/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  ActionButton,
  BackAppBar,
  Badge,
  CloseAppBar,
  ConfirmModal,
  FetchLoading,
} from '@/shared/component';
import {
  ATTACHMENT_MODAL_TEXT,
  CONFIRM_MODAL_TEXT,
  MUTATION_KEY,
  QUERY_KEY,
  ROLE,
  TOAST,
} from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useAuth, useBlocker, useModal, useToast } from '@/shared/hook';
import { DateTime, getBoard } from '@/shared/lib';

import { AttachmentBar } from '@/feature/board/component';
import { preserveEmptyParagraphs, sanitizeHtml } from '@/feature/editor/lib';
import { EventForm, NoticeForm } from '@/feature/event/component';
import EventEditorToolbar from '@/feature/event/component/EventEditorToolbar/EventEditorToolbar';
import { EVENT_FORM_DATA, EVENT_TYPES } from '@/feature/event/constant';
import { validateOnSubmit } from '@/feature/event/lib';
import { eventContentToHtml } from '@/feature/event/lib/content';
import { getEventErrorMessage } from '@/feature/event/lib/getEventErrorMessage';

import { createThumbnail, getEventContent, patchEvent } from '@/apis';

import styles from './EditEventPage.module.css';

const attachmentSnapshot = (attachments) =>
  attachments.map(({ id, type, fileName, fileComment }) => ({
    id,
    type,
    fileName,
    fileComment,
  }));

export default function EditEventPage() {
  const { postId } = useParams();
  const { userInfo, status } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { modal, setModal } = useContext(ModalContext);
  const boardId = getBoard('event')?.id;
  const [data, setData] = useState(() => EVENT_FORM_DATA(''));
  const [initialData, setInitialData] = useState(null);
  const initializedPostId = useRef(null);
  const submitInProgress = useRef(false);
  const [attachmentsInfo, setAttachmentsInfo] = useState([]);
  const [deleteAttachments, setDeleteAttachments] = useState([]);
  const [editor, setEditor] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [errors, setErrors] = useState({});
  const [pendingUpload, setPendingUpload] = useState(null);
  const [allowExit, setAllowExit] = useState(false);
  const [trashImageIndex, setTrashImageIndex] = useState(null);
  const trashImageConfirmModal = useModal();

  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => getEventContent(postId),
    enabled: Boolean(boardId && postId),
  });

  useEffect(() => {
    if (!eventData || initializedPostId.current === postId) return;
    const formData = {
      ...EVENT_FORM_DATA(eventData.category),
      ...eventData,
      content: eventData.isNotice
        ? sanitizeHtml(eventData.content)
        : eventContentToHtml(eventData.content),
      place: eventData.place ?? '',
      drawCount: eventData.drawCount ?? '',
      link: eventData.link ?? '',
    };
    const attachments = eventData.attachments ?? [];
    initializedPostId.current = postId;
    setData(formData);
    setAttachmentsInfo(attachments);
    setInitialData({ data: formData, attachments });
    setDeleteAttachments([]);
    setErrors({});
  }, [eventData, postId]);

  const hasChanges = Boolean(
    initialData &&
      (JSON.stringify(data) !== JSON.stringify(initialData.data) ||
        JSON.stringify(attachmentSnapshot(attachmentsInfo)) !==
          JSON.stringify(attachmentSnapshot(initialData.attachments)))
  );
  useBlocker(!allowExit && (hasChanges || Boolean(pendingUpload)));

  const mutation = useMutation({
    mutationKey: [MUTATION_KEY.editPost],
    mutationFn: (variables) =>
      pendingUpload ? pendingUpload.retry() : patchEvent(variables),
    onSuccess: async () => {
      try {
        await createThumbnail(boardId, postId);
      } catch (error) {
        toast.error(
          getEventErrorMessage(error, '썸네일 생성 중 오류가 발생했습니다.')
        );
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.post(postId) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.events, boardId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts, boardId] });
      setAllowExit(true);
      toast.success(TOAST.POST.edit);
      navigate(`/board/event/post/${postId}`, { replace: true });
    },
    onError: (error) => {
      if (error?.retryUpload) setPendingUpload({ retry: error.retryUpload });
      toast.error(getEventErrorMessage(error, '게시글 수정에 실패했어요.'));
    },
    onSettled: () => {
      submitInProgress.current = false;
    },
  });

  const isLocked = mutation.isPending || Boolean(pendingUpload);
  useEffect(() => {
    editor?.setEditable?.(!isLocked);
  }, [editor, isLocked]);

  const handleChange = (field, value) => {
    setData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      if (field === 'title' && value.length > 127) {
        next.title = '제목은 127자 이하로 입력해주세요';
      } else if (field === 'host' && value.length > 20) {
        const label =
          data.category === '연극/뮤지컬'
            ? '공연명은'
            : data.category === '영화'
              ? '영화명은'
              : '주최사는';
        next.host = `${label} 20자 이하로 입력해주세요`;
      } else if (field === 'place' && value.length > 20) {
        next.place = '장소는 20자 이하로 입력해주세요';
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!initialData || !editor || !isFormValid || submitInProgress.current)
      return;
    const submitErrors = data.isNotice ? {} : validateOnSubmit(data);
    if (Object.keys(submitErrors).length) {
      setErrors(submitErrors);
      return;
    }
    submitInProgress.current = true;
    mutation.mutate({
      ...data,
      postId,
      content: sanitizeHtml(preserveEmptyParagraphs(editor.getHTML())),
      attachmentsInfo,
      deleteAttachments,
    });
  };

  if (status === 'loading' || isLoading || (!initialData && !error)) {
    return <FetchLoading>로딩 중...</FetchLoading>;
  }
  if (error) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading>게시글 정보를 불러오지 못했습니다</FetchLoading>
      </>
    );
  }

  const editorProps = {
    data,
    disabled: isLocked,
    onChange: handleChange,
    onValid: setIsFormValid,
    onEditorReady: (instance) => {
      instance.commands?.setContent(data.content, { emitUpdate: false });
      setEditor(instance);
    },
    attachmentsInfo,
    setAttachmentsInfo,
    onDeleteAttachment: (index) => {
      if (isLocked) return;
      setTrashImageIndex(index);
      trashImageConfirmModal.openModal();
    },
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.top}>
          <CloseAppBar backgroundColor='var(--white-2)'>
            <ActionButton
              onClick={handleSubmit}
              disabled={!isFormValid || !editor || mutation.isPending}
            >
              {pendingUpload ? '첨부파일 업로드 재시도' : '수정'}
            </ActionButton>
          </CloseAppBar>
        </div>
        <div className={styles.center}>
          <div className={styles.categorySelect}>
            <div className={styles.categorySelectContainer}>
              <IconMultiClipboardBlue width={21} height={22} />
              <p className={styles.categorySelectText}>{data.category}</p>
            </div>
          </div>
          <div className={styles.profileBox}>
            <div className={styles.profileBoxLeft}>
              {[ROLE.admin, ROLE.official].includes(userInfo?.userRoleId) ? (
                <Badge
                  userRoleId={userInfo.userRoleId}
                  width={24}
                  height={24}
                />
              ) : (
                <IconMultiCloudLogo width={22} height={14} aria-label='로고' />
              )}
              <p>{data.userDisplay}</p>
              <p className={styles.dot} />
              <p>{DateTime.format(new Date(), 'MD_HM')}</p>
            </div>
          </div>
          <fieldset
            className={styles.form}
            style={
              data.isNotice ? undefined : { paddingBottom: toolbarHeight + 16 }
            }
            disabled={isLocked}
            onFocusCapture={(event) =>
              setIsTitleFocused(
                !event.target.closest('[contenteditable="true"]')
              )
            }
          >
            {data.isNotice ? (
              <NoticeForm
                key={postId}
                {...editorProps}
                editor={editor}
                withEditor
              />
            ) : (
              <EventForm
                key={postId}
                {...editorProps}
                formType={EVENT_TYPES[data.category]}
                errors={errors}
              />
            )}
          </fieldset>
        </div>
        {data.isNotice ? (
          <fieldset className={styles.form} disabled={isLocked}>
            <AttachmentBar
              attachmentsInfo={attachmentsInfo}
              setAttachmentsInfo={setAttachmentsInfo}
              editor={editor}
              isTitleFocused={isTitleFocused || isLocked}
            />
          </fieldset>
        ) : (
          <EventEditorToolbar
            editor={editor}
            visible={!isTitleFocused}
            disabled={isLocked}
            onHeightChange={setToolbarHeight}
          />
        )}
      </div>
      {trashImageConfirmModal.isOpen && (
        <ConfirmModal
          modalText={ATTACHMENT_MODAL_TEXT.DELETE_ATTACHMENT}
          onConfirm={() => {
            const attachment = attachmentsInfo[trashImageIndex];
            if (attachment?.id) {
              setDeleteAttachments((previous) => [...previous, attachment.id]);
            }
            setAttachmentsInfo((previous) =>
              previous.filter((_, index) => index !== trashImageIndex)
            );
            trashImageConfirmModal.closeModal();
          }}
          onCancel={trashImageConfirmModal.closeModal}
        />
      )}
      {modal.id === 'exit-page' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.EXIT_PAGE}
          onConfirm={() => {
            setModal({ id: null, type: null });
            setAllowExit(true);
            navigate(`/board/event/post/${postId}`, { replace: true });
          }}
        />
      )}
    </>
  );
}
