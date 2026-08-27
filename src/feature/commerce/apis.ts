import type {
  CreateOrderRequest,
  CreateOrderResponse,
  SaleResponse,
} from '@/feature/commerce/types';

import { authAxios } from '@/axios';

export async function getSale(saleId: string): Promise<SaleResponse> {
  const response = await authAxios.get(`/v1/commerce/sales/${saleId}`);
  return response.data.result;
}

export async function createOrder({
  saleId,
  clientRequestId,
  buyerContact,
  contactSharingConsent,
  noticeAcceptances,
  items,
}: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await authAxios.post('/v1/commerce/orders', {
    saleId,
    clientRequestId,
    buyerContact,
    contactSharingConsent,
    noticeAcceptances,
    items,
  });

  return response.data;
}
