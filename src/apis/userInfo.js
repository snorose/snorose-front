import { authAxios } from '@/axios';

export const withdrawAccount = async (body) => {
  const response = await authAxios.delete('/v1/users/withdraw', {
    data: body,
  });

  return response?.data;
};

export const getMyPageUserInfo = async () => {
  const response = await authAxios.get('/v1/users/mypage');

  return response?.data.result;
};

export const updateUserInfo = async (body) => {
  const response = await authAxios.patch('/v1/users/mypage', body);

  return response?.data;
};

export const updatePassword = async (body) => {
  const response = await authAxios.patch('/v1/users/mypage/password', body);

  return response?.data;
};

export const getMyPosts = async (params = {}) => {
  const response = await authAxios.get('/v1/users/mypage/posts', {
    params,
  });

  return response?.data.result;
};

export const getMyComments = async (params = {}) => {
  const response = await authAxios.get('/v1/users/mypage/comments', {
    params,
  });

  return response?.data.result;
};

export const getDownloadedExamReviews = async (params = {}) => {
  const response = await authAxios.get('/v1/users/mypage/reviewFileList', {
    params,
  });

  return response?.data.result;
};

export const readInquiryAndReportList = async (params) => {
  const response = await authAxios.get('/v1/users/mypage/inquiries', {
    params,
  });

  return response?.data.result;
};

export const getScrapedExamReviews = async (params) => {
  const response = await authAxios.get('/v1/scraps/reviews', {
    params,
  });

  return response?.data.result;
};

export const getScrapedPosts = async (params) => {
  const response = await authAxios.get('/v1/scraps/posts', {
    params,
  });

  return response?.data.result;
};
