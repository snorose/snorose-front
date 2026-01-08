import { Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  QueryErrorResetBoundary,
  useIsFetching,
  useQueryClient,
} from '@tanstack/react-query';

import {
  AppBar,
  FetchLoading,
  Icon,
  NewButton,
  ServerErrorFallback,
} from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';

import {
  useNotification,
  useReadNotifications,
} from '@/feature/alert/hook/notification';
import { CategoryTab, NotificationItem } from '@/feature/alert/component';
import { CATEGORY } from '@/feature/alert/constant';

import { noAlertIllustration } from '@/assets/illustrations';

import style from './AlertPage.module.css';

export default function AlertPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? 'ALL';

  const updateCategory = (category) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (category === 'ALL') {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }

      return newParams;
    });
  };

  return (
    <div className={style.container}>
      <AppBar title='알림'>
        <Icon
          className={style.settingIcon}
          id='setting'
          width='24'
          height='24'
          onClick={() => navigate('/alert/setting')}
        />
      </AppBar>

      <div className={style.top}>
        <div className={style.notificationBar}>
          <Icon id='notice-bell' width={13} height={16} />
          <p>모든 알림은 14일 후 자동으로 삭제돼요!</p>
        </div>
      </div>

      <div className={style.categoryTabs}>
        {Object.entries(CATEGORY).map(([key, value]) => (
          <CategoryTab
            key={key}
            label={value}
            isSelected={key === activeCategory}
            onClick={() => updateCategory(key)}
          />
        ))}
      </div>

      <AllReadButton activeCategory={activeCategory} />

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ServerErrorFallback reset={resetErrorBoundary} />
            )}
          >
            <Suspense fallback={<FetchLoading />}>
              <NotificationList category={activeCategory} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

function AllReadButton({ activeCategory }) {
  const queryClient = useQueryClient();
  const { markAllNotificationsAsRead } = useReadNotifications();

  const isFetching =
    useIsFetching({
      queryKey: QUERY_KEY.notifications(activeCategory),
      exact: true,
    }) > 0;

  const data = queryClient.getQueryData(
    QUERY_KEY.notifications(activeCategory)
  );

  const noData = data?.length === 0;
  const allRead = data?.every((item) => item.isRead);

  const disabled = isFetching || noData || allRead;

  return (
    <div className={style.readAllButton}>
      <NewButton
        variant='outlined'
        size='small'
        onClick={() => markAllNotificationsAsRead.mutate(activeCategory)}
        disabled={disabled}
      >
        모두읽기
      </NewButton>
    </div>
  );
}

function NotificationList({ category }) {
  const navigate = useNavigate();
  const { data: notifications } = useNotification(category);
  const { markNotificationAsRead } = useReadNotifications();

  const read = async (item) => {
    await markNotificationAsRead.mutate(item);

    const url = typeof item.url === 'string' ? item.url.trim() : '';
    if (!url || url === '/') return;
    navigate(url);
  };

  if (notifications.length === 0) {
    return (
      <div className={style.noAlertContainer}>
        <img
          className={style.noAlertIllustration}
          src={noAlertIllustration}
          alt='새로운 알림이 없어요'
        />
        <div>새로운 알림이 없어요</div>
      </div>
    );
  }

  return (
    <div className={style.notificationList}>
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          {...item}
          category={CATEGORY[item.category]}
          onClick={() => read(item)}
        />
      ))}
    </div>
  );
}
