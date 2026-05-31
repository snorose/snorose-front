import { useNavigate } from 'react-router-dom';

import { NoticeModal, ServerErrorFallback } from '@/shared/component';
import { HTTP_STATUS_CODE } from '@/shared/constant';
import { HttpError } from '@/shared/lib/HttpError';
import { NetworkError } from '@/shared/lib/NetworkError';

export default function GlobalErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  if (error instanceof NetworkError) {
    return <>인터넷 연결이 불안정해요</>;
  }

  if (error instanceof HttpError && error.kind === 'UNEXPECTED_RESPONSE') {
    return <>서비스 연결이 원활하지 않아요</>;
  }

  if (error instanceof HttpError && error.kind === 'API_CONTRACT') {
    switch (error.status) {
      case HTTP_STATUS_CODE.UNAUTHORIZED:
        return (
          <NoticeModal
            onConfirm={() => navigate('/login')}
            modalText={{
              title: '권한 없음',
              description: '로그인 후 이용해주세요.',
            }}
          />
        );
      case HTTP_STATUS_CODE.FORBIDDEN:
        return (
          <NoticeModal
            onConfirm={() => navigate(-1)}
            modalText={{
              title: '접근할 수 없는 화면이에요',
              description: '해당 페이지에 대한 접근 권한이 없습니다.',
            }}
          />
        );
      case HTTP_STATUS_CODE.NOT_FOUND:
        return (
          <div>
            <div>화면을 찾을 수 없어요</div>
            <button onClick={() => navigate('/')}>홈으로 이동</button>
          </div>
        );
      default:
        return <ServerErrorFallback reset={resetErrorBoundary} />;
    }
  }

  return (
    <>
      <div>
        예상치 못한 문제가 발생했어요 페이지를 새로고침하거나 잠시 후 다시
        시도해 주세요.
      </div>
      <button onClick={resetErrorBoundary}>새로고침</button>
      <button onClick={() => navigate('/')}>홈으로</button>
    </>
  );
}
