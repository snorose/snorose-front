import { useParams } from 'react-router-dom';

import { WriteExamReviewPage } from '@/page/exam';
import { WriteEventPage } from '@/page/event';
import { WritePostPage } from '@/page/board';

import { CheckExamPeriodRoute } from '@/feature/exam/lib';

export default function WritePageSelector() {
  const { boardName } = useParams();

  switch (boardName) {
    case 'exam-review': {
      return (
        <CheckExamPeriodRoute>
          <WriteExamReviewPage />
        </CheckExamPeriodRoute>
      );
    }
    case 'event': {
      return <WriteEventPage />;
    }
    default: {
      return <WritePostPage />;
    }
  }
}
