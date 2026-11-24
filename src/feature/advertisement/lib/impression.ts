type BannerImpressionParams = {
  bannerId: number;
  bannerName: string;
  placement: string;
  position: number | null;
};

export function trackBannerImpression({
  bannerId,
  bannerName,
  placement,
  position,
}: BannerImpressionParams) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'banner_impression',
    banner_id: bannerId,
    banner_name: bannerName,
    placement,
    position,
  });
}
