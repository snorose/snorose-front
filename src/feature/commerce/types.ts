export type InventoryPolicy = 'PREORDER' | 'LIMITED_STOCK';

export type Sale = {
  saleId: number;
  sellerName: string;
  title: string;
  description: string;
  closesAt: string;
  paymentDueMinutes: number;
  bank: { bankName: string; accountHolder: string };
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
