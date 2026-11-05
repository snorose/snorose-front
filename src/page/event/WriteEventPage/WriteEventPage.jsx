import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IconChevronDown,
  IconMultiClipboardBlue,
  IconMultiCloudLogo,
  IllustrationTrashcanCircle,
} from '@snorose/icons';
import { useQueryClient } from '@tanstack/react-query';

import {
  ActionButton,
  Badge,
  CloseAppBar,
  ConfirmModal,
  FetchLoading,
} from '@/shared/component';
import {
  ATTACHMENT_MODAL_TEXT,
  CONFIRM_MODAL_TEXT,
  QUERY_KEY,
  ROLE,
  TOAST,
} from '@/shared/constant';
import { ModalContext } from '@/shared/context';
import { useAuth, useBlocker, useModal, useToast } from '@/shared/hook';
import { DateTime, getBoard } from '@/shared/lib';

import { AttachmentBar, DropDownMenu } from '@/feature/board/component';
import { preserveEmptyParagraphs, sanitizeHtml } from '@/feature/editor/lib';
import { EventForm, NoticeForm } from '@/feature/event/component';
import EventEditorToolbar from '@/feature/event/component/EventEditorToolbar/EventEditorToolbar';
import {
  EVENT_FORM_DATA,
  EVENT_TYPES,
  NOTICE_FORM_DATA,
} from '@/feature/event/constant';
import { validateOnSubmit } from '@/feature/event/lib';
import { getEventErrorMessage } from '@/feature/event/lib/getEventErrorMessage';

import { createThumbnail, postEvent, postPost } from '@/apis';

import styles from './WriteEventPage.module.css';

