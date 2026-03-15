import { authAxios } from '@/axios';

export const fetchReport = async (reportId) => {
  // const response = await authAxios.get(`/v1/report/${reportId}`);

  // return response?.data.result;

  return {
    postId: 15,
    userRoleId: 2,
    isWriter: false,
    userId: '629j3YCdF2F+NPCBzMf0Rg==',
    userDisplay: '눈송',
    title: '악의적인 댓글 신고',
    content: '신고 내용',
    reportType: 'COMMENT',
    category: 'COMMENT_INSULT_OR_DEFAMATION',
    status: 'PENDING',
    commentCount: 0,
    createdAt: '2025-08-30T22:47:09.234619',
    updatedAt: null,
    isEdited: true,
    isWriterWithdrawn: false,
    attachments: [],
  };
};
