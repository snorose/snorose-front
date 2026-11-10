export default function BannerGA({
  bannerId,
  bannerName,
  placement,
  displayOrder = null,
  children,
}: {
  bannerId: number;
  bannerName: string;
  placement: string;
  displayOrder?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      data-ga-banner-click
      data-banner-id={bannerId}
      data-banner-name={bannerName}
      data-placement={placement}
      data-display-order={displayOrder}
    >
      {children}
    </div>
  );
}
