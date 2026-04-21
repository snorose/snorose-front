import { http, HttpResponse } from 'msw';

import type { InquiryCreateRequest } from '@/feature/support/api';

export const inquiryHandlers = [
  http.get('*/v1/inquiries/111', async () => {
    // 성공
    return HttpResponse.json({
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
      result: {
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
      },
    });
    // 실패 - 권한 없음
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 2007,
    //     message: '유저의 권한이 없습니다.',
    //   },
    //   { status: 403 }
    // );
    // 실패 - 없거나 삭제된 경우
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 3031,
    //     message: '해당 게시글을 찾을 수 없습니다',
    //   },
    //   { status: 404 }
    // );
    // 실패 - 서버 오류
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 3031,
    //     message: '해당 게시글을 찾을 수 없습니다',
    //   },
    //   { status: 500 }
    // );
    // 실패 - 네트워크 오류
    // return HttpResponse.error();
  }),

  http.post('*/v1/inquiries/inquiry', async ({ request }) => {
    const data = await request.json();
    const body = data as InquiryCreateRequest;
    const attachments = body.attachments || [];

    // 첨부파일 개수 초과
    if (attachments.length > 3) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: 3032,
          message: '첨부파일 첨부 가능 개수를 초과했습니다.',
        },
        { status: 400 }
      );
    }

    // 성공
    return HttpResponse.json({
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
      result: {
        postId: 11368,
        attachmentUrlList: [],
      },
    });

    // 실패 - 권한 없음
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 2007,
    //     message: '유저의 권한이 없습니다.',
    //   },
    //   { status: 403 }
    // );

    // 실패 - 네트워크 오류
    // return HttpResponse.error();
  }),
];
