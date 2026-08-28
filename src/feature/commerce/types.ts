export type SaleResponse = {
  saleId: number;
  sellerName: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSE';
  orderable: boolean;
  opensAt: string;
  closesAt: string;
  products: Array<{
    productId: number;
    name: string;
    description: string;
    inventoryPolicy: 'PREORDER' | 'LIMITED_STOCK';
    maxPerBuyer: number | null;
    remainingForBuyer: number | null;
    images: Array<{ imageId: number; url: string }>;
    variants: Array<{
      variantId: number;
      optionLabel: string;
      unitPrice: number;
      available: boolean;
      availableQuantity: number | null;
    }>;
  }>;
  notices: Array<{
    type: 'GENERAL' | 'SYSTEM_PRIVACY_CONSENT';
    text: string;
    required: boolean;
  }>;
};

export type QuantityMap = Partial<
  Record<number, Partial<Record<number, number>>>
>;

export type ProductOptionItem = {
  product: SaleResponse['products'][number];
  variant: SaleResponse['products'][number]['variants'][number];
  quantity: number;
  isSoldOut: boolean;
};

export type SelectedOrderItem = Omit<ProductOptionItem, 'isSoldOut'>;

export type OrderStatus = OrdersResponse['data'][number]['orderStatus'];
export type PaymentStatus = OrdersResponse['data'][number]['paymentStatus'];
export type FulfillmentStatus =
  OrdersResponse['data'][number]['fulfillmentStatus'];

export type OrdersResponse = {
  hasNext: boolean;
  data: Array<{
    orderNumber: string;
    saleId: number;
    sellerName: string;
    saleTitle: string;
    thumbnailUrl: string;
    itemSummary: string;
    totalAmount: number;
    orderStatus: 'ACTIVE' | 'CANCELED' | 'COMPLETED';
    paymentStatus: 'WAITING' | 'PAID' | 'REVIEW_REQUIRED' | 'EXPIRED';
    fulfillmentStatus: 'PENDING' | 'PICKED_UP';
    paymentDueAt: string;
    createdAt: string;
  }>;
};

export type OrderResponse = {
  orderNumber: string;
  createdAt: string;

  saleId: number;
  sellerName: string;
  saleTitle: string;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  items: Array<{
    productId: number;
    name: string;
    optionLabel: string;
    price: number;
    quantity: number;
  }>;

  totalAmount: number;

  bank: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  paymentDueAt: string;

  pickup: {
    method: 'PICKUP';
    pickupPlace: string;
    pickupInstructions: string;
  };

  cancellable: boolean;
  reviewNotice: string;
};

export type CreateOrderRequest = {
  saleId: string;
  clientRequestId: string;
  buyerContact: string;
  noticeAcceptances: NoticeAcceptance[];
  items: Array<{
    productId: number;
    variantId: number;
    quantity: number;
  }>;
};

export type NoticeAcceptance = {
  type: 'GENERAL' | 'SYSTEM_PRIVACY_CONSENT';
  text: string;
  accepted: boolean;
};

export type NoticeAcceptanceMap = Partial<Record<number, boolean>>;

export type CreateOrderResponse = {
  result?: {
    orderNumber?: string;
    idempotentReplay?: boolean;
  };
};

export type PickupDeviceOrderItem = {
  productName: string;
  optionLabel: string;
  quantity: number;
};

export type PairPickupDeviceRequest = {
  pairingCode: string;
  deviceLabel: string;
};

export type PairPickupDeviceResponse = {
  deviceId: number;
  deviceToken: string;
  name: string;
  heartbeatIntervalSeconds: number;
};

export type PickupDeviceSessionResponse =
  | {
      state: 'IDLE';
    }
  | {
      state: 'ARMED';
      sessionId: number;
      expiresAt: string;
      remainingSeconds: number;
      order: {
        buyerName: string;
        studentNumberMasked: string;
        saleTitle: string;
        items: PickupDeviceOrderItem[];
      };
    };

export type ConfirmPickupSessionResponse = {
  state: 'CONFIRMED';
  buyerName: string;
  items: PickupDeviceOrderItem[];
  autoResetSeconds: number;
};

export type PickupDeviceHeartbeatResponse = {
  serverTime: string;
  state: PickupDeviceSessionResponse['state'];
};
