import { useParams } from 'react-router-dom';

import NavbarLayout from '@/shared/ui/NavbarLayout';

import { NewPostListPage } from '@/page/board';
import { EventListPage } from '@/page/event';
import { ExamReviewListPage } from '@/page/exam';

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
