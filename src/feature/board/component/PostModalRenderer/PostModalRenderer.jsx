import { useLocation } from 'react-router-dom';

import { useBoard } from '@/shared/hook';
import { MoreOptionModal, ConfirmModal, OptionModal } from '@/shared/component';
import { getBoard } from '@/shared/lib';
import {
  MORE_OPTION_MODAL_TEXT,
  CONFIRM_MODAL_TEXT,
  OPTION_MODAL_TEXT,
} from '@/shared/constant';

export default function PostModalRenderer({
  modal,
  handleEdit,
  handleReport,
  handleDelete,
  handleShare,
}) {
  const { pathname } = useLocation();
  const currentBoard = getBoard(pathname.split('/')[2]);

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
                functions={[null, null, handleShare]}
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
          // 게시글 신고하기 옵션 리스트 모달
          case 'report-post-types':
            return (
              <OptionModal
                title='게시글 신고'
                optionList={OPTION_MODAL_TEXT.REPORT_POST_TYPE_LIST}
              />
            );
          // 유저 신고하기 옵션 리스트 모달
          case 'report-user-types':
            return (
              <OptionModal
                title='이용자 신고'
                optionList={OPTION_MODAL_TEXT.REPORT_USER_TYPE_LIST}
              />
            );
          // 게시글 신고 최종 확인 모달
          case 'confirm-post-report':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.REPORT_POST}
                onConfirm={handleReport}
              />
            );
          // 유저 신고 최종 확인 모달
          case 'confirm-user-report':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.REPORT_USER}
                onConfirm={handleReport}
              />
            );
          // 게시글 삭제 최종 확인 모달
          case 'confirm-post-delete':
            return (
              <ConfirmModal
                modalText={
                  [21, 22].includes(Number(currentBoard.id))
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
                functions={[null, null, handleShare]}
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
          // 게시글 신고하기 옵션 리스트 모달
          case 'report-post-types':
            return (
              <OptionModal
                title='게시글 신고'
                optionList={OPTION_MODAL_TEXT.REPORT_POST_TYPE_LIST}
              />
            );
          // 유저 신고하기 옵션 리스트 모달
          case 'report-user-types':
            return (
              <OptionModal
                title='이용자 신고'
                optionList={OPTION_MODAL_TEXT.REPORT_USER_TYPE_LIST}
              />
            );
          // 게시글 신고 최종 확인 모달
          case 'confirm-post-report':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.REPORT_POST}
                onConfirm={handleReport}
              />
            );
          // 유저 신고 최종 확인 모달
          case 'confirm-user-report':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.REPORT_USER}
                onConfirm={handleReport}
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
