import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  COMMENT_ACTION_TYPE,
  MUTATION_KEY,
  QUERY_KEY,
  TOAST,
} from '@/shared/constant';
import { useToast } from '@/shared/hook';
import {
  flatPaginationCache,
  getBoard,
  toPaginationCacheFormat,
} from '@/shared/lib';

import {
  deleteIfTargetComment,
  editIfTargetComment,
} from '@/feature/comment/lib';

import {
  deleteComment as remove,
  editComment as edit,
  postComment as post,
} from '@/apis';

export default function useComment() {
  const [loading, setLoading] = useState();
  const { postId } = useParams();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const currentBoard = getBoard(pathname.split('/')[2]);

  const updateCommentCache = (actionIfTargetComment) => {
    queryClient.setQueryData([QUERY_KEY.comments, postId], (prev) => {
      const flattenComments = flatPaginationCache(prev);
      const updatedComments = flattenComments.map(actionIfTargetComment);
      return toPaginationCacheFormat(updatedComments);
    });
  };

  const updateCommentCountCache = ({ type }) => {
    queryClient.setQueryData(QUERY_KEY.post(postId), (prev) => ({
      ...prev,
      commentCount:
        type === COMMENT_ACTION_TYPE.create
          ? prev.commentCount + 1
          : prev.commentCount - 1,
    }));
  };

  const updateUserPoints = (pointDifference) => {
    queryClient.setQueryData([QUERY_KEY.userInfo], (prev) => ({
      ...prev,
      points: prev.points + pointDifference,
    }));
  };

  const invalidateUserInfo = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.userInfo],
      refetchType: 'inactive',
    });
  };

  const onError = ({ response }) => {
    toast({ message: response.data.message, variant: 'error' });
  };

  const onSettled = () => {
    setLoading(false);
  };

  const createComment = useMutation({
    mutationKey: [MUTATION_KEY.createComment],
    mutationFn: async ({ content, parentId }) => {
      return await post({ postId, parentId, content });
    },
    onSuccess: (newComment) => {
      const { parentId, pointDifference } = newComment;

      updateUserPoints(pointDifference);

      queryClient.setQueryData([QUERY_KEY.comments, postId], (prev) => {
        const flattenComments = flatPaginationCache(prev);

        if (parentId) {
          const newComments = flattenComments.map((comment) =>
            comment.id === parentId
              ? { ...comment, children: [...comment.children, newComment] }
              : comment
          );
          return toPaginationCacheFormat(newComments);
        }

        const newComments = [...flattenComments, newComment];
        return toPaginationCacheFormat(newComments);
      });

      updateCommentCountCache({ type: COMMENT_ACTION_TYPE.create });

      !pointDifference
        ? toast({
            message: TOAST.COMMENT.createNoPoints,
            variant: 'success',
          })
        : toast({ message: TOAST.COMMENT.create, variant: 'success' });
    },
    onError,
    onSettled,
  });

  const deleteComment = useMutation({
    mutationKey: [MUTATION_KEY.deleteComment],
    mutationFn: async ({ commentId }) => {
      return await remove({ postId, commentId });
    },
    onSuccess: (deletedComment) => {
      const { id, pointDifference } = deletedComment;

      updateUserPoints(pointDifference);

      updateCommentCache((comment) =>
        deleteIfTargetComment({
          comment,
          targetId: id,
        })
      );

      updateCommentCountCache({ type: COMMENT_ACTION_TYPE.delete });
      // !pointDifference; // pointDifference값 백엔 수정 되면 이 코드로 다시 변경
      currentBoard.id === 23 || currentBoard.id === 32
        ? toast({
            message: TOAST.COMMENT.deleteNoPoints,
            variant: 'success',
          })
        : toast({ message: TOAST.COMMENT.delete, variant: 'success' });
    },
    onError,
    onSettled,
  });

  const editComment = useMutation({
    mutationKey: [MUTATION_KEY.editComment],
    mutationFn: async ({ commentId, content, parentId }) => {
      return await edit({ postId, commentId, content, parentId });
    },
    onSuccess: (editedComment) => {
      const { id, content } = editedComment;

      updateCommentCache((comment) =>
        editIfTargetComment({
          comment,
          targetId: id,
          content,
        })
      );

      toast({ message: TOAST.COMMENT.edit, variant: 'success' });
    },
    onError,
    onSettled,
  });

  return {
    createComment,
    deleteComment,
    editComment,
    loading,
    setLoading,
  };
}
