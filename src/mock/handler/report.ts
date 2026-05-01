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
        encryptedUserId: '629j3YCdF2F+NPCBzMf0Rg==',
        userDisplay: '눈송',
        title: '악의적인 댓글 신고',
        content: '신고 내용',
        reportType: 'COMMENT',
        reportCategory: 'COMMENT_INSULT_OR_DEFAMATION',
        status: 'COMPLETED',
        commentCount: 0,
        createdAt: '2025-08-30T22:47:09.234619',
        updatedAt: null,
        isEdited: true,
        isWriterWithdrawn: false,
        attachments: [],
      },
    });

    // 실패 - 작성자가 아닌 경우
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

  http.patch('*/v1/reports/report/:reportId', async () => {
    // 성공
    return HttpResponse.json({
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
      result: {
        reportId: 15,
        attachmentUrlList: [
          'https://snorose-bucket.s3.ap-northeast-2.amazonaws.com/post-attachment/1718326/20250420_145542_haja.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250420T055542Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=AKIAVRUVPMI43M2YCG23%2F20250420%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=9a7682391e2d1957ca18ee341055ed1c8193e441c86d34aff56bfde3677e4c1d',
        ],
      },
    });

    // 실패 - 작성자가 아닌 경우
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 2007,
    //     message: '유저의 권한이 없습니다.',
    //   },
    //   { status: 403 }
    // );

    // 실패 - 답변 완료인 경우
    // return HttpResponse.json(
    //   {
    //     isSuccess: false,
    //     code: 6102,
    //     message: '답변 완료된 글을 삭제할 수 없습니다.',
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
    //     code: 12,
    //     message: '해당 게시글을 찾을 수 없습니다',
    //   },
    //   { status: 500 }
    // );

    // 실패 - 네트워크 오류
    // return HttpResponse.error();
  }),
];
