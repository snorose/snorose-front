import type {
  CreateOrderRequest,
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
  items,
}: CreateOrderRequest) {
  const response = await authAxios.post('/v1/commerce/orders', {
    saleId,
    clientRequestId,
    buyerContact,
    contactSharingConsent,
    items,
  });

  return response.data;
}
