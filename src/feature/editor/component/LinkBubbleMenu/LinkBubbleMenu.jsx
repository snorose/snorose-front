import React from 'react';

import styles from './LinkBubbleMenu.module.css';

export default function LinkBubbleMenu({ onKeepText, onConvertIframe }) {
  return (
    <div className={styles.container}>
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
