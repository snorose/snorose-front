import type { SaleType } from '@/feature/commerce/types';

export const fulfillmentWord = (type?: SaleType) =>
  type === 'LECTURE' ? '입장' : '수령';
