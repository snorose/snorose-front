import { delay, http, HttpResponse } from 'msw';

import type { SaleResponse } from '@/feature/commerce/types';

import { sale } from '@/dummy/data/sale';

const saleResponses: SaleResponse[] = [
  sale,
  {
    ...sale,
    saleId: 2,
    title: `${sale.title} - 마감`,
    status: 'CLOSE',
    orderable: false,
    closesAt: '2026-08-01T23:59:59',
  },
];

const saleResponseById = new Map(
  saleResponses.map((saleResponse) => [
    String(saleResponse.saleId),
    saleResponse,
  ])
);

export const handlers = [
  http.get('*/v1/commerce/sales/:saleId', async ({ params }) => {
    await delay(250);

    const saleId = Array.isArray(params.saleId)
      ? params.saleId[0]
      : params.saleId;
    const saleResponse = saleResponseById.get(String(saleId));

    if (!saleResponse) {
      return HttpResponse.json(
        {
          code: 'COMMERCE_SALE_NOT_FOUND',
          message: '판매 정보를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      result: saleResponse,
    });
  }),
];
