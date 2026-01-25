import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

import {
  ActionButton,
  AttachmentList,
  Badge,
  CloseAppBar,
  DropdownList,
  FetchLoading,
  Icon,
  ConfirmModal,
} from '@/shared/component';
import {
  BOARD_MENUS,
  QUERY_KEY,
  ROLE,
  TOAST,
  CONFIRM_MODAL_TEXT,
  ATTACHMENT_MODAL_TEXT,
} from '@/shared/constant';
import { useAuth, useBlocker, useToast, useModal } from '@/shared/hook';
import { DateTime, getBoard } from '@/shared/lib';
import { ModalContext } from '@/shared/context/ModalContext';

import { createThumbnail, postPost } from '@/apis';
import { AttachmentBar } from '@/feature/board/component';
import { Guideline } from '@/feature/attachment/component';
import { useGuide } from '@/feature/attachment/hook';

import cloudLogo from '@/assets/images/cloudLogo.svg';
import attachmentGuide1 from '@/assets/images/attachmentGuide1.png';
import attachmentGuide2 from '@/assets/images/attachmentGuide2.png';

import styles from './WritePostPage.module.css';

export default function WritePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const { userInfo, status } = useAuth();
  const { invalidUserInfoQuery } = useAuth();
  const { modal, setModal } = useContext(ModalContext);

  const [isNotice, setIsNotice] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  //가이드 이미지 관련 로직
  const { isGuideOpened, closeGuide, disableGuide } = useGuide({
    guideKey: 'attachmentGuide',
    maxGuideVisitNum: 3,
  });
  //'게시글 생성' API에서 요구하는 데이터 (중 attachments array)
  const [attachmentsInfo, setAttachmentsInfo] = useState([]);

  const [isTrashOverlapped, setIsTrashOverlapped] = useState(false);
  const [trashImageIndex, setTrashImageIndex] = useState(null); //지우는 이미지 index
  const trashImageConfirmModal = useModal();

  const textId = pathname.split('/')[2];
  const currentBoard = getBoard(textId);
  const [boardTitle, setBoardTitle] = useState(
    currentBoard?.title ?? '게시판을 선택해주세요'
  );
  const [boardId, setBoardId] = useState(currentBoard?.id ?? '');

  const pass = boardId && title.trim() && text.trim();

  const boardTitles = BOARD_MENUS.filter((menu) =>
    [21, 22, 23].includes(menu.id)
  ).map((menu) => menu.title);

  // 공식 계정 일반글
  const officialTitles = BOARD_MENUS.filter((menu) =>
    [21, 60, 61, 62].includes(menu.id)
  ).map((menu) => menu.title);

  // 공식 게시판 공지 (ROLE.official)
  const officialNoticeTitles = BOARD_MENUS.filter((menu) =>
    [60, 61, 62].includes(menu.id)
  ).map((menu) => menu.title);

  // 페이지 이탈 방지 모달 노출
  useEffect(() => {
    setIsBlock(
      title.trim().length > 0 ||
        text.trim().length > 0 ||
        attachmentsInfo.length > 0
    );
  }, [title, text, attachmentsInfo]);

  useBlocker(isBlock);

  // 드롭다운 표시
  const displayedOptions = useMemo(() => {
    const getOptionObjects = (titles) =>
      BOARD_MENUS.filter((menu) => titles.includes(menu.title)).map((menu) => ({
        id: menu.id,
        name: menu.title,
      }));

    const roleOptions = {
      [ROLE.official]: isNotice
        ? getOptionObjects(officialNoticeTitles)
        : getOptionObjects(officialTitles),
      [ROLE.admin]: getOptionObjects([...boardTitles, ...officialNoticeTitles]),
    };

    return roleOptions[userInfo?.userRoleId] || getOptionObjects(boardTitles);
  }, [isNotice, userInfo?.userRoleId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 게시판 선택 핸들러
  const handleDropDownOpen = () => {
    setDropDownOpen((prev) => !prev);
  };

  // 게시판 제목 선택 핸들러
  const handleBoardTitleChange = (option) => {
    setBoardTitle(option.name);
    setBoardId(option.id);
    setDropDownOpen(false);
  };

  // 게시글 작성 중 페이지 이탈
  const handleExitPage = () => {
    setModal({
      id: null,
      type: null,
    });
    setIsBlock(false);
    navigate(-1);
  };

  // 공지 여부 선택 핸들러
  const handleIsNotice = () => {
    setIsNotice((prev) => !prev);
  };

  const data = {
    category: null,
    boardId,
    title,
    content: text,
    isNotice: textId === 'notice' ? true : isNotice,
    attachmentsInfo: attachmentsInfo,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitDisabled) return;

    setSubmitDisabled(true);

    try {
      const response = await postPost(data);

      if (response.status === 201) {
        !response.data.result.pointDifference
          ? toast({
              message: TOAST.POST.createNoPoints,
              variant: 'success',
            })
          : toast({ message: TOAST.POST.create, variant: 'success' });

        const newPostId = response.data.result.postId;

        queryClient.removeQueries(QUERY_KEY.post());
        invalidUserInfoQuery();

        currentBoard.id === 12 || isNotice
          ? navigate(`/board/${currentBoard.textId}/notice`, { replace: true })
          : navigate(
              `/board/${
                BOARD_MENUS.find((menu) => menu.id === boardId).textId
              }/post/${newPostId}`,
              { replace: true }
            );

        // post 등록이 잘 되었으면 썸네일 생성하기
        await createThumbnail(boardId, newPostId);
      }
    } catch (err) {
      toast({ message: err.response?.data?.message, variant: 'error' });
    } finally {
      setSubmitDisabled(false);
    }
  };

  // 제목 127자 제한
  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= 127) {
      setTitle(newValue);
    }
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
      {isGuideOpened && (
        <Guideline
          guideImages={[attachmentGuide1, attachmentGuide2]}
          guideStyle={{ position: 'absolute', bottom: '10.2rem' }}
        >
          <div className={styles.buttons}>
            <button className={styles.button} onClick={closeGuide}>
              닫기
            </button>
            <button className={styles.button} onClick={disableGuide}>
              다시는 보지 않기
            </button>
          </div>
        </Guideline>
      )}
      <div className={styles.container}>
        <div>
          <div className={styles.top}>
            <CloseAppBar backgroundColor={'#eaf5fd'}>
              <ActionButton onClick={handleSubmit} disabled={!pass}>
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
                  <p className={styles.categorySelectText}>{boardTitle}</p>
                </div>
              </div>
            ) : (
              <div className={styles.categoryDropdownContainer}>
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
                    <p className={styles.categorySelectText}>{boardTitle}</p>
                  </div>
                  <Icon id='angle-down' width={14} height={7} />
                </div>
                {dropDownOpen && (
                  <DropdownList
                    options={displayedOptions}
                    select={{ id: boardId, name: boardTitle }}
                    onSelect={handleBoardTitleChange}
                    className={styles.dropDownList}
                  />
                )}
              </div>
            )}

            <div className={styles.profileBox}>
              <div className={styles.profileBoxLeft}>
                {userInfo?.userRoleId !== ROLE.admin &&
                userInfo?.userRoleId !== ROLE.official ? (
                  <img className={styles.logoIcon} src={cloudLogo} alt='로고' />
                ) : (
                  <Badge
                    userRoleId={userInfo?.userRoleId}
                    className={styles.badge}
                  />
                )}
                <p>{userInfo?.nickname}</p>
                <p className={styles.dot}></p>
                <p>{DateTime.format(new Date(), 'MD_HM')}</p>
              </div>
              {textId !== 'notice' && (
                <div
                  className={
                    userInfo?.userRoleId === ROLE.admin ||
                    userInfo?.userRoleId === ROLE.official
                      ? styles.profileBoxRight
                      : styles.profileBoxRightInvisible
                  }
                  onClick={handleIsNotice}
                >
                  <Icon
                    id={isNotice ? 'check-circle-blue' : 'check-circle-grey'}
                    width={21}
                    height={22}
                  />
                  <p>공지글</p>
                </div>
              )}
            </div>
            <div className={styles.content}>
              <TextareaAutosize
                className={styles.title}
                placeholder='제목'
                value={title}
                onChange={handleTitleChange}
              />
              <TextareaAutosize
                className={styles.text}
                placeholder='내용'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <AttachmentList
                attachmentsInfo={attachmentsInfo}
                setAttachmentsInfo={setAttachmentsInfo}
              />
            </div>
          </div>
        </div>

        {modal.id === 'exit-page' && (
          <ConfirmModal
            modalText={CONFIRM_MODAL_TEXT.EXIT_PAGE}
            onConfirm={handleExitPage}
          />
        )}

        <Icon
          id='trashcan'
          width='10rem'
          height='10rem'
          className={`${isTrashOverlapped ? styles.trashVisible : styles.trashInvisible}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsTrashOverlapped(true);
          }}
          onDragOver={(e) => {
            setIsTrashOverlapped(true);
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsTrashOverlapped(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const draggedIndex = parseInt(
              e.dataTransfer.getData('text/plain'),
              10
            );
            setTrashImageIndex(draggedIndex);
            setIsTrashOverlapped(false);
            trashImageConfirmModal.openModal();
          }}
        />
        <AttachmentBar
          attachmentsInfo={attachmentsInfo}
          setAttachmentsInfo={setAttachmentsInfo}
        />
      </div>

      {trashImageConfirmModal.isOpen && (
        <ConfirmModal
          modalText={ATTACHMENT_MODAL_TEXT.DELETE_ATTACHMENT}
          onConfirm={() => {
            setAttachmentsInfo((prev) =>
              prev
                .slice(0, trashImageIndex)
                .concat(prev.slice(trashImageIndex + 1))
            );
            trashImageConfirmModal.closeModal();
          }}
          onCancel={() => {
            trashImageConfirmModal.closeModal();
          }}
        />
      )}
    </>
  );
}
