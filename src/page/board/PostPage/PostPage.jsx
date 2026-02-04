import { useContext, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

import { getPostContent } from '@/apis';

import { NotFoundPage } from '@/page/etc';

import {
  AppError,
  renderTextWithLinks,
  DateTime,
  getBoard,
} from '@/shared/lib';
import { ModalContext } from '@/shared/context/ModalContext';
import { useToast, useModalReset } from '@/shared/hook';
import {
  AttachmentSwiper,
  BackAppBar,
  Badge,
  FetchLoading,
  Icon,
} from '@/shared/component';
import { LIKE_TYPE, QUERY_KEY, ROLE } from '@/shared/constant';

import { FullScreenAttachment } from '@/feature/board/component';
import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostModalRenderer } from '@/feature/board/component';

import { useCommentContext } from '@/feature/comment/context';
import { CommentInput, CommentListSuspense } from '@/feature/comment/component';

import { useUpdateCommentNotificationSetting } from '@/feature/alert/hook';
import { useReportHandler } from '@/feature/report/hook/useReport';
import { useLike } from '@/feature/like/hook';
import { useScrap } from '@/feature/scrap/hook';

import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './PostPage.module.css';

export default function PostPage() {
  const { postId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentBoard = getBoard(pathname.split('/')[2]);

  const { modal, setModal } = useContext(ModalContext);

  // 페이지 언마운트 시 모달 상태 초기화
  useModalReset();

  const [clickedImageIndex, setClickedImageIndex] = useState(0);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => getPostContent(currentBoard?.id, postId),
    staleTime: 1000 * 60 * 5,
    enabled: !!currentBoard?.id && !!postId,
  });

  // 페이지 언마운트 시 모달 상태 초기화
  useModalReset();

  const { handleDelete } = useDeletePostHandler(
    currentBoard?.id,
    currentBoard?.textId
  );
  const { handleReport } = useReportHandler(modal, setModal, data);
  const { toast } = useToast();

  const handleEdit = () => {
    setModal({ id: null, type: null });
    navigate(`./edit`);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({ message: '링크가 복사되었어요', variant: 'success' });
    } catch (error) {
      toast({ message: '링크 복사에 실패했어요', variant: 'error' });
    }
  };

  // 로딩과 에러 상태에 따라 조건부 렌더링
  if (isLoading) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading>게시글 불러오는 중...</FetchLoading>
      </>
    );
  }

  if (error?.response.status === 404) {
    return <NotFoundPage />;
  }

  if (isError) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading animation={false}>
          게시글을 불러오지 못했습니다.
        </FetchLoading>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading animation={false}>
          게시글을 찾을 수 없습니다.
        </FetchLoading>
      </>
    );
  }

  return (
    <div className={styles.container}>
      {/*<BackAppBar backgroundColor={'#eaf5fd'} />*/}

      {clickedImageIndex === 0 ? (
        <BackAppBar backgroundColor={'#eaf5fd'} />
      ) : (
        <FullScreenAttachment
          attachmentUrls={data.attachments}
          clickedImageIndex={clickedImageIndex}
          setClickedImageIndex={setClickedImageIndex}
        />
      )}

      <div className={styles.blueContainer}>
        <MetaContainer
          userDisplay={data.userDisplay}
          userRoleId={data.userRoleId}
          createdAt={data.createdAt}
          isEdited={data.isEdited}
          isNotice={data.isNotice}
          isWriter={data.isWriter}
          isCommentAlertConsent={data.isCommentAlertConsent}
        />

        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{data.title}</h1>
          <span className={styles.views}>
            &nbsp;&nbsp;{data.viewCount.toLocaleString()} views
          </span>
        </div>

        <p className={styles.contentText}>
          {renderTextWithLinks(data.content)}
        </p>

        {data.attachments.length !== 0 && (
          <AttachmentSwiper
            data={data}
            setClickedImageIndex={setClickedImageIndex}
          />
        )}

        <ActionContainer
          isNotice={data.isNotice}
          commentCount={data.commentCount}
          isLiked={data.isLiked}
          likeCount={data.likeCount}
          isScrapped={data.isScrapped}
          scrapCount={data.scrapCount}
        />
      </div>

      <CommentContainer
        isNotice={data.isNotice}
        commentCount={data.commentCount}
      />

      {/* PostPage에서 사용하는 모달 렌더러 */}
      <PostModalRenderer
        modal={modal}
        handleEdit={handleEdit}
        handleReport={handleReport}
        handleDelete={handleDelete}
        handleShare={handleShare}
      />
    </div>
  );
}

