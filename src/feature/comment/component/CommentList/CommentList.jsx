import { useParams } from 'react-router-dom';

import { FetchLoading } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { useSuspensePagination } from '@/shared/hook';
import { flatPaginationCache } from '@/shared/lib';

import { Comment } from '@/feature/comment/component';
import { filterVisibleComments } from '@/feature/comment/lib';

import { getComments } from '@/apis';

import styles from './CommentList.module.css';

export default function CommentList() {
  const { postId } = useParams();

  const { data, isFetching, ref } = useSuspensePagination({
    queryKey: [QUERY_KEY.comments, postId],
    queryFn: ({ pageParam }) => getComments({ postId, page: pageParam }),
  });

  const commentList = flatPaginationCache(data);
  const visibledCommentList = filterVisibleComments(commentList);

  return (
    <div className={styles.comments}>
      {visibledCommentList.map((comment, index) => (
        <Comment
          ref={index === visibledCommentList.length - 1 ? ref : undefined}
          key={comment.id}
          data={comment}
        />
      ))}
      {isFetching && <FetchLoading />}
    </div>
  );
}
