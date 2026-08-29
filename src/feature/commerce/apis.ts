import type {
  ConfirmPickupSessionResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderResponse,
  OrdersResponse,
  PairPickupDeviceRequest,
  PairPickupDeviceResponse,
  PickupDeviceHeartbeatResponse,
  PickupDeviceSessionResponse,
  SaleResponse,
} from '@/feature/commerce/types';

import { authAxios, defaultAxios } from '@/axios';

const PICKUP_DEVICE_TOKEN_HEADER = 'X-Pickup-Device-Token';

export async function getSale(saleId: string): Promise<SaleResponse> {
  const response = await authAxios.get(`/v1/commerce/sales/${saleId}`);
  return response.data.result;
}

export async function createOrder({
  saleId,
  clientRequestId,
  buyerContact,
  noticeAcceptances,
  items,
}: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await authAxios.post('/v1/commerce/orders', {
    saleId,
    clientRequestId,
    buyerContact,
    noticeAcceptances,
    items,
  });

  return response.data.result;
}

export async function readOrders(page: number = 0): Promise<OrdersResponse> {
  const response = await authAxios.get(`/v1/commerce/orders?page=${page}`);
  return response.data.result;
}

export async function readOrder(orderNumber: string): Promise<OrderResponse> {
  const response = await authAxios.get(`/v1/commerce/orders/${orderNumber}`);
  return response.data.result;
}

export async function cancelOrder(orderNumber: string) {
  const resopnse = await authAxios.post(
    `/v1/commerce/orders/${orderNumber}/cancel`
  );

  return resopnse.data;
}

export async function pairPickupDevice({
  pairingCode,
  deviceLabel,
}: PairPickupDeviceRequest): Promise<PairPickupDeviceResponse> {
  const response = await defaultAxios.post('/v1/commerce/pickup-device/pair', {
    pairingCode,
    deviceLabel,
  });

  return response.data.result;
}

export async function readPickupDeviceSession(
  deviceToken: string
): Promise<PickupDeviceSessionResponse> {
  const response = await defaultAxios.get(
    '/v1/commerce/pickup-device/session',
    {
      headers: generatePickupDeviceHeaders(deviceToken),
    }
  );

  return response.data.result;
}

export async function confirmPickupSession(
  deviceToken: string
): Promise<ConfirmPickupSessionResponse> {
  const response = await defaultAxios.post(
    '/v1/commerce/pickup-device/session/confirm',
    undefined,
    {
      headers: generatePickupDeviceHeaders(deviceToken),
    }
  );

  return response.data.result;
}

export async function sendPickupDeviceHeartbeat(
  deviceToken: string
): Promise<PickupDeviceHeartbeatResponse> {
  const response = await defaultAxios.post(
    '/v1/commerce/pickup-device/heartbeat',
    undefined,
    {
      headers: generatePickupDeviceHeaders(deviceToken),
    }
  );

  return response.data.result;
}

function generatePickupDeviceHeaders(deviceToken: string) {
  return {
    [PICKUP_DEVICE_TOKEN_HEADER]: deviceToken,
  };
}
