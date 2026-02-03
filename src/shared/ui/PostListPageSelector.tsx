import { useParams } from 'react-router-dom';

import NavbarLayout from '@/shared/ui/NavbarLayout';

import { ExamReviewListPage } from '@/page/exam';
import { EventListPage } from '@/page/event';
import { PostListPage } from '@/page/board';

export default function PostListPageSelector() {
  const { boardName } = useParams();

  switch (boardName) {
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
      return <PostListPage />;
    }
  }
}
