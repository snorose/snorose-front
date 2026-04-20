import React from 'react';

import styles from './LinkBubbleMenu.module.css';

export default function LinkBubbleMenu({
  coords,
  onKeepText,
  onConvertIframe,
}) {
  // 좌표 정보가 없으면 렌더링하지 않음
  if (!coords) return null;

  return (
    <div
      className={styles.container}
      style={{
        top: coords.top,
        left: coords.left,
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
