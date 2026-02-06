import { useParams } from 'react-router-dom';

import { ExamReviewPage } from '@/page/exam';
import { EventPage } from '@/page/event';
import { PostPage } from '@/page/board';

export default function PostPageSelector() {
  const { boardName } = useParams();

  switch (boardName) {
    case 'exam-review': {
      return <ExamReviewPage />;
    }
    case 'event': {
      return <EventPage />;
    }
    default: {
      return <PostPage />;
    }
  }
}
