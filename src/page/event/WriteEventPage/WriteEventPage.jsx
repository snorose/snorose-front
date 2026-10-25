import { useContext, useEffect, useState } from 'react';
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
import {
  EVENT_FORM_DATA,
  EVENT_TYPES,
  NOTICE_FORM_DATA,
} from '@/feature/event/constant';
import { validateOnSubmit } from '@/feature/event/lib';

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
  const { invalidUserInfoQuery } = useAuth();
  const [eventType, setEventType] = useState('유형을 선택해주세요');
  const isNotice = eventType === '공지사항';
  const boardId = getBoard('event')?.id;

  const [data, setData] = useState(() => EVENT_FORM_DATA(eventType));
  const [noticeData, setNoticeData] = useState(() => NOTICE_FORM_DATA(boardId));
  const [attachmentsInfo, setAttachmentsInfo] = useState([]);
  const [editor, setEditor] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isTrashOverlapped, setIsTrashOverlapped] = useState(false);
  const [trashImageIndex, setTrashImageIndex] = useState(null);
  const trashImageConfirmModal = useModal();
  const [errors, setErrors] = useState({});

  const { modal, setModal } = useContext(ModalContext);
  const [isBlock, setIsBlock] = useState(!!(data || noticeData));

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

  // 이벤트 유형 변경 시 폼 초기화
  useEffect(() => {
    if (!isNotice) {
      setData({
        ...EVENT_FORM_DATA(eventType),
        category: eventType,
        isNotice: false,
      });
    } else {
      setNoticeData((previous) => ({ ...previous, isNotice: true }));
    }
    setErrors({});
  }, [eventType, isNotice]);

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
    setIsFormValid(false);
    if (selectedType !== '공지사항') setEditor(null);
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
        formType={formType}
        data={data}
        onChange={handleChange}
        onValid={setIsFormValid}
        errors={errors}
      />
    );
  };

  // '등록' 클릭 이벤트와 유효성 검사
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    let request;
    if (isNotice) {
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
      request = postEvent(data);
    }
    setIsSubmitting(true);

    request
      .then(async (response) => {
        if (response.status !== 200 && response.status !== 201) return;

        const newPostId = response.data.result.postId;
        if (isNotice) {
          try {
            await createThumbnail(boardId, newPostId);
          } catch {
            toast.error('썸네일 생성 중 오류가 발생했습니다.');
          }
          queryClient.removeQueries({
            queryKey: [QUERY_KEY.notices, boardId],
          });
        }

        queryClient.removeQueries({ queryKey: QUERY_KEY.post() });
        invalidUserInfoQuery();
        navigate(
          isNotice ? '/board/event/notice' : `/board/event/post/${newPostId}`,
          { replace: true }
        );
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ??
            error.message ??
            '게시글 등록에 실패했어요.'
        );
      })
      .finally(() => {
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
          <CloseAppBar backgroundColor={'#eaf5fd'}>
            <ActionButton
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              등록
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
            backgroundColor={'#fff'}
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

          <div className={styles.form}>{renderForm()}</div>
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
            <AttachmentBar
              attachmentsInfo={attachmentsInfo}
              setAttachmentsInfo={setAttachmentsInfo}
              editor={editor}
              isTitleFocused={isTitleFocused}
            />
          </>
        )}
        {modal.id === 'exit-page' && (
          <ConfirmModal
            modalText={CONFIRM_MODAL_TEXT.EXIT_PAGE}
            onConfirm={handleExitPage}
          />
        )}
      </div>
      {isNotice && trashImageConfirmModal.isOpen && (
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
