import { useNavigate } from 'react-router-dom';

import { NoticeModal } from '@/shared/component';
import {
  CONFIRM_MODAL_TEXT,
  HTTP_STATUS_CODE,
  NOTICE_MODAL_TEXT,
} from '@/shared/constant';
import { isHttpError, isNetworkError } from '@/shared/lib/error-guard';

import { NotFoundPage } from '@/page/etc';

import styles from './GlobalErrorFallback.module.css';

export default function GlobalErrorFallback({ error }) {
  const navigate = useNavigate();

  if (isNetworkError(error)) {
    return (
      <ErrorFallbackView
        title='인터넷 연결이 불안정해요'
        description='네트워크 상태를 확인한 뒤 다시 시도해 주세요.'
        primaryAction={{
          label: '새로고침',
          onClick: () => window.location.reload(),
        }}
        secondaryAction={{
          label: '홈으로 이동',
          onClick: () => navigate('/'),
        }}
      />
    );
  }

  if (isHttpError(error) && error.kind === 'UNEXPECTED_RESPONSE') {
    return (
      <ErrorFallbackView
        title='서비스 연결이 원활하지 않아요'
        description='요청을 처리하는 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.'
        primaryAction={{
          label: '새로고침',
          onClick: () => window.location.reload(),
        }}
        secondaryAction={{
          label: '홈으로 이동',
          onClick: () => navigate('/'),
        }}
      />
    );
  }

  if (isHttpError(error) && error.kind === 'API_RESPONSE') {
    switch (error.status) {
      case HTTP_STATUS_CODE.UNAUTHORIZED:
        return (
          <NoticeModal
            onConfirm={() => navigate('/login')}
            modalText={NOTICE_MODAL_TEXT.LOGIN_REQUIRED}
          />
        );
      case HTTP_STATUS_CODE.FORBIDDEN:
        return (
          <NoticeModal
            onConfirm={() => navigate(-1)}
            modalText={NOTICE_MODAL_TEXT.PERMISSION_DENIED}
          />
        );
      case HTTP_STATUS_CODE.NOT_FOUND:
        return <NotFoundPage />;
      default:
        if (error.status >= 500) {
          return (
            <ErrorFallbackView
              title='서비스 연결이 원활하지 않아요'
              description='요청을 처리하는 중 문제가 발생했어요. 잠시 후 다시 접속해 주세요.'
              primaryAction={{
                label: '새로고침',
                onClick: () => window.location.reload(),
              }}
              secondaryAction={{
                label: '홈으로 이동',
                onClick: () => navigate('/'),
              }}
            />
          );
        }
    }
  }

  return (
    <ErrorFallbackView
      title='예상치 못한 문제가 발생했어요'
      description='페이지를 다시 불러오거나 홈으로 이동해 주세요. 문제가 계속되면 잠시 후 다시 시도해 주세요.'
      primaryAction={{
        label: '새로고침',
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: '홈으로 이동',
        onClick: () => navigate('/'),
      }}
    />
  );
}

function ErrorFallbackView({
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className={styles.fallback} role='alert'>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.actions}>
        {primaryAction && (
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            type='button'
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            type='button'
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
