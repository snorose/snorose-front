import { useLocation } from 'react-router-dom';

import { ConfirmModal, MoreOptionModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT, MORE_OPTION_MODAL_TEXT } from '@/shared/constant';
import { useBoard } from '@/shared/hook';
import { getBoard } from '@/shared/lib';

export default function PostModalRenderer({
  modal,
  handleEdit,
  handleReport,
  handleDelete,
  handleShare,
}) {
  const { pathname } = useLocation();
  const currentBoardId = pathname.startsWith('/inquiry')
    ? 13
    : getBoard(pathname.split('/')[2]).id;

  return (
    <>
      {(() => {
        switch (modal.id) {
          // 게시글 더보기 모달 (게시글 신고, 이용자 신고, 공유하기)
          case 'post-more-options':
            return (
              <MoreOptionModal
                title='게시글'
                optionList={MORE_OPTION_MODAL_TEXT.POST_MORE_OPTION_LIST}
                functions={[
                  () => handleReport('post'),
                  () => handleReport('user'),
                  handleShare,
                ]}
              />
            );
          // 내 게시글 더보기 모달 (수정, 삭제, 공유하기)
          case 'my-post-more-options':
            return (
              <MoreOptionModal
                title='내 게시글'
                optionList={MORE_OPTION_MODAL_TEXT.MY_POST_MORE_OPTION_LIST}
                functions={[handleEdit, null, handleShare]}
              />
            );
          // 이벤트 게시글 더보기 모달 (공유하기)
          case 'event-post-more-option':
            return (
              <MoreOptionModal
                title='이벤트'
                optionList={MORE_OPTION_MODAL_TEXT.EVENT_MORE_OPTION_LIST}
                functions={[handleShare]}
              />
            );
          // 게시글 삭제 최종 확인 모달
          case 'confirm-post-delete':
            return (
              <ConfirmModal
                modalText={
                  [21, 22].includes(Number(currentBoardId))
                    ? CONFIRM_MODAL_TEXT.DELETE_POST
                    : CONFIRM_MODAL_TEXT.DELETE_POST_WITHOUT_POINT_DEDUCTION
                }
                onConfirm={handleDelete}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
}

/**
 * TODO(other): 동적 라우트에서 사용할 수 있기 때문에 route.migration.js를 사용할 때 함께 교체
 */
export function NewPostModalRenderer({
  modal,
  handleEdit,
  handleReport,
  handleDelete,
  handleShare,
}) {
  const { id: boardId } = useBoard();

  return (
    <>
      {(() => {
        switch (modal.id) {
          // 게시글 더보기 모달 (게시글 신고, 이용자 신고, 공유하기)
          case 'post-more-options':
            return (
              <MoreOptionModal
                title='게시글'
                optionList={MORE_OPTION_MODAL_TEXT.POST_MORE_OPTION_LIST}
                functions={[
                  () => handleReport('post'),
                  () => handleReport('user'),
                  handleShare,
                ]}
              />
            );
          // 내 게시글 더보기 모달 (수정, 삭제, 공유하기)
          case 'my-post-more-options':
            return (
              <MoreOptionModal
                title='내 게시글'
                optionList={MORE_OPTION_MODAL_TEXT.MY_POST_MORE_OPTION_LIST}
                functions={[handleEdit, null, handleShare]}
              />
            );
          // 이벤트 게시글 더보기 모달 (공유하기)
          case 'event-post-more-option':
            return (
              <MoreOptionModal
                title='이벤트'
                optionList={MORE_OPTION_MODAL_TEXT.EVENT_MORE_OPTION_LIST}
                functions={[handleShare]}
              />
            );
          // 게시글 삭제 최종 확인 모달
          case 'confirm-post-delete':
            return (
              <ConfirmModal
                modalText={
                  [21, 22].includes(Number(boardId))
                    ? CONFIRM_MODAL_TEXT.DELETE_POST
                    : CONFIRM_MODAL_TEXT.DELETE_POST_WITHOUT_POINT_DEDUCTION
                }
                onConfirm={handleDelete}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
}
