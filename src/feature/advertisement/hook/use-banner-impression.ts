import { useEffect } from 'react';

export default function useBannerImpression(
  targetRef: React.RefObject<Element | null>,
  onImpression: () => void,
  impressionTime = 3000
) {
  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    let timerId: number | null = null;
    let isIntersecting = false;

    const startTimer = () => {
      if (timerId !== null) return;

      timerId = window.setTimeout(() => {
        timerId = null;

        if (!document.hidden && isIntersecting) {
          onImpression();
        }
      }, impressionTime);
    };

    const clearTimer = () => {
      clearTimeout(timerId);
      timerId = null;
    };

    const updateTimer = () => {
      if (!document.hidden && isIntersecting) {
        startTimer();
      } else {
        clearTimer();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting =
            entry.isIntersecting && //
            entry.intersectionRatio === 1;

          updateTimer();
        });
      },
      {
        threshold: 1,
      }
    );

    observer.observe(target);

    document.addEventListener('visibilitychange', updateTimer);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateTimer);
      clearTimer();
    };
  }, [targetRef, onImpression, impressionTime]);
}
