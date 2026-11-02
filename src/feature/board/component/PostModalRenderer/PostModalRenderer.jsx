import { useLocation } from 'react-router-dom';

import { ConfirmModal, MoreOptionModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT, MORE_OPTION_MODAL_TEXT } from '@/shared/constant';
import { getBoard } from '@/shared/lib';

export default function PostModalRenderer({
  modal,
  handleEdit,
  handleReport,
  handleDelete,
  handleShare,
  handleWithdrawReport,
}) {
  const { pathname } = useLocation();
  const currentBoardId =
    pathname.startsWith('/inquiry') || pathname.startsWith('/report')
      ? 13
      : getBoard(pathname.split('/')[2]).id;

  const optionList =
    currentBoardId === 13
      ? MORE_OPTION_MODAL_TEXT.MY_POST_MORE_OPTION_LIST.slice(0, 2)
      : MORE_OPTION_MODAL_TEXT.MY_POST_MORE_OPTION_LIST;

  const functions =
    currentBoardId === 13
      ? [handleEdit, null]
      : [handleEdit, null, handleShare];

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
                optionList={optionList}
                functions={functions}
              />
            );
          case 'my-report-more-options':
            return (
              <MoreOptionModal
                title='내 신고'
                optionList={MORE_OPTION_MODAL_TEXT.MY_REPORT_MORE_OPTION_LIST}
                functions={[null]}
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
          // 신고 철회 최종 확인 모달
          case 'confirm-report-withdraw':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.REPORT_WITHDRAW}
                onConfirm={handleWithdrawReport}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
}
