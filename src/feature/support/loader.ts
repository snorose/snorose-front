import { InquiryDTO, ReportDTO } from '@/feature/support/types';

/**
 * TODO:
 * - 존재하지 않는 inquiryId로 접근 시 404 처리
 * - 권한이 없는 inquryId로 접근 시 403 처리
 * - 답변 완료 후에는 접근 불가
 */

export const fetchInquiry = async ({ params }) => {
  const { inquiryId } = params;
  // const result = await fetch(`/v1/inquiries/${inquiryId}`);

  const post: InquiryDTO = {
    postId: 15,
    userRoleId: 4,
    isWriter: false,
    userId: '629j3YCdF2F+NPCBzMf0Rg==',
    userDisplay: '눈송',
    title: '시험후기 문의',
    link: 'https://www.snorose.com/...',
    content: '문의 내용',
    category: 'EXAM_REVIEW_INQUIRY',
    status: 'PENDING',
    commentCount: 0,
    createdAt: '2025-08-30T22:47:09.234619',
    updatedAt: null,
    isEdited: true,
    isWriterWithdrawn: false,
    attachments: [],
  };

  return post;
};

/**
 * TODO:
 * - 존재하지 않는 reportId로 접근 시 404 처리
 * - 권한이 없는 reportId로 접근 시 403 처리
 * - 처리 완료 후에는 접근 불가
 */

export const fetchReport = async ({ params }) => {
  const { reportId } = params;

  // const result = await fetch(`/v1/report/${reportId}`);

  const post: ReportDTO = {
    reportId: 15,
    userRoleId: 4,
    isWriter: true,
    userId: '629j3YCdF2F+NPCBzMf0Rg==',
    userDisplay: '눈송',
    title: '댓글 신고',
    content: '문의 내용',
    reportType: 'COMMENT_REPORT',
    category: 'COMMENT_LOW_QUALITY',
    status: 'PENDING',
    commentCount: 0,
    createdAt: '2026-02-16T22:47:09.234619',
    isEdited: false,
    isWriterWithdrawn: false,
    attachments: [],
  };

  return post;
};
