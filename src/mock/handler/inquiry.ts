import { http, HttpResponse } from 'msw';

import type { InquiryWriteRequest } from '@/feature/support/api';

export const inquiryHandlers = [
  http.get('*/v1/users/mypage/inquiries', async () => {
    // 성공
    return HttpResponse.json({
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
      result: {
        hasNext: false,
        data: [
          {
            postId: 11,
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
            postId: 111,
            title: '이벤트 문의',
            userDisplay: '눈송',
            createdAt: '2025-04-21T12:30:11.519393',
            isEdited: true,
            status: 'PENDING',
            group: 'REPORT',
            category: 'EXAM_FALSE_REVIEW',
            reportType: 'EXAM',
          },
        ],
      },
    });
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
    const body = data as InquiryWriteRequest;
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
