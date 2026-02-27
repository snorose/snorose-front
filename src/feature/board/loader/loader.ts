import { InquiryDTO } from '@/feature/board/types';

export const fetchPost = async ({ params }) => {
  const { inquiryId } = params;
  // const result = await fetch(`/v1/inquiries/${inquiryId}`);

  // if (result.status === 404) {
  //   throw new Response('게시글을 찾을 수 없습니다.', {
  //     status: 404,
  //   });
  // }

  // if (!result.ok) {
  //   throw new Response('서버 통신 중 오류가 발생했습니다.', {
  //     status: 500,
  //   });
  // }

  // const post = await result.json();

  // if (post.status === 'finish') {
  //   // "수정 불가"라는 커스텀 에러를 던져 처리할 수도 있습니다.
  //   throw new Response('답변 완료된 글은 수정할 수 없습니다.', {
  //     status: 403,
  //   });
  // }

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
