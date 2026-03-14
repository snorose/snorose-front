import { CommentInput, CommentListSuspense } from '@/feature/comment/component';

import styles from './CommentInputContainer.module.css';

export default function CommentInputContainer({ isNotice, commentCount }) {
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
