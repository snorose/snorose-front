import { http, HttpResponse } from 'msw';

import type { ReportCreateRequest } from '@/feature/support/api';

export const reportHandlers = [
  http.post('*/v1/reports/report', async ({ request }) => {
    const data = await request.json();
    const body = data as ReportCreateRequest;
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
        reportId: 15,
        attachmentUrlList: [],
      },
    });

    // 실패 - 신고 대상 오류
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 6103,
    //     message: '신고 대상이 잘못되었습니다',
    //   },
    //   { status: 400 }
    // );

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

  http.get('*/v1/reports/report/:reportId', async () => {
    // 성공
    return HttpResponse.json({
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
      result: {
        postId: 15,
        userRoleId: 4,
        isWriter: true,
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
];
