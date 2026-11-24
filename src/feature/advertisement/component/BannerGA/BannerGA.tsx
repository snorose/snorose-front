import { useCallback, useRef } from 'react';

import { useBannerImpression } from '@/feature/advertisement/hook';
import { trackBannerImpression } from '@/feature/advertisement/lib';

export default function BannerGA({
  bannerId,
  bannerName,
  placement,
  displayOrder = null,
  impressionTime = 3000,
  children,
}: {
  bannerId: number;
  bannerName: string;
  placement: string;
  displayOrder?: number;
  impressionTime?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleImpression = useCallback(() => {
    trackBannerImpression({
      bannerId,
      bannerName,
      placement,
      position: displayOrder,
    });
  }, [bannerId, bannerName, placement, displayOrder]);

  useBannerImpression(ref, handleImpression, impressionTime);

  return (
    <div
      ref={ref}
      data-ga-banner
      data-banner-id={bannerId}
      data-banner-name={bannerName}
      data-placement={placement}
      data-display-order={displayOrder}
    >
      {children}
    </div>
  );
}
