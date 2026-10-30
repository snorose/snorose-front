import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ConfirmModal, MoreOptionModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT, MORE_OPTION_MODAL_TEXT } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { useCommentContext } from '../../context';
import { useComment } from '../../hook';

export default function CommentModalRenderer({ data, moreOptionTop }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { modal, setModal } = useContext(ModalContext);

  const { deleteComment } = useComment();

  const { commentId, resetCommentState } = useCommentContext();

  return (
    <>
      {(() => {
        switch (modal.id) {
          // 남의 댓글 더보기 클릭 시 뜨는 모달
          case 'report-comment':
            return commentId === data.id ||
              data.children.some((child) => child.id === commentId) ? (
              <MoreOptionModal
                title='댓글'
                optionList={MORE_OPTION_MODAL_TEXT.COMMENT_MORE_OPTION_LIST}
                functions={[
                  () => navigate(`/report/write/comment?targetId=${data.id}`),
                  () =>
                    navigate(
                      `/report/write/user?targetId=${data.encryptedUserId}`
                    ),
                ]}
                top={moreOptionTop}
              />
            ) : null;
          // 댓글 삭제 확인 모달
          case 'confirm-comment-delete':
            return (
              <ConfirmModal
                modalText={
                  pathname.startsWith('/board/permanent-snow') ||
                  pathname.startsWith('/board/exam-review')
                    ? CONFIRM_MODAL_TEXT.DELETE_COMMENT_WITHOUT_POINT_DEDUCTION
                    : CONFIRM_MODAL_TEXT.DELETE_COMMENT
                }
                onConfirm={() => {
                  deleteComment.mutate({ commentId });
                  resetCommentState();
                  setModal({ id: null, type: null });
                }}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
}
