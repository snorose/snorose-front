import { useParams } from 'react-router-dom';

import { CheckExamPeriodRoute } from '@/feature/exam/lib';

import { WritePostPage } from '@/page/board';
import { WriteEventPage } from '@/page/event';
import { WriteExamReviewPage } from '@/page/exam';

export default function WritePageSelector() {
  const { boardKey } = useParams();

  switch (boardKey) {
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