function MetaContainer({
  userDisplay,
  userRoleId,
  createdAt,
  isEdited,
  isNotice,
  isWriter,
  isCommentAlertConsent,
}) {
  const { postId } = useParams();
  const { pathname } = useLocation();
  const { id: boardId } = getBoard(pathname.split('/')[2]);

  const { setModal } = useContext(ModalContext);

  const { toast } = useToast();

  const updateNotificationSetting = useUpdateCommentNotificationSetting(
    boardId,
    postId
  );

  const updateSetting = async () => {
    const nextStatus = !isCommentAlertConsent;

    try {
      await updateNotificationSetting.mutateAsync(nextStatus);

      toast({
        message: nextStatus
          ? '댓글 알림이 설정되었습니다.'
          : '댓글 알림이 해제되었습니다.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof AppError
          ? error.message
          : '잠시 후 다시 시도해주세요.';

      toast({ message: errorMessage, variant: 'error' });
    }
  };

  const onMenuOpen = () => {
    const id = isWriter ? 'my-post-more-options' : 'post-more-options';

    setModal({
      id,
      type: null,
    });
  };

  const showBadge =
    userRoleId === ROLE.official ||
    (userRoleId === ROLE.admin && userDisplay !== '익명송이');

  const showBellIcon = !isNotice && isWriter;
  const showMeatBallIcon = !isNotice || isWriter;

  return (
    <div className={styles.metaContainer}>
      <div className={styles.meta}>
        <img className={styles.logoIcon} src={cloudLogo} alt='로고' />
        <p>{userDisplay || 'Unknown'}</p>
        {showBadge && (
          <Badge userRoleId={userRoleId} className={styles.badge} />
        )}
        <p className={styles.dot}>·</p>
        <p>
          {DateTime.format(createdAt, 'YMD_HM')}
          {isEdited && ' (수정됨)'}
        </p>
      </div>

      <div className={styles.actions}>
        {showBellIcon && (
          <div className={styles.commentBell} onClick={updateSetting}>
            <Icon
              id={isCommentAlertConsent ? 'comment-bell-fill' : 'comment-bell'}
              width={18}
              height={21}
            />
          </div>
        )}

        {showMeatBallIcon && (
          <div className={styles.meatBall} onClick={onMenuOpen}>
            <Icon id='meat-ball' width={18} height={4} stroke='none' />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionContainer({
  isNotice,
  commentCount,
  isLiked,
  likeCount,
  isScrapped,
  scrapCount,
}) {
  const { postId } = useParams();

  const { inputFocus, focusedItem } = useCommentContext();
  const { scrap, unscrap } = useScrap();
  const { like, unlike } = useLike({
    type: LIKE_TYPE.post,
    sourceId: postId,
  });

  return (
    <div className={styles.actionContainer}>
      <div
        className={styles.count}
        styles={{
          display: isNotice ? 'none' : 'flex',
          backgroundColor:
            focusedItem === 'post' ? 'var(--blue-1)' : 'transparent',
        }}
        onClick={inputFocus}
      >
        <Icon
          id='comment-stroke'
          width={18}
          height={15}
          styles={{
            paddingTop: '0.1rem',
          }}
          stroke='var(--blue-3)'
          fill='none'
        />
        <p>댓글 {commentCount.toLocaleString()}</p>
      </div>
      <div
        className={styles.count}
        onClick={() => (isLiked ? unlike.mutate() : like.mutate())}
      >
        <Icon
          id='like-stroke'
          width={16}
          height={15}
          stroke='var(--pink-2)'
          fill={isLiked ? 'var(--pink-2)' : 'none'}
        />
        <p>공감 {likeCount.toLocaleString()}</p>
      </div>
      <div
        className={styles.count}
        onClick={() => (isScrapped ? unscrap.mutate() : scrap.mutate())}
      >
        <Icon
          id='scrap-stroke'
          width={13}
          height={16}
          stroke={'var(--green-1)'}
          fill={isScrapped ? 'var(--green-1)' : 'none'}
        />
        <p>스크랩 {scrapCount.toLocaleString()}</p>
      </div>
    </div>
  );
}

function CommentContainer({ isNotice, commentCount }) {
  return (
    <>
      {isNotice ? (
        <div className={styles.whiteBox} />
      ) : (
        <>
          <CommentListSuspense commentCount={commentCount} />
          <CommentInput />
        </>
      )}
    </>
  );
}
