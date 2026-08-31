import { useParams } from 'react-router-dom';

import { FetchLoading, InfiniteScrollSentinel } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';

import { Comment } from '@/feature/comment/component';
import { filterVisibleComments } from '@/feature/comment/lib';

import { getComments } from '@/apis';

import styles from './CommentList.module.css';

export default function CommentList() {
  const { postId } = useParams();

  const {
    items: commentList,
    ref,
    isFetchingNextPage,
  } = useSuspenseInfiniteScroll({
    queryKey: [QUERY_KEY.comments, postId],
    queryFn: ({ pageParam }) => getComments({ postId, page: pageParam }),
    getItemKey: (item) => item.id,
  });

  const visibledCommentList = filterVisibleComments(commentList);

  return (
    <div className={styles.comments}>
      {visibledCommentList.map((comment, index) => (
        <Comment key={comment.id} data={comment} />
      ))}

      <InfiniteScrollSentinel ref={ref} />
      {isFetchingNextPage && <FetchLoading />}
    </div>
  );
}
