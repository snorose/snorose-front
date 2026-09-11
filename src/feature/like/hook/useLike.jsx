import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LIKE_TYPE, MUTATION_KEY, QUERY_KEY } from '@/shared/constant';
import { useToast } from '@/shared/hook';
import { flatPaginationCache, toPaginationCacheFormat } from '@/shared/lib';

import { updateLikeIfTargetComment } from '@/feature/comment/lib';

import { like as likeApi, unlike as unlikeApi } from '@/apis';

export default function useLike({ type, sourceId }) {
  const queryClient = useQueryClient();
  const { postId } = useParams();
  const { toast } = useToast();

  const updatePostLikeCache = ({ isLiked, likeCount }) => {
    queryClient.setQueryData(QUERY_KEY.post(postId), (prev) => ({
      ...prev,
      isLiked,
      likeCount,
    }));
  };

  const updateCommentLikeCache = ({ targetId, isLiked, likeCount }) => {
    queryClient.setQueryData([QUERY_KEY.comments, postId], (prev) => {
      const flattenComments = flatPaginationCache(prev);
      const updatedComments = flattenComments.map((comment) =>
        updateLikeIfTargetComment({
          comment,
          targetId,
          isLiked,
          likeCount,
        })
      );
      return toPaginationCacheFormat(updatedComments);
    });
  };

  const onSuccess = ({ isLiked, likeCount }) => {
    if (type === LIKE_TYPE.post) {
      updatePostLikeCache({ isLiked, likeCount });
      return;
    }

    updateCommentLikeCache({ targetId: sourceId, isLiked, likeCount });
  };

  const onError = ({ response }) => {
    toast({ message: response.data.message, variant: 'error' });
  };

  const like = useMutation({
    mutationKey: [MUTATION_KEY.like],
    mutationFn: async () => {
      return await likeApi({ type, sourceId });
    },
    onSuccess,
    onError,
  });

  const unlike = useMutation({
    mutationKey: [MUTATION_KEY.unlike],
    mutationFn: () => unlikeApi({ type, sourceId }),
    onSuccess,
    onError,
  });

  return { like, unlike };
}
