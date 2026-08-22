export type InventoryPolicy = 'PREORDER' | 'LIMITED_STOCK';

export type Sale = {
  saleId: number;
  sellerName: string;
  title: string;
  description: string;
  closesAt: string;
  paymentDueMinutes: number;
  bank: { bankName: string; accountNumber: string; accountHolder: string };
  pickup: { place: string; instructions: string };
  products: Array<{
    productId: number;
    name: string;
    description: string;
    inventoryPolicy: InventoryPolicy;
    maxPerBuyer: number | null;
    imageUrls: string[];
    variants: Array<{
      variantId: number;
      optionName: string;
      unitPrice: number;
      availableQuantity: number | null;
    }>;
  }>;
};

export type CreateOrderRequest = {
  saleId: string;
  clientRequestId: string;
  buyerContact: string;
  contactSharingConsent: boolean;
  items: Array<{
    variantId: number;
    quantity: number;
  }>;
};

export type QuantityMap = Partial<
  Record<number, Partial<Record<number, number>>>
>;

export type ProductOptionItem = {
  product: Sale['products'][number];
  variant: Sale['products'][number]['variants'][number];
  quantity: number;
  isSoldOut: boolean;
};

export type SelectedOrderItem = Omit<ProductOptionItem, 'isSoldOut'>;
