import { useEffect, useRef, useState } from 'react';

import { IconMultiCloudLogo } from '@snorose/icons';

import styles from './PullToRefresh.module.css';

export default function PullToRefresh({ children, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(undefined);
  const containerRef = useRef(null);

  function handleStart(event) {
    const clientY =
      (event.touches && event.touches[0].clientY) || event.clientY;
    setStartY(clientY);
  }

  function handleMove(event) {
    const clientY =
      (event.touches && event.touches[0].clientY) || event.clientY;
    if (startY !== undefined) {
      const pullDistance = clientY - startY;

      // ptrTouchZone 요소가 존재하는지 확인
      const ptrTouchZone = containerRef.current?.querySelector(
        `.${styles.ptrTouchZone}`
      );

      if (ptrTouchZone) {
        const touchZoneRect = ptrTouchZone.getBoundingClientRect();

        // ptrTouchZone 안에서 위로 땡긴 경우
        if (
          pullDistance > 0 &&
          touchZoneRect.top <= clientY &&
          clientY <= touchZoneRect.bottom
        ) {
          ptrTouchZone.style.pointerEvents = 'auto'; // 클릭 이벤트 허용
          if (pullDistance > 80) {
            ptrTouchZone.style.pointerEvents = 'none'; // 클릭 이벤트 차단
            event.preventDefault(); // 스크롤을 막습니다.
            containerRef.current.style.transform = 'translate(0, 3rem)';
            containerRef.current.style.transition = '0.3s';
            setRefreshing(true);
          }
        } else {
        }
      }
    }
  }

  function handleEnd() {
    if (refreshing) {
      const refreshPromise = onRefresh();
      const timeoutId = setTimeout(() => {
        setRefreshing(false);
        if (containerRef.current) {
          containerRef.current.style.transform = 'translate(0,0)';
        }
      }, 3000);

      refreshPromise.finally(() => {
        clearTimeout(timeoutId);
        setRefreshing(false);
        if (containerRef.current) {
          containerRef.current.style.transform = 'translate(0,0)';
        }
      });
    }
    setStartY(undefined);
  }

  useEffect(() => {
    const options = { passive: false };

    document.addEventListener('touchstart', handleStart, options);
    document.addEventListener('touchmove', handleMove, options);
    document.addEventListener('touchend', handleEnd, options);
    document.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove, options);
    document.addEventListener('mouseup', handleEnd);

    return () => {
      document.removeEventListener('touchstart', handleStart, options);
      document.removeEventListener('touchmove', handleMove, options);
      document.removeEventListener('touchend', handleEnd, options);
      document.removeEventListener('mousedown', handleStart);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [refreshing, startY, onRefresh]);

  return (
    <div ref={containerRef} className={styles.ptrContainer}>
      {refreshing ? (
        <div className={styles.refreshBox}>
          <div className={styles.refreshIcon}>
            <IconMultiCloudLogo role='img' aria-label='로고' />
          </div>
        </div>
      ) : (
        <div className={styles.ptrTouchZone} />
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
