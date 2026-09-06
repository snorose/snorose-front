import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { IconFile } from '@snorose/icons';
import { useQueryClient } from '@tanstack/react-query';

import { ConfirmModal,FetchLoadingOverlay, Icon } from '@/shared/component';
import {
  CONFIRM_MODAL_TEXT,
  LOADING_MESSAGE,
  QUERY_KEY,
  TOAST,
} from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useToast } from '@/shared/hook';

import { getExamReview } from '@/apis';

import styles from './ReviewDownload.module.css';

const appendTimestampToFileName = (fileName) => {
  return fileName.replace('.pdf', `_${Date.now()}.pdf`);
};

export default function ReviewDownload({
  className,
  fileName,
  isDownloaded,
  isWriter,
}) {
  const { postId } = useParams();
  const { toast } = useToast();
  const { modal, setModal } = useContext(ModalContext);
  const [loading, setLoading] = useState();

  const queryClient = useQueryClient();

  const downloadExamReview = async () => {
    const data = await getExamReview(postId, fileName);

    const blob = new Blob([data.data], {
      type: 'application/pdf',
    });
    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', appendTimestampToFileName(fileName));
    link.click();
    window.URL.revokeObjectURL(fileUrl);
  };

  const handleDownload = async () => {
    setLoading(true);

    try {
      await downloadExamReview();

      const reviewDetail = queryClient.getQueryData(QUERY_KEY.post(postId));
      const { isDownloaded } = reviewDetail ?? { isDownloaded: false };

      queryClient.setQueryData(QUERY_KEY.post(postId), (prev) => {
        return { ...prev, isDownloaded: true };
      });

      queryClient.setQueryData([QUERY_KEY.userInfo], (prev) => ({
        ...prev,
        balance: isDownloaded ? prev.balance : prev.balance - 50,
      }));

      toast({ message: TOAST.EXAM_REVIEW.download, variant: 'success' });
    } catch ({ response }) {
      const text = await response.data.text();
      const { message } = JSON.parse(text);
      toast({ message });
    } finally {
      setLoading(false);
      setModal({ id: null, type: null });
    }
  };

  return (
    <>
      <button
        className={` ${styles.layout} ${className}`}
        onClick={(event) => {
          event.stopPropagation();

          if (isWriter || isDownloaded) {
            handleDownload();
            return;
          }

          setModal({ id: 'exam-review-download', type: null });
        }}
      >
        <IconFile width={10} height={14} viewBox="0 0 24 24" />
        <span className={styles.name}>{fileName}</span>
      </button>
      {modal.id === 'exam-review-download' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.EXAM_REVIEW_DOWNLOAD}
          onConfirm={handleDownload}
        />
      )}
      {loading && (
        <FetchLoadingOverlay text={LOADING_MESSAGE.downloadExamReview} />
      )}
    </>
  );
}
