import { useQueryClient } from '@tanstack/react-query';
import { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ActionButton,
  Badge,
  CloseAppBar,
  FetchLoading,
  Icon,
  ConfirmModal,
} from '@/shared/component';
import { QUERY_KEY, ROLE, CONFIRM_MODAL_TEXT } from '@/shared/constant';
import { useAuth, useBlocker, useToast } from '@/shared/hook';
import { formattedNowTime, getBoard } from '@/shared/lib';
import { ModalContext } from '@/shared/context/ModalContext';

import { postEvent, postPost } from '@/apis';
import { DropDownMenu } from '@/feature/board/component';

import styles from './WriteEventPage.module.css';
import cloudLogo from '@/assets/images/cloudLogo.svg';

import { EventForm, NoticeForm } from '@/feature/event/component';
import { validateOnSubmit } from '@/feature/event/lib';
import {
  EVENT_FORM_DATA,
  NOTICE_FORM_DATA,
  EVENT_TYPES,
} from '@/feature/event/constant';

export default function WriteEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const { userInfo, status } = useAuth();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [isNotice, setIsNotice] = useState(false);
  const textId = pathname.split('/')[2];
  const currentBoard = getBoard(textId);
  const [boardId, setBoardId] = useState(currentBoard?.id ?? '');
  const { invalidUserInfoQuery } = useAuth();
  const [eventType, setEventType] = useState('유형을 선택해주세요');

  const [data, setData] = useState(() => EVENT_FORM_DATA(eventType));
  const [noticeData, setNoticeData] = useState(() => NOTICE_FORM_DATA(boardId));
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

  // 폼 내용 입력 및 eventType 변경 시 초기화
  useEffect(() => {
    const isNowNotice = eventType === '공지사항';
    setIsNotice(isNowNotice);

    if (isNowNotice) {
      setNoticeData({
        ...NOTICE_FORM_DATA(boardId),
        isNotice: true,
      });
    } else {
      setData({
        ...EVENT_FORM_DATA(eventType),
        category: eventType,
        isNotice: false,
      });
    }
    setErrors({});
  }, [eventType, boardId]);

  // 입력값 표시 및 즉시 유효성 검사 항목
  const handleChange = (field, value) => {
    if (isNotice) {
      setNoticeData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

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
    setSubmitDisabled(false);
  };

  // 이벤트 유형 선택 핸들러
  const handleDropDownOpen = () => {
    setDropDownOpen((prev) => !prev);
  };

  // 이벤트 유형에 따른 폼 렌더링
  const renderForm = () => {
    if (eventType === '공지사항') {
      return (
        <NoticeForm
          data={noticeData}
          onChange={handleChange}
          onValid={setSubmitDisabled}
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
        onValid={setSubmitDisabled}
        errors={errors}
      />
    );
  };

  // '등록' 클릭 이벤트와 유효성 검사
  const handleSubmit = (e) => {
    // 날짜 설정, url 오류 검증
    const submitErrors = validateOnSubmit(data);
    let request;

    e.preventDefault();

    if (isNotice) {
      // 공지사항 등록
      request = postPost(noticeData);
    } else {
      // 이벤트 등록
      if (Object.keys(submitErrors).length > 0) {
        setErrors(submitErrors);
        setSubmitDisabled(false);
        return;
      }

      request = postEvent(data);
    }
    setSubmitDisabled(true);

    request
      .then((response) => {
        if (response.status === 201) {
          const newPostId = response.data.result.postId;

          queryClient.removeQueries([QUERY_KEY.post]);
          invalidUserInfoQuery();
          isNotice
            ? navigate(`/board/event/notice`, {
                replace: true,
              })
            : navigate(`/board/event/post/${newPostId}`, {
                replace: true,
              });
        }
      })
      .catch(({ response }) => {
        toast({ message: response.data.message, variant: 'error' });
      })
      .finally(() => {
        setSubmitDisabled(false);
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
            <ActionButton onClick={handleSubmit} disabled={!submitDisabled}>
              등록
            </ActionButton>
          </CloseAppBar>
        </div>
        <div className={styles.center}>
          {textId === 'notice' ? (
            <div className={styles.categorySelect}>
              <div className={styles.categorySelectContainer}>
                <Icon
                  id='clip-board-list'
                  width={21}
                  height={22}
                  fill='white'
                />
                <p className={styles.categorySelectText}>이벤트</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={styles.categorySelect}
                onClick={handleDropDownOpen}
              >
                <div className={styles.categorySelectContainer}>
                  <Icon
                    id='clip-board-list'
                    width={21}
                    height={22}
                    fill='white'
                  />
                  <p className={styles.categorySelectText}>{eventType}</p>
                </div>
                <Icon id='angle-down' width={14} height={7} />
              </div>
              <DropDownMenu
                options={Object.keys(EVENT_TYPES)}
                item={eventType}
                setItem={setEventType}
                dropDownOpen={dropDownOpen}
                setDropDownOpen={setDropDownOpen}
                backgroundColor={'#fff'}
              />
            </>
          )}

          <div className={styles.profileBox}>
            <div className={styles.profileBoxLeft}>
              {userInfo?.userRoleId !== ROLE.admin &&
              userInfo?.userRoleId !== ROLE.official ? (
                <img
                  className={styles.cloudLogoIcon}
                  src={cloudLogo}
                  alt='로고'
                />
              ) : (
                <Badge
                  userRoleId={userInfo?.userRoleId}
                  className={styles.badge}
                />
              )}
              <p>{userInfo?.nickname}</p>
              <p className={styles.dot}></p>
              <p>{formattedNowTime()}</p>
            </div>
          </div>

          <div className={styles.form}>{renderForm()}</div>
        </div>
        {modal.id === 'exit-page' && (
          <ConfirmModal
            modalText={CONFIRM_MODAL_TEXT.EXIT_PAGE}
            onConfirm={handleExitPage}
          />
        )}
      </div>
    </>
  );
}
