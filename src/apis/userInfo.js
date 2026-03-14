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

export const getMyInquiriesAndReports = async (params = {}) => {
  // const response = await authAxios.get('/v1/users/mypage/inquiries', {
  //   params,
  // });

  // return response?.data.result;

  return {
    hasNext: true,
    data: [
      {
        postId: 1724829,
        boardId: 13,
        title: '시험후기 신고합니다',
        userDisplay: '정회원test',
        createdAt: '2025-04-13T22:30:11.519393',
        isEdited: true,
        status: 'PENDING',
        group: 'REPORT',
        category: 'EXAM_FALSE_REVIEW',
        reportType: 'EXAM',
      },
      {
        postId: 1724902,
        boardId: 13,
        title: '이벤트 문의',
        userDisplay: '익명송이',
        createdAt: '2026-03-07T12:13:32.257872',
        isEdited: false,
        status: 'COMPLETED',
        group: 'INQUIRY',
        category: 'ECT',
      },
    ],
  };
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
