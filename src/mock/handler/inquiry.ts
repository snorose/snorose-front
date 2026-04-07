import { http, HttpResponse } from 'msw';

import type { InquiryWriteRequest } from '@/feature/support/api';

export const inquiryHandlers = [
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
  }),
];
