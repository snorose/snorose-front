import { useParams } from 'react-router-dom';

import { EditExamReviewPage } from '@/page/exam';
import { EditEventPage } from '@/page/event';
import { EditPostPage } from '@/page/board';

export default function EditPageSelector() {
  const { boardKey } = useParams();

  switch (boardKey) {
    case 'exam-review': {
      return <EditExamReviewPage />;
    }
    case 'event': {
      return <EditEventPage />;
    }
    default: {
      return <EditPostPage />;
    }
  }
}
