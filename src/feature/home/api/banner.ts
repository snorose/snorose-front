import { defaultAxios } from '@/axios';

type BannerResponse = {
  bannerId: number;
  bannerName: string;
  bannerType: string;
  imageUrl: string;
  redirectUrl: string;
  placement: string;
  displayOrder: number | null;
};

export async function readHomeBanners(): Promise<Array<BannerResponse>> {
  const response = await defaultAxios.get('/v1/home/banners/view');

  return response.data.result;
}
