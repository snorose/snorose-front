import type { Sale } from '@/feature/commerce/types';

export const sale: Sale = {
  saleId: 1,
  sellerName: '눈송이',
  title: '눈송이의 판매 상품',
  description: '눈송이가 판매하는 훌륭한 상품입니다.',
  closesAt: '2023-12-31T23:59:59Z',
  paymentDueMinutes: 30,
  bank: { bankName: '국민은행', accountHolder: '눈송이' },
  pickup: { place: '눈송이의 집', instructions: '방문 수령' },
  products: [
    {
      productId: 1,
      name: '눈송이의 상품',
      description: '눈송이가 판매하는 훌륭한 상품입니다.',
      inventoryPolicy: 'LIMITED_STOCK',
      maxPerBuyer: 5,
      imageUrls: [],
      variants: [
        {
          variantId: 1,
          optionName: '옵션 1',
          unitPrice: 10000,
          availableQuantity: 10,
        },
      ],
    },
  ],
};
