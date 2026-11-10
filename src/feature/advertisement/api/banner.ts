import { authAxios } from '@/axios';

export type BannerResponse = {
  bannerId: number;
  bannerName: string;
  bannerType: 'ad' | 'general';
  imageUrl: string;
  redirectUrl: string;
  placement: string;
  displayOrder: number | null;
};

export async function readBannerByPage(page: string): Promise<BannerResponse> {
  const response = await authAxios.get('/v1/banners', {
    params: {
      page,
    },
  });

  return response.data.result;
}
