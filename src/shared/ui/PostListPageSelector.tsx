import { useParams } from 'react-router-dom';

import NavbarLayout from '@/shared/ui/NavbarLayout';

import { ExamReviewListPage } from '@/page/exam';
import { EventListPage } from '@/page/event';
import { NewPostListPage } from '@/page/board';

export default function PostListPageSelector() {
  const { boardKey } = useParams();

  switch (boardKey) {
    case 'exam-review': {
      return (
        <NavbarLayout>
          <ExamReviewListPage />
        </NavbarLayout>
      );
    }
    case 'event': {
      return <EventListPage />;
    }
    default: {
      return <NewPostListPage />;
    }
  }
}
