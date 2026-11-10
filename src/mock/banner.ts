// mocks/handlers/banner.ts
import { http, HttpResponse } from 'msw';

export const bannerHandlers = [
  http.get('*/v1/home/banners/view', () => {
    return HttpResponse.json({
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
      result: [
        {
          bannerId: 3,
          bannerName: '겨울 행사',
          bannerType: 'ad',
          imageUrl: 'https://example.com/banners/winter.png',
          redirectUrl: '/board/event/post/123',
          placement: 'main',
          displayOrder: 1,
        },
        {
          bannerId: 5,
          bannerName: '서비스 이용 안내',
          bannerType: 'general',
          imageUrl: 'https://example.com/banners/guide.png',
          redirectUrl: '/guide',
          placement: 'main',
          displayOrder: 2,
        },
      ],
    });
  }),
];
