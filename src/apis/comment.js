import { authAxios } from '@/axios';

export const getComments = async ({ postId, page = 0 }) => {
  const response = await authAxios.get(`/v1/posts/${postId}/comments`, {
    params: {
      page,
    },
  });
  return response?.data.result;
};

export const postComment = async ({ postId, parentId, content }) => {
  const response = await authAxios.post(`/v1/posts/${postId}/comments`, {
    parentId,
    content,
  });
  return response?.data.result;
};

export const deleteComment = async ({ postId, commentId }) => {
  const response = await authAxios.delete(
    `/v1/posts/${postId}/comments/${commentId}`
  );
  return response?.data.result;
};

export const editComment = async ({ postId, commentId, content }) => {
  const response = await authAxios.patch(
    `/v1/posts/${postId}/comments/${commentId}`,
    {
      content,
    }
  );
  return response?.data.result;
};
