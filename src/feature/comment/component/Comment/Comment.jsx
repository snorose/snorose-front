import { forwardRef, useContext, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Badge, Icon, MoreOptionModal } from '@/shared/component';
import {
  LIKE_TYPE,
  ROLE,
  SHOW_BADGE_PATH,
  MORE_OPTION_MODAL_TEXT,
} from '@/shared/constant';
import { renderTextWithLinks, DateTime } from '@/shared/lib';
import { ModalContext } from '@/shared/context/ModalContext';

import {
  CommentModalRenderer,
  NestedComment,
} from '@/feature/comment/component';
import { useCommentContext } from '@/feature/comment/context';
import { useLike } from '@/feature/like/hook';

import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './Comment.module.css';

const Comment = forwardRef((props, ref) => {
  const { modal, setModal } = useContext(ModalContext);
  const { pathname } = useLocation();
  const { data } = props;

  const moreOptionRef = useRef(null);

  const {
    userRoleId,
    userDisplay,
    isWriterWithdrawn,
    content,
    isLiked,
    likeCount,
    createdAt,
    isVisible,
    isUpdated,
    isDeleted,
    children,
  } = data;

  const {
    setIsEdit,
    commentId,
    setCommentId,
    setContent,
    inputFocus,
    resetCommentState,
    focusedItem,
    setFocusedItem,
  } = useCommentContext();

  const { like, unlike } = useLike({
    type: LIKE_TYPE.comment,
    sourceId: data.id,
  });

  const [inputContent, setInputContent] = useState(null);
  const [moreOptionTop, setMoreOptionTop] = useState(0);

  // 컴포넌트 언마운트 시 댓글 ID 초기화
  useEffect(() => {
    return () => {
      setCommentId(null);
    };
  }, [setCommentId]);

  const onCommentOptionClick = (data, refElement) => {
    setCommentId(data.id);
    setInputContent(data.content);

    const rect = (refElement || moreOptionRef).current.getBoundingClientRect();
    setMoreOptionTop(rect.top);

    setModal(
      data.isWriter
        ? { id: 'my-comment-more-options', type: null }
        : { id: 'report-comment', type: null }
    );
  };

  const handleReply = () => {
    resetCommentState();
    setCommentId(data.id);
    inputFocus();
    setFocusedItem(String(data.id));
    // setIsInputFocused({ isFocused: true, parent: String(data.id) });
  };

  const handleEdit = () => {
    setIsEdit(true);
    setContent(inputContent);
    setModal({ id: null, type: null });
    inputFocus();
  };

  // 뱃지가 보이는 ROLE
  const showBadge =
    userRoleId === ROLE.official ||
    (userRoleId === ROLE.admin &&
      SHOW_BADGE_PATH.some((path) => pathname.includes(path)));

  // 뱃지 보이는 곳에 댓글 신고 금지
  const blockAdminReport = !showBadge || data.isWriter;

  return (
    <>
      <div
        ref={ref}
        className={`${styles.comment} ${
          commentId === data.id ? styles.focused : ''
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.commentTop}>
          <div className={styles.commentTopLeft}>
            <div className={styles.cloud}>
              <img
                className={styles.cloudLogoIcon}
                src={cloudLogo}
                alt='로고'
              />
            </div>
            <p className={`${isWriterWithdrawn && styles.isWriterWithdrawn}`}>
              {isWriterWithdrawn ? '(알 수 없음)' : userDisplay}
            </p>
            {showBadge && (
              <Badge userRoleId={userRoleId} className={styles.badge} />
            )}
            <p className={styles.dot}>·</p>
            <p>
              {DateTime.timeAgo(createdAt)} {isUpdated ? ' (수정됨)' : null}
            </p>
          </div>
          {!isDeleted && isVisible && blockAdminReport && (
            <div
              ref={moreOptionRef}
              className={styles.dot3}
              onClick={(e) => onCommentOptionClick(data)}
            >
              <Icon id='meat-ball' width={18} height={4} stroke='none' />
            </div>
          )}
        </div>
        <div
          className={`${styles.commentCenter} ${(isDeleted || !isVisible) && styles.hide}`}
        >
          {!isDeleted &&
            (isVisible ? (
              <p className={styles.content}>{renderTextWithLinks(content)}</p>
            ) : (
              '(관리자에 의해 차단된 댓글입니다)'
            ))}
          {isDeleted && '(삭제된 댓글입니다)'}
        </div>
        <div className={styles.commentBottom}>
          {!isDeleted && (
            <>
              <button
                className={styles.commentCount}
                type='button'
                onClick={handleReply}
              >
                <Icon
                  id='comment-stroke'
                  width={18}
                  height={15}
                  style={{
                    paddingTop: '0.1rem',
                  }}
                  stroke='var(--blue-3)'
                  fill='none'
                />
                <p>{children.length}</p>
              </button>
              <button
                className={styles.likedCount}
                type='button'
                onClick={() => (isLiked ? unlike.mutate() : like.mutate())}
              >
                <Icon
                  id='like-stroke'
                  width={16}
                  height={18}
                  stroke='var(--blue-3)'
                  fill={isLiked ? 'var(--blue-3)' : 'none'}
                />
                <span>{likeCount.toLocaleString()}</span>
              </button>
            </>
          )}
        </div>
        {children.length > 0 &&
          children.map((childComment, index) => (
            <NestedComment
              key={childComment.id}
              data={childComment}
              isLast={index === children.length - 1}
              isFirst={index === 0}
              onCommentOptionClick={onCommentOptionClick}
            />
          ))}
        {modal.id === 'my-comment-more-options' &&
          (commentId === data.id ||
            data.children.some((child) => child.id === commentId)) && (
            // 내 댓글 더보기 클릭 시 뜨는 모달
            <MoreOptionModal
              title='내 댓글'
              optionList={MORE_OPTION_MODAL_TEXT.MY_COMMENT_MORE_OPTION_LIST}
              functions={[handleEdit, null]}
              top={moreOptionTop}
            />
          )}
      </div>
      <CommentModalRenderer data={data} moreOptionTop={moreOptionTop} />
    </>
  );
});

export default Comment;
