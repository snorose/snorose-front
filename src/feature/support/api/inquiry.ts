import { authAxios } from '@/axios';

export const fetchInquiry = async (inquiryId) => {
  // const response = await authAxios.get(`/v1/inquiries/${inquiryId}`);

  // return response?.data.result;

  return {
    postId: 15,
    userRoleId: 2,
    isWriter: true,
    userId: '629j3YCdF2F+NPCBzMf0Rg==',
    userDisplay: '눈송',
    title: '이벤트 문의',
    link: 'https://www.snorose.com/...',
    content: '문의 내용',
    category: 'EXAM_REVIEW_INQUIRY',
    status: 'COMPLETED',
    commentCount: 0,
    likeCount: 0,
    scrapCount: 0,
    createdAt: '2025-03-07T12:13:09.234619',
    updatedAt: null,
    isEdited: false,
    isWriterWithdrawn: false,
    attachments: [],
  };
};
