import { useEffect, useRef, useState } from 'react';

import { NewButton, Icon } from '@/shared/component';

import styles from './TermModal.module.css';

export default function TermModal({ title, required = false, onAgree, onSkip, onClose, children }) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const contentRef = useRef(null);

  const handleScroll = (e) => {
    if (hasScrolledToEnd) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtEnd = scrollTop + clientHeight >= scrollHeight - 5;

    if (isAtEnd) {
      setHasScrolledToEnd(true);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight <= clientHeight) {
        setHasScrolledToEnd(true);
      }
    }
  }, [children]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.appBar}>
        <Icon
          className={styles.closeIcon}
          id='arrow-left'
          width={19}
          height={17}
          onClick={onClose}
        />
      </div>

      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>
          {title}
          {required && <span className={styles.required} />}
        </h1>
      </div>

      <section className={styles.contentWrapper}>
        <article
          className={styles.content}
          ref={contentRef}
          onScroll={handleScroll}
        >
          {children}
        </article>
      </section>

      <div className={styles.footer}>
        {onSkip && (
          <NewButton
            variant='outlined'
            onClick={onSkip}
          >
            다음에
          </NewButton>
        )}
        <NewButton
          disabled={!hasScrolledToEnd}
          onClick={onAgree}
        >
          동의하고 계속하기
        </NewButton>
      </div>
    </div>
  );
}
