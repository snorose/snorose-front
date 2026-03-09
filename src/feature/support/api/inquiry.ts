import { authAxios } from '@/axios';

export const fetchInquiry = async (inquiryId) => {
  // const response = await authAxios.get(`/v1/inquiries/${inquiryId}`);

  // return response?.data.result;

  return {
    postId: 15,
    userRoleId: 4,
    isWriter: true,
    userId: '629j3YCdF2F+NPCBzMf0Rg==',
    userDisplay: '눈송',
    title: '시험후기 문의',
    link: 'https://www.snorose.com/...',
    content: '문의 내용',
    category: 'EXAM_REVIEW_INQUIRY',
    status: 'PENDING',
    commentCount: 0,
    likeCount: 0,
    scrapCount: 0,
    viewCount: 0,
    createdAt: '2025-08-30T22:47:09.234619',
    updatedAt: null,
    isEdited: true,
    isWriterWithdrawn: false,
    attachments: [],
  };
};
