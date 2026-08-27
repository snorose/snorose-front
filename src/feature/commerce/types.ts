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
    noticeId: number;
    version: number;
    type: 'GENERAL' | 'SYSTEM_PRIVACY_CONSENT';
    text: string;
    required: boolean;
  }>;
};

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

export type CreateOrderRequest = {
  saleId: string;
  clientRequestId: string;
  buyerContact: string;
  contactSharingConsent: boolean;
  noticeAcceptances: NoticeAcceptance[];
  items: Array<{
    productId: number;
    variantId: number;
    quantity: number;
  }>;
};

export type NoticeAcceptance = {
  noticeId: number;
  version: number;
  accepted: boolean;
};

export type NoticeAcceptanceMap = Partial<Record<number, boolean>>;

export type CreateOrderResponse = {
  result?: {
    orderNumber?: string;
    idempotentReplay?: boolean;
  };
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
