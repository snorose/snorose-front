import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AttachmentSwiper,
  BackAppBar,
  Badge,
  FetchLoading,
} from '@/shared/component';
import { ROLE, TOAST } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useModalReset, useToast } from '@/shared/hook';
import { DateTime, getBoard, renderTextWithLinks } from '@/shared/lib';

import {
  FullScreenAttachment,
  PostModalRenderer,
} from '@/feature/board/component';
import { useReport } from '@/feature/report/hook/useReport';

import sponsorBanner from '@/assets/banners/sponsorBanner.png';
import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './PostDetailView.module.css';

export default function PostDetailView({
  data,
  deletePost,
  PostActionBar,
  CommentInputContainer,
  Chip,
  Actions,
}) {
  const [clickedImageIndex, setClickedImageIndex] = useState(0);

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

  const isViewCountVisible =
    data.viewCount !== null && data.viewCount !== undefined;

  return (
    <div>
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
        <MetaContainer {...data} Chip={Chip} Actions={Actions} />

        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{data.title}</h1>
          {isViewCountVisible && (
            <span className={styles.views}>
              {data.viewCount.toLocaleString()} views
            </span>
          )}
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

        <div className={styles.sponsorBannerWrapper}>
          <img
            src={sponsorBanner}
            alt='스노로즈 후원하기'
            className={styles.sponsorBanner}
          />
        </div>

        {PostActionBar}
      </div>

      <CommentInputContainer
        isNotice={data.isNotice}
        commentCount={data.commentCount}
      />

      <MoreModal deletePost={deletePost} data={data} />
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
  Chip = null,
  Actions = null,
}) {
  const showBadge =
    userRoleId === ROLE.official ||
    (userRoleId === ROLE.admin && userDisplay !== '익명송이');

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
        {Chip}
      </div>

      {Actions && <div className={styles.actions}>{Actions}</div>}
    </div>
  );
}

function MoreModal({ deletePost, data }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { modal, setModal } = useContext(ModalContext);

  const { navigateReportPage } = useReport();
  const { toast } = useToast();

  // 페이지 언마운트 시 모달 상태 초기화
  useModalReset();

  const handleReport = (targetType) => {
    const currentBoard = getBoard(pathname.split('/')[2]);

    if (targetType === 'user') {
      navigateReportPage(targetType, { userId: data.encryptedUserId });
    } else if (targetType === 'post') {
      navigateReportPage(targetType, {
        postId: data.postId,
        boardId: currentBoard.id,
      });
    }
  };

  const handleEdit = () => {
    setModal({ id: null, type: null });
    navigate(`./edit`);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({ message: TOAST.COPY_AND_PASTE.linkSuccess, variant: 'success' });
    } catch (error) {
      toast({ message: TOAST.COPY_AND_PASTE.linkFail, variant: 'error' });
    }
  };

  return (
    <PostModalRenderer
      modal={modal}
      handleEdit={handleEdit}
      handleDelete={deletePost}
      handleShare={handleShare}
      handleReport={handleReport}
    />
  );
}
