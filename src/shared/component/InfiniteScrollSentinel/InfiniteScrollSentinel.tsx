import { forwardRef } from 'react';

import type { ComponentPropsWithoutRef } from 'react';

import styles from './InfiniteScrollSentinel.module.css';

type InfiniteScrollSentinelProps = ComponentPropsWithoutRef<'div'>;

const InfiniteScrollSentinel = forwardRef<
  HTMLDivElement,
  InfiniteScrollSentinelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      aria-hidden='true'
      className={[styles.sentinel, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

InfiniteScrollSentinel.displayName = 'InfiniteScrollSentinel';

export default InfiniteScrollSentinel;
