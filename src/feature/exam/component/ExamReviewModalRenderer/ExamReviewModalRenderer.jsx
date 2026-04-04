import { MoreOptionModal, ConfirmModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT, MORE_OPTION_MODAL_TEXT } from '@/shared/constant';

export default function ExamReviewModalRenderer({
  modal,
  handleEdit,
  handleReport,
  handleDelete,
}) {
  return (
    <>
      {(() => {
        switch (modal.id) {
          case 'exam-review-download':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.EXAM_REVIEW_DUPLICATION}
                onConfirm={handleReport}
              />
            );
          // 시험후기 더보기 모달 (게시글 신고, 이용자 신고)
          case 'exam-review-more-options':
            return (
              <MoreOptionModal
                title='시험후기'
                optionList={MORE_OPTION_MODAL_TEXT.EXAM_REVIEW_MORE_OPTION_LIST}
                functions={[
                  () => handleReport('exam'),
                  () => handleReport('user'),
                ]}
              />
            );
          // 내 시험후기 더보기 모달 (수정, 삭제)
          case 'my-exam-review-more-options':
            return (
              <MoreOptionModal
                title='내 시험후기'
                optionList={
                  MORE_OPTION_MODAL_TEXT.MY_EXAM_REVIEW_MORE_OPTION_LIST
                }
                functions={[handleEdit, null]}
              />
            );
          // 시험후기 삭제 최종 확인 모달
          case 'confirm-exam-review-delete':
            return (
              <ConfirmModal
                modalText={CONFIRM_MODAL_TEXT.DELETE_EXAM_REVIEW}
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
