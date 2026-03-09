import { CommentInput, CommentListSuspense } from '@/feature/comment/component';

import styles from './CommentSection.module.css';

export default function CommentSection({ isNotice, commentCount }) {
  return (
    <>
      {isNotice ? (
        <div className={styles.whiteBox} />
      ) : (
        <>
          <CommentListSuspense commentCount={commentCount} />
          <CommentInput />
        </>
      )}
    </>
  );
}
