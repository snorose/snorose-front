import { useMutation } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { useRef } from 'react';

import { reportPost, reportUser, reportComment } from '@/apis';

import { MUTATION_KEY } from '@/shared/constant';
import { useToast } from '@/shared/hook';
import { getBoard } from '@/shared/lib';

import { parseReportType } from '@/feature/report/lib/parseReportType';
import { useCommentContext } from '@/feature/comment/context';

// 공통 신고 뮤테이션 훅
function useReportMutation(mutationKey, mutationFn) {
  const { toast } = useToast();

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: ({ message }) => {
      toast({ message, variant: 'success' });
    },
    onError: () => {
      toast({ message: '신고에 실패했습니다.', variant: 'error' });
    },
  });
}

// 게시글 신고 훅
export function useReportPostMutation() {
  const { postId } = useParams();
  const { pathname } = useLocation();
  const currentBoard = getBoard(pathname.split('/')[2]);

  return useReportMutation(MUTATION_KEY.reportPost, (body) =>
    reportPost(currentBoard?.id, postId, body)
  );
}

// 유저 신고 훅
export function useReportUserMutation() {
  return useReportMutation(MUTATION_KEY.reportUser, (body) => reportUser(body));
}

// 댓글 신고 훅
export function useReportCommentMutation() {
  const { postId } = useParams();

  return useReportMutation(
    MUTATION_KEY.reportComment,
    ({ commentId, reportType }) =>
      reportComment(postId, commentId, { reportType })
  );
}

// 통합 신고 핸들러 훅
export function useReportHandler(modal, setModal, data) {
  const { commentId } = useCommentContext();
  const { mutateAsync: reportPostMutate } = useReportPostMutation();
  const { mutateAsync: reportUserMutate } = useReportUserMutation();
  const { mutateAsync: reportCommentMutate } = useReportCommentMutation();

  const submitDisabledRef = useRef(false);
  const parsedReportType = parseReportType(modal.type || '');

  const handlePostReport = async () => {
    if (!modal.type || submitDisabledRef.current) return;
    submitDisabledRef.current = true;
    try {
      await reportPostMutate({ reportType: modal.type });
    } catch (error) {
      console.error(error);
    } finally {
      submitDisabledRef.current = false;
    }
  };

  const handleUserReport = async () => {
    if (!modal.type || submitDisabledRef.current || !data?.encryptedUserId)
      return;
    submitDisabledRef.current = true;
    try {
      await reportUserMutate({
        encryptedUserId: data.encryptedUserId,
        reportType: modal.type,
      });
    } catch (error) {
      console.error(error);
    } finally {
      submitDisabledRef.current = false;
    }
  };

  const handleCommentReport = async () => {
    if (!modal.type || !data?.id || submitDisabledRef.current) return;
    submitDisabledRef.current = true;
    try {
      await reportCommentMutate({
        commentId,
        reportType: modal.type,
      });
    } catch (error) {
      console.error(error);
    } finally {
      submitDisabledRef.current = false;
    }
  };

  const handleReport = async () => {
    if (!modal.type || submitDisabledRef.current) return;

    switch (parsedReportType) {
      case 'post':
        await handlePostReport();
        break;
      case 'user':
        await handleUserReport();
        break;
      case 'comment':
        await handleCommentReport();
        break;
      default:
        break;
    }

    setModal({ id: null, type: null });
  };

  return {
    handleReport,
  };
}
