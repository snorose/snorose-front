import type { BannerResponse } from '@/feature/advertisement/api';

import { defaultAxios } from '@/axios';

export async function readHomeBanners(): Promise<Array<BannerResponse>> {
  const response = await defaultAxios.get('/v1/home/banners/view');

  return response.data.result;
}