export default function WriteEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { userInfo, status } = useAuth();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitInProgress = useRef(false);
  const [pendingUpload, setPendingUpload] = useState(null);
  const { invalidUserInfoQuery } = useAuth();
  const [eventType, setEventType] = useState('유형을 선택해주세요');
  const isNotice = eventType === '공지사항';
  const boardId = getBoard('event')?.id;

  const [data, setData] = useState(() => EVENT_FORM_DATA(eventType));
  const [noticeData, setNoticeData] = useState(() => NOTICE_FORM_DATA(boardId));
  const [attachmentsInfo, setAttachmentsInfo] = useState([]);
  const [editor, setEditor] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [isTrashOverlapped, setIsTrashOverlapped] = useState(false);
  const [trashImageIndex, setTrashImageIndex] = useState(null);
  const trashImageConfirmModal = useModal();
  const [errors, setErrors] = useState({});

  const { modal, setModal } = useContext(ModalContext);
  const [isBlock, setIsBlock] = useState(!!(data || noticeData));

  useEffect(() => {
    editor?.setEditable?.(!isSubmitting && !pendingUpload);
  }, [editor, isSubmitting, pendingUpload]);

  // navigation guard
  useBlocker(isBlock);

  // 게시글 작성 중 페이지 이탈
  const handleExitPage = () => {
    setModal({
      id: null,
      type: null,
    });
    setIsBlock(false);
    navigate(-1);
  };

  // 입력값 표시 및 즉시 유효성 검사 항목
  const handleChange = (field, value) => {
    if (isNotice) {
      setNoticeData((previous) => ({ ...previous, [field]: value }));
      return;
    }

    setData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // title, host, place 유효성 검사 (즉시)
    const newErrors = { ...errors };
    if (field === 'title' && value.length > 127) {
      newErrors.title = '제목은 127자 이하로 입력해주세요';
    } else if (field === 'host' && value.length > 20) {
      if (EVENT_TYPES[eventType] === 'theater') {
        newErrors.host = '공연명은 20자 이하로 입력해주세요';
      } else if (EVENT_TYPES[eventType] === 'movie') {
        newErrors.host = '영화명은 20자 이하로 입력해주세요';
      } else {
        newErrors.host = '주최사는 20자 이하로 입력해주세요';
      }
    } else if (field === 'place' && value.length > 20) {
      newErrors.place = '장소는 20자 이하로 입력해주세요';
    } else {
      delete newErrors[field];
    }

    setErrors(newErrors);
    setIsFormValid(false);
  };

  // 이벤트 유형 선택 핸들러
  const handleDropDownOpen = () => {
    setDropDownOpen((prev) => !prev);
  };

  const handleEventTypeSelect = (selectedType) => {
    if (isSubmitting || pendingUpload || selectedType === eventType) return;
    setIsFormValid(false);
    setEditor(null);
    setAttachmentsInfo([]);
    setErrors({});
    setData(EVENT_FORM_DATA(selectedType));
    setNoticeData(NOTICE_FORM_DATA(boardId));
    setEventType(selectedType);
  };

  // 이벤트 유형에 따른 폼 렌더링
  const renderForm = () => {
    if (isNotice) {
      return (
        <NoticeForm
          data={noticeData}
          editor={editor}
          onChange={handleChange}
          onValid={setIsFormValid}
          onEditorReady={setEditor}
          onTitleFocusChange={setIsTitleFocused}
          attachmentsInfo={attachmentsInfo}
          setAttachmentsInfo={setAttachmentsInfo}
          onDeleteAttachment={(index) => {
            setTrashImageIndex(index);
            trashImageConfirmModal.openModal();
          }}
          withEditor
        />
      );
    }

    const formType = EVENT_TYPES[eventType];
    if (!formType) return null;

    return (
      <EventForm
        key={eventType}
        formType={formType}
        data={data}
        onChange={handleChange}
        onValid={setIsFormValid}
        errors={errors}
        onEditorReady={setEditor}
        attachmentsInfo={attachmentsInfo}
        setAttachmentsInfo={setAttachmentsInfo}
        onDeleteAttachment={(index) => {
          setTrashImageIndex(index);
          trashImageConfirmModal.openModal();
        }}
      />
    );
  };

  // '등록' 클릭 이벤트와 유효성 검사
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting || submitInProgress.current) return;

    let request;
    if (pendingUpload) {
      request = pendingUpload.retry();
    } else if (isNotice) {
      if (!noticeData.title.trim()) {
        toast.info(TOAST.POST.emptyTitle);
        return;
      }
      if (!editor?.getText().trim()) {
        toast.info(TOAST.POST.emptyContent);
        return;
      }
      request = postPost({
        ...noticeData,
        content: sanitizeHtml(preserveEmptyParagraphs(editor.getHTML())),
        attachmentsInfo,
      });
    } else {
      const submitErrors = validateOnSubmit(data);
      if (Object.keys(submitErrors).length > 0) {
        setErrors(submitErrors);
        setIsFormValid(false);
        return;
      }
      request = postEvent({ ...data, attachmentsInfo });
    }
    submitInProgress.current = true;
    setIsSubmitting(true);

    request
      .then(async (response) => {
        if (response.status !== 200 && response.status !== 201) return;

        const newPostId = response.data.result.postId;
        try {
          await createThumbnail(boardId, newPostId);
        } catch (error) {
          toast.error(
            getEventErrorMessage(error, '썸네일 생성 중 오류가 발생했습니다.')
          );
        }
        if (isNotice) {
          queryClient.removeQueries({
            queryKey: [QUERY_KEY.notices, boardId],
          });
        }

        queryClient.removeQueries({ queryKey: QUERY_KEY.post() });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.events, boardId],
        });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts, boardId] });
        invalidUserInfoQuery();
        navigate(
          isNotice ? '/board/event/notice' : `/board/event/post/${newPostId}`,
          { replace: true }
        );
      })
      .catch((error) => {
        if (error?.retryUpload) setPendingUpload({ retry: error.retryUpload });
        toast.error(getEventErrorMessage(error, '게시글 등록에 실패했어요.'));
      })
      .finally(() => {
        submitInProgress.current = false;
        setIsSubmitting(false);
      });
  };

  if (status === 'loading') {
    return (
      <>
        <FetchLoading>로딩 중...</FetchLoading>
      </>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.top}>
          <CloseAppBar backgroundColor='var(--white-2)'>
            <ActionButton
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {pendingUpload ? '첨부파일 업로드 재시도' : '등록'}
            </ActionButton>
          </CloseAppBar>
        </div>
        <div className={styles.center}>
          <div className={styles.categorySelect} onClick={handleDropDownOpen}>
            <div className={styles.categorySelectContainer}>
              <IconMultiClipboardBlue width={21} height={22} />
              <p className={styles.categorySelectText}>{eventType}</p>
            </div>
            <IconChevronDown width={24} height={24} />
          </div>
          <DropDownMenu
            options={Object.keys(EVENT_TYPES)}
            item={eventType}
            setItem={handleEventTypeSelect}
            dropDownOpen={dropDownOpen}
            setDropDownOpen={setDropDownOpen}
            backgroundColor='var(--white-2)'
          />

          <div className={styles.profileBox}>
            <div className={styles.profileBoxLeft}>
              {userInfo?.userRoleId !== ROLE.admin &&
              userInfo?.userRoleId !== ROLE.official ? (
                <IconMultiCloudLogo
                  width={22}
                  height={14}
                  role='img'
                  aria-label='로고'
                />
              ) : (
                <Badge
                  userRoleId={userInfo?.userRoleId}
                  width={24}
                  height={24}
                />
              )}
              <p>{userInfo?.nickname}</p>
              <p className={styles.dot}></p>
              <p>{DateTime.format(new Date(), 'MD_HM')}</p>
            </div>
          </div>

          <fieldset
            className={styles.form}
            style={isNotice ? undefined : { paddingBottom: toolbarHeight + 16 }}
            disabled={isSubmitting || Boolean(pendingUpload)}
            onFocusCapture={(event) =>
              setIsTitleFocused(
                !event.target.closest('[contenteditable="true"]')
              )
            }
          >
            {renderForm()}
          </fieldset>
        </div>
        {isNotice && (
          <>
            <IllustrationTrashcanCircle
              width={21}
              height={22}
              className={
                isTrashOverlapped ? styles.trashVisible : styles.trashInvisible
              }
              onDragEnter={(e) => {
                e.preventDefault();
                setIsTrashOverlapped(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsTrashOverlapped(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsTrashOverlapped(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const index = Number.parseInt(
                  e.dataTransfer.getData('text/plain'),
                  10
                );
                setIsTrashOverlapped(false);
                if (!Number.isInteger(index) || !attachmentsInfo[index]) return;
                setTrashImageIndex(index);
                trashImageConfirmModal.openModal();
              }}
            />
            <fieldset
              className={styles.form}
              disabled={isSubmitting || Boolean(pendingUpload)}
            >
              <AttachmentBar
                attachmentsInfo={attachmentsInfo}
                setAttachmentsInfo={setAttachmentsInfo}
                editor={editor}
                isTitleFocused={
                  isTitleFocused || isSubmitting || Boolean(pendingUpload)
                }
              />
            </fieldset>
          </>
        )}
        {!isNotice && EVENT_TYPES[eventType] && (
          <EventEditorToolbar
            editor={editor}
            visible={!isTitleFocused}
            disabled={isSubmitting || Boolean(pendingUpload)}
            onHeightChange={setToolbarHeight}
          />
        )}
        {modal.id === 'exit-page' && (
          <ConfirmModal
            modalText={CONFIRM_MODAL_TEXT.EXIT_PAGE}
            onConfirm={handleExitPage}
          />
        )}
      </div>
      {trashImageConfirmModal.isOpen && (
        <ConfirmModal
          modalText={ATTACHMENT_MODAL_TEXT.DELETE_ATTACHMENT}
          onConfirm={() => {
            setAttachmentsInfo((previous) =>
              previous.filter((_, index) => index !== trashImageIndex)
            );
            trashImageConfirmModal.closeModal();
          }}
          onCancel={trashImageConfirmModal.closeModal}
        />
      )}
    </>
  );
}
