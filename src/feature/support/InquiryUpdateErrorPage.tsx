import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import { NoticeModal } from '@/shared/component';
import { NOTICE_MODAL_TEXT } from '@/shared/constant';

export default function InquiryUpdateErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    const errorData = error.data as { code?: number };

    switch (errorData.code) {
      case 2007:
        return (
          <NoticeModal
            modalText={NOTICE_MODAL_TEXT.NOT_POST_AUTHOR}
            onConfirm={() => navigate(-1)}
          />
        );
      case 6102:
        return (
          <NoticeModal
            modalText={NOTICE_MODAL_TEXT.ALREADY_ANSWERED}
            onConfirm={() => navigate(-1)}
          />
        );
      default:
        throw error;
    }
  }

  throw error;
}
