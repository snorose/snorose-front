import { useParams } from 'react-router-dom';

import { EditPostPage } from '@/page/board';
import { EditEventPage } from '@/page/event';
import { EditExamReviewPage } from '@/page/exam';

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
