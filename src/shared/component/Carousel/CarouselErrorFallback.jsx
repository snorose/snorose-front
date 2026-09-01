import { ServerErrorFallback } from '@/shared/component';

export default function CarouselErrorFallback({ error, resetErrorBoundary }) {
  return <ServerErrorFallback reset={resetErrorBoundary} />;
}
