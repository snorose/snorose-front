import { Sale } from '@/feature/commerce/types';

import { authAxios } from '@/axios';

export async function getSale(saleId: string): Promise<Sale> {
  const response = await authAxios.get(`/v1/commerce/sales/${saleId}`);
  return response.data.result;
}
