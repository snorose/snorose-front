import React, { useLayoutEffect, useRef, useState } from 'react';

import styles from './LinkBubbleMenu.module.css';

// 메뉴와 화면 가장자리 사이 최소 여백(px)
const VIEWPORT_MARGIN = 8;

export default function LinkBubbleMenu({
  coords,
  onKeepText,
  onConvertIframe,
}) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({
    top: coords?.top ?? 0,
    left: coords?.left ?? 0,
  });

  // 메뉴 위치 보정
  // - 모바일 키보드 등으로 비주얼 뷰포트가 이동/축소된 만큼 offset 보정 (position: fixed 기준 보정)
  // - 메뉴 실제 너비를 측정해 화면 오른쪽 끝을 넘어가지 않도록 left clamp
  useLayoutEffect(() => {
    if (!coords) return;

    const updatePosition = () => {
      if (!menuRef.current) return;

      const vv = window.visualViewport;
      const offsetTop = vv?.offsetTop ?? 0;
      const offsetLeft = vv?.offsetLeft ?? 0;
      const viewportWidth = vv?.width ?? window.innerWidth;

      const menuWidth = menuRef.current.offsetWidth;
      const minLeft = offsetLeft + VIEWPORT_MARGIN;
      const maxLeft = offsetLeft + viewportWidth - menuWidth - VIEWPORT_MARGIN;

      setPosition({
        top: coords.top + offsetTop,
        left: Math.max(minLeft, Math.min(coords.left + offsetLeft, maxLeft)),
      });
    };

    updatePosition();

    // 키보드가 오르내리거나 화면이 스크롤될 때도 위치를 따라가도록
    const vv = window.visualViewport;
    vv?.addEventListener('resize', updatePosition);
    vv?.addEventListener('scroll', updatePosition);
    return () => {
      vv?.removeEventListener('resize', updatePosition);
      vv?.removeEventListener('scroll', updatePosition);
    };
  }, [coords]);

  // 좌표 정보가 없으면 렌더링하지 않음
  if (!coords) return null;

  return (
    <div
      ref={menuRef}
      className={styles.container}
      style={{
        top: position.top,
        left: position.left,
      }}
      // 메뉴를 클릭해도 에디터의 커서가 깜빡임을 유지하도록 방지
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className={styles.header}>첨부 방식</span>

      <button onClick={onKeepText} className={styles.button}>
        링크
      </button>

      <button onClick={onConvertIframe} className={styles.button}>
        임베드
      </button>
    </div>
  );
}
