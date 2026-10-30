import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollRestoration(scrollContainerRef) {
  const { key } = useLocation();
  const scrollMapRef = useRef({});

  const saveScrollPosition = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollMapRef.current[key] = scrollContainer.scrollTop;
  };

  const restoreScrollPosition = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const saved = scrollMapRef.current[key];
    scrollContainer.scrollTop = saved === undefined ? 0 : saved;
  };

  useLayoutEffect(() => {
    restoreScrollPosition();
  }, [key]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', saveScrollPosition, {
      passive: true,
    });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', saveScrollPosition);
      }
    };
  }, [key]);
}
