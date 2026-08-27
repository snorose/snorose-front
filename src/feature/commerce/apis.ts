import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrdersResponse,
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

export async function readOrders(page: number = 0): Promise<OrdersResponse> {
  const response = await authAxios.get(`/v1/commerce/orders?page=${page}`);
  return response.data.result;
}
