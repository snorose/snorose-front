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
      message: '요청에 성공하였습니다.',
      result,
    },
  };
}

describe('commerce API contracts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches sale details from GET /v1/commerce/sales/{saleId}', async () => {
    const result = { saleId: 42, title: 'Summer Goods' };
    const getSpy = jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue(successResponse(result));

    await expect(getSale('42')).resolves.toBe(result);

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith('/v1/commerce/sales/42');
  });

  it('creates an order with the POST /v1/commerce/orders request body defined by the API contract', async () => {
    const result = {
      orderNumber: 'SR-20260829-000001',
      idempotentReplay: false,
    };
    const postSpy = jest
      .spyOn(authAxios, 'post')
      .mockResolvedValue(successResponse(result));
    const request = {
      saleId: 1,
      clientRequestId: '96c10975-8b9b-4ee1-95eb-aece3fb38926',
      buyerContact: '01012345678',
      noticeAcceptances: [
        {
          type: 'GENERAL',
          text: '수령 시 학생증을 제시합니다.',
          accepted: true,
        },
        {
          type: 'SYSTEM_PRIVACY_CONSENT',
          text: '주문 확인을 위해 개인정보 제공에 동의합니다.',
          accepted: false,
        },
      ],
      items: [{ productId: 7, variantId: 11, quantity: 2 }],
    } as unknown as Parameters<typeof createOrder>[0];

    await expect(createOrder(request)).resolves.toBe(result);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith('/v1/commerce/orders', {
      saleId: 1,
      clientRequestId: '96c10975-8b9b-4ee1-95eb-aece3fb38926',
      buyerContact: '01012345678',
      noticeAcceptances: [
        {
          type: 'GENERAL',
          text: '수령 시 학생증을 제시합니다.',
          accepted: true,
        },
        {
          type: 'SYSTEM_PRIVACY_CONSENT',
          text: '주문 확인을 위해 개인정보 제공에 동의합니다.',
          accepted: false,
        },
      ],
      items: [{ productId: 7, variantId: 11, quantity: 2 }],
    });
  });

  it('reads buyer orders from GET /v1/commerce/orders with the page query parameter', async () => {
    const result = { hasNext: false, data: [] };
    const getSpy = jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue(successResponse(result));

    await expect(readOrders()).resolves.toBe(result);
    expect(getSpy).toHaveBeenLastCalledWith('/v1/commerce/orders?page=0');

    await expect(readOrders(3)).resolves.toBe(result);
    expect(getSpy).toHaveBeenLastCalledWith('/v1/commerce/orders?page=3');
    expect(getSpy).toHaveBeenCalledTimes(2);
  });

  it('reads an order from GET /v1/commerce/orders/{orderNumber}', async () => {
    const result = { orderNumber: 'SR-20260829-000001' };
    const getSpy = jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue(successResponse(result));

    await expect(readOrder('SR-20260829-000001')).resolves.toBe(result);

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(
      '/v1/commerce/orders/SR-20260829-000001'
    );
  });

  it('cancels an order through POST /v1/commerce/orders/{orderNumber}/cancel without a request body', async () => {
    const data = {
      isSuccess: true,
      code: 1000,
      message: '요청에 성공하였습니다.',
    };
    const postSpy = jest.spyOn(authAxios, 'post').mockResolvedValue({ data });

    await expect(cancelOrder('SR-20260829-000001')).resolves.toBe(data);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      '/v1/commerce/orders/SR-20260829-000001/cancel'
    );
  });

  it('pairs a pickup device through POST /v1/commerce/pickup-device/pair without auth headers', async () => {
    const result = {
      deviceId: 12,
      deviceToken: 'pdt_9f31c7',
      name: 'Pickup iPad',
      heartbeatIntervalSeconds: 30,
    };
    const postSpy = jest
      .spyOn(defaultAxios, 'post')
      .mockResolvedValue(successResponse(result));

    await expect(
      pairPickupDevice({ pairingCode: '482913', deviceLabel: 'iPad-A' })
    ).resolves.toBe(result);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith('/v1/commerce/pickup-device/pair', {
      pairingCode: '482913',
      deviceLabel: 'iPad-A',
    });
  });

  it('reads the pickup device session with X-Pickup-Device-Token', async () => {
    const result = { state: 'IDLE' };
    const getSpy = jest
      .spyOn(defaultAxios, 'get')
      .mockResolvedValue(successResponse(result));

    await expect(readPickupDeviceSession('pdt_9f31c7')).resolves.toBe(result);

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith('/v1/commerce/pickup-device/session', {
      headers: {
        'X-Pickup-Device-Token': 'pdt_9f31c7',
      },
    });
  });

  it('confirms a pickup session through POST /v1/commerce/pickup-device/session/confirm without a request body', async () => {
    const result = {
      state: 'CONFIRMED',
      buyerName: 'Buyer',
      items: [{ productName: 'T-shirt', optionLabel: 'M', quantity: 1 }],
      autoResetSeconds: 5,
    };
    const postSpy = jest
      .spyOn(defaultAxios, 'post')
      .mockResolvedValue(successResponse(result));

    await expect(confirmPickupSession('pdt_9f31c7')).resolves.toBe(result);

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
    const result = {
      serverTime: '2026-08-29T13:59:41',
      state: 'ARMED',
    };
    const postSpy = jest
      .spyOn(defaultAxios, 'post')
      .mockResolvedValue(successResponse(result));

    await expect(sendPickupDeviceHeartbeat('pdt_9f31c7')).resolves.toBe(result);

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
