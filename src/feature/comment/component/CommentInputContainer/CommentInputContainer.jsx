import { CommentInput, CommentListSuspense } from '@/feature/comment/component';

import styles from './CommentInputContainer.module.css';

export default function CommentInputContainer({ isNotice }) {
  return (
    <>
      {isNotice ? (
        <div className={styles.whiteBox} />
      ) : (
        <>
          <CommentListSuspense />
          <CommentInput />
        </>
      )}
    </>
  );
}
