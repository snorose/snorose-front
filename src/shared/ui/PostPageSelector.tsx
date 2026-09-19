import { useParams } from 'react-router-dom';

import { PostDetailPage } from '@/page/board';
import { EventPage } from '@/page/event';
import { ExamReviewPage } from '@/page/exam';

export default function PostPageSelector() {
  const { boardKey } = useParams();

  switch (boardKey) {
    case 'exam-review': {
      return <ExamReviewPage />;
    }
    case 'event': {
      return <EventPage />;
    }
    default: {
      return <PostDetailPage />;
    }
  }
}
