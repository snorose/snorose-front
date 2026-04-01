import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModalContext } from '@/shared/context/ModalContext';
import { useModalReset, useToast } from '@/shared/hook';
import {
  AttachmentSwiper,
  BackAppBar,
  Badge,
  FetchLoading,
  Icon,
} from '@/shared/component';
import { DateTime, renderTextWithLinks } from '@/shared/lib';
import { ROLE } from '@/shared/constant';

import { useReportHandler } from '@/feature/report/hook/useReport';
import {
  FullScreenAttachment,
  PostModalRenderer,
} from '@/feature/board/component';

import cloudLogo from '@/assets/images/cloudLogo.svg';
import sponsorBanner from '@/assets/banners/sponsorBanner.png';
import DOMPurify from 'dompurify';
import styles from './PostDetailView.module.css';

export default function PostDetailView({
  data,
  deletePost,
  PostActionBar,
  CommentInputContainer,
  BellIcon,
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
        <MetaContainer {...data} BellIcon={BellIcon} />

        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{data.title}</h1>
          <span className={styles.views}>
            &nbsp;&nbsp;{data.viewCount.toLocaleString()} views
          </span>
        </div>

        <div
          className={styles.contentText}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data.content),
          }}
        />

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
  BellIcon = null,
}) {
  const { setModal } = useContext(ModalContext);

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
  const showBellIcon = !isNotice && isWriter && BellIcon;
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
        {showBellIcon && BellIcon}

        {showMeatBallIcon && (
          <div className={styles.meatBall} onClick={onMenuOpen}>
            <Icon id='meat-ball' width={18} height={4} stroke='none' />
          </div>
        )}
      </div>
    </div>
  );
}

function MoreModal({ deletePost, data }) {
  const navigate = useNavigate();

  const { modal, setModal } = useContext(ModalContext);
  const { toast } = useToast();

  // 페이지 언마운트 시 모달 상태 초기화
  useModalReset();

  const { handleReport } = useReportHandler(modal, setModal, data);

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
