import { authAxios } from '@/axios';

export const getExamReview = async (postId, fileName) => {
  const response = await authAxios.get(
    `/v1/reviews/files/${postId}/download/${fileName}`,
    { responseType: 'blob' }
  );
  return response;
};

export const getExamReviewList = async ({ page, params }) => {
  const response = await authAxios.get('/v1/reviews', {
    params: {
      page,
      ...params,
    },
  });

  return response?.data.result;
};

export const getReviewWritePeriodActive = async () => {
  const response = await authAxios.get('/v1/reviews/period/active');
  return response?.data.result;
};

export const getReviewDetail = async (postId) => {
  const response = await authAxios.get(`/v1/reviews/${postId}`);
  return response?.data.result;
};

export const editReviewDetail = async (postId, edit) => {
  const response = await authAxios.patch(`/v1/reviews/${postId}`, edit);
  return response;
};

export const deleteExamReview = async (postId) => {
  const response = await authAxios.delete(`/v1/reviews/${postId}`);
  return response;
};

export const checkExamReviewDuplication = async ({
  lectureName,
  professor,
  classNumber,
  lectureYear,
  semester,
  examType,
}) => {
  const response = await authAxios.post('/v1/reviews/check-duplication', {
    lectureName,
    professor,
    classNumber,
    lectureYear,
    semester,
    examType,
  });
  return response;
};

export const postExamReview = async ({ data, file }) => {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

  formData.append('post', blob);
  formData.append('file', file);

  const response = await authAxios.post('/v1/reviews/review', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response;
};
