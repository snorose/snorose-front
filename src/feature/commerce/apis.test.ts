import { authAxios, defaultAxios } from '@/axios';

import {
  cancelOrder,
  confirmPickupSession,
  createOrder,
  getSale,
  pairPickupDevice,
  readOrder,
  readOrders,
  readPickupDeviceSession,
  sendPickupDeviceHeartbeat,
} from './apis';

function successResponse(result: unknown) {
  return {
    data: {
      isSuccess: true,
      code: 1000,
      message: 'success',
      result,
    },
  };
}

describe('commerce API contracts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches sale details from GET /v1/commerce/sales/{saleId}', async () => {
    const sale = { saleId: 42, title: 'Summer Goods' };
    const getSpy = jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue(successResponse(sale));

    await expect(getSale('42')).resolves.toBe(sale);

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith('/v1/commerce/sales/42');
  });

  it('creates an order with the POST /v1/commerce/orders request body defined by the API contract', async () => {
    const responseBody = {
      isSuccess: true,
      code: 1000,
      message: 'success',
      result: {
        orderNumber: 'SR-20260829-000001',
        idempotentReplay: false,
      },
    };
    const postSpy = jest
      .spyOn(authAxios, 'post')
      .mockResolvedValue({ data: responseBody });
    const request = {
      saleId: 1,
      clientRequestId: '96c10975-8b9b-4ee1-95eb-aece3fb38926',
      buyerContact: '01012345678',
      contactSharingConsent: true,
      noticeAcceptances: [
        { noticeId: 31, version: 2, accepted: true },
        { noticeId: 90, version: 3, accepted: false },
      ],
      items: [{ productId: 7, variantId: 11, quantity: 2 }],
    } as unknown as Parameters<typeof createOrder>[0];

    await expect(createOrder(request)).resolves.toBe(responseBody);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith('/v1/commerce/orders', {
      saleId: 1,
      clientRequestId: '96c10975-8b9b-4ee1-95eb-aece3fb38926',
      buyerContact: '01012345678',
      contactSharingConsent: true,
      noticeAcceptances: [
        { noticeId: 31, version: 2, accepted: true },
        { noticeId: 90, version: 3, accepted: false },
      ],
      items: [{ productId: 7, variantId: 11, quantity: 2 }],
    });
  });

  it('reads buyer orders from GET /v1/commerce/orders with the page query parameter', async () => {
    const orders = { hasNext: false, data: [] };
    const getSpy = jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue(successResponse(orders));

    await expect(readOrders()).resolves.toBe(orders);
    expect(getSpy).toHaveBeenLastCalledWith('/v1/commerce/orders?page=0');

    await expect(readOrders(3)).resolves.toBe(orders);
    expect(getSpy).toHaveBeenLastCalledWith('/v1/commerce/orders?page=3');
    expect(getSpy).toHaveBeenCalledTimes(2);
  });

  it('reads an order from GET /v1/commerce/orders/{orderNumber}', async () => {
    const order = { orderNumber: 'SR-20260829-000001' };
    const getSpy = jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue(successResponse(order));

    await expect(readOrder('SR-20260829-000001')).resolves.toBe(order);

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(
      '/v1/commerce/orders/SR-20260829-000001'
    );
  });

  it('cancels an order through POST /v1/commerce/orders/{orderNumber}/cancel without a request body', async () => {
    const responseBody = {
      isSuccess: true,
      code: 1000,
      message: 'success',
      result: {
        orderNumber: 'SR-20260829-000001',
        orderStatus: 'CANCELLED',
      },
    };
    const postSpy = jest
      .spyOn(authAxios, 'post')
      .mockResolvedValue({ data: responseBody });

    await expect(cancelOrder('SR-20260829-000001')).resolves.toBe(responseBody);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      '/v1/commerce/orders/SR-20260829-000001/cancel'
    );
  });

  it('pairs a pickup device through POST /v1/commerce/pickup-device/pair without auth headers', async () => {
    const pairedDevice = {
      deviceId: 12,
      deviceToken: 'pdt_9f31c7',
      name: 'Pickup iPad',
      heartbeatIntervalSeconds: 30,
    };
    const postSpy = jest
      .spyOn(defaultAxios, 'post')
      .mockResolvedValue(successResponse(pairedDevice));

    await expect(
      pairPickupDevice({ pairingCode: '482913', deviceLabel: 'iPad-A' })
    ).resolves.toBe(pairedDevice);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith('/v1/commerce/pickup-device/pair', {
      pairingCode: '482913',
      deviceLabel: 'iPad-A',
    });
  });

  it('reads the pickup device session with X-Pickup-Device-Token', async () => {
    const session = { state: 'IDLE' };
    const getSpy = jest
      .spyOn(defaultAxios, 'get')
      .mockResolvedValue(successResponse(session));

    await expect(readPickupDeviceSession('pdt_9f31c7')).resolves.toBe(session);

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith('/v1/commerce/pickup-device/session', {
      headers: {
        'X-Pickup-Device-Token': 'pdt_9f31c7',
      },
    });
  });

  it('confirms a pickup session through POST /v1/commerce/pickup-device/session/confirm without a request body', async () => {
    const confirmation = {
      state: 'CONFIRMED',
      buyerName: 'Buyer',
      items: [{ productName: 'T-shirt', optionLabel: 'M', quantity: 1 }],
      autoResetSeconds: 5,
    };
    const postSpy = jest
      .spyOn(defaultAxios, 'post')
      .mockResolvedValue(successResponse(confirmation));

    await expect(confirmPickupSession('pdt_9f31c7')).resolves.toBe(
      confirmation
    );

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      '/v1/commerce/pickup-device/session/confirm',
      undefined,
      {
        headers: {
          'X-Pickup-Device-Token': 'pdt_9f31c7',
        },
      }
    );
  });

  it('sends pickup device heartbeat through POST /v1/commerce/pickup-device/heartbeat without a request body', async () => {
    const heartbeat = {
      serverTime: '2026-08-29T13:59:41',
      state: 'ARMED',
    };
    const postSpy = jest
      .spyOn(defaultAxios, 'post')
      .mockResolvedValue(successResponse(heartbeat));

    await expect(sendPickupDeviceHeartbeat('pdt_9f31c7')).resolves.toBe(
      heartbeat
    );

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      '/v1/commerce/pickup-device/heartbeat',
      undefined,
      {
        headers: {
          'X-Pickup-Device-Token': 'pdt_9f31c7',
        },
      }
    );
  });
});
