import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { MUTATION_KEY, QUERY_KEY } from '@/shared/constant';
import { AppError } from '@/shared/lib';

import { CATEGORY, ERROR_CODE, ERROR_MESSAGE } from '@/feature/alert/constant';
import { toNotificationItem } from '@/feature/alert/mapper';

import {
  fetchNotificationList,
  fetchNotificationSettings,
  readNotifications,
  updateCommentNotificationSetting,
  updateNotificationSettings,
} from '@/apis';

export function useNotification(category) {
  return useSuspenseQuery({
    queryKey: QUERY_KEY.notifications(category),

    queryFn: () =>
      fetchNotificationList(category === 'ALL' ? undefined : category),

    select: (data) => data.map(toNotificationItem),

    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000,
  });
}

export function useReadNotifications() {
  const queryClient = useQueryClient();

  const cancelAll = (queryKeys) =>
    Promise.all(
      queryKeys.map((qk) =>
        queryClient.cancelQueries({ queryKey: qk, exact: true })
      )
    );

  const backupAll = (queryKeys) =>
    queryKeys.map((qk) => [qk, queryClient.getQueryData(qk)]);

  const restoreAll = (entries) =>
    entries.forEach(([qk, prev]) => queryClient.setQueryData(qk, prev));

  const invalidateAll = (queryKeys) =>
    Promise.all(
      queryKeys.map((qk) =>
        queryClient.invalidateQueries({ queryKey: qk, exact: true })
      )
    );

  const onError = (error, variables, context) => {
    if (context?.previousEntries) restoreAll(context.previousEntries);
  };

  const onSettled = async (data, error, variables, context) => {
    if (context?.previousData) {
      invalidateAll(context.queryKeys);
    }

    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.unreadNotificationCount,
      refetchType: 'inactive',
    });
  };

  const markNotificationAsRead = useMutation({
    mutationKey: MUTATION_KEY.readNotifications,

    mutationFn: (notification) => readNotifications([notification.id]),

    onMutate: async (notification) => {
      const queryKeys = [
        QUERY_KEY.notifications('ALL'),
        QUERY_KEY.notifications(notification.category),
      ];

      await cancelAll(queryKeys);

      const previousEntries = backupAll(queryKeys);

      const optimisticOne = (id) => (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n));

      queryKeys.forEach((qk) =>
        queryClient.setQueryData(qk, optimisticOne(notification.id))
      );

      return { previousEntries, queryKeys };
    },

    onError,

    onSettled,
  });

  const markAllNotificationsAsRead = useMutation({
    mutationKey: MUTATION_KEY.readAllNotifications,

    mutationFn: (category) => {
      const notifications = queryClient.getQueryData(
        QUERY_KEY.notifications(category)
      );
      const ids = notifications.map((notification) => notification.id);
      readNotifications(ids);
    },

    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY.unreadNotificationCount, 0);
    },

    onMutate: async (category) => {
      const queryKeys =
        category === 'ALL'
          ? Object.keys(CATEGORY).map(QUERY_KEY.notifications)
          : ['ALL', category].map(QUERY_KEY.notifications);

      await cancelAll(queryKeys);

      const previousEntries = backupAll(queryKeys);

      const optimisticAll = (old) => old?.map((n) => ({ ...n, isRead: true }));

      queryKeys.forEach((queryKey) =>
        queryClient.setQueryData(queryKey, optimisticAll)
      );

      return { previousEntries, queryKeys };
    },

    onError,

    onSettled,
  });

  return { markNotificationAsRead, markAllNotificationsAsRead };
}

export function useNotificationSettings() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY.notificationSettings,
    queryFn: async () => {
      const data = await fetchNotificationSettings();

      return {
        required: data.isRequiredConsent,
        marketing: data.isMarketingConsent,
        attendance: data.isAttendanceConsent,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useUpdateNotificationSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.updateNotificationSettings,

    mutationFn: async (newSettings) =>
      await updateNotificationSettings({
        isRequiredConsent: newSettings.required,
        isMarketingConsent: newSettings.marketing,
        isAttendanceConsent: newSettings.attendance,
      }),

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.notificationSettings,
      });
    },
  });
}

export function useUpdateCommentNotificationSetting(boardId, postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.updateCommentNotificationSetting,

    mutationFn: async (isCommentAlertConsent) =>
      await updateCommentNotificationSetting({
        boardId,
        postId,
        isCommentAlertConsent,
      }),

    onMutate: (next) => {
      queryClient.cancelQueries({
        queryKey: QUERY_KEY.post(postId),
      });

      const previousData = queryClient.getQueryData(QUERY_KEY.post(postId));

      queryClient.setQueryData(QUERY_KEY.post(postId), (old) => ({
        ...old,
        isCommentAlertConsent: next,
      }));

      return { previousData };
    },

    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY.post(postId), context.previousData);
      }

      const code = error.response?.data?.code;

      const {
        COMMENT_ALERT_NOT_AUTHOR,
        COMMENT_ALERT_POST_NOT_FOUND,
        COMMENT_ALERT_NO_PERMISSION,
      } = ERROR_CODE;

      switch (code) {
        case COMMENT_ALERT_NOT_AUTHOR: {
          throw new AppError(
            COMMENT_ALERT_NOT_AUTHOR,
            ERROR_MESSAGE.COMMENT_ALERT_NOT_AUTHOR
          );
        }

        case COMMENT_ALERT_POST_NOT_FOUND: {
          throw new AppError(
            COMMENT_ALERT_POST_NOT_FOUND,
            ERROR_MESSAGE.COMMENT_ALERT_POST_NOT_FOUND
          );
        }

        case COMMENT_ALERT_NO_PERMISSION: {
          throw new AppError(
            COMMENT_ALERT_NO_PERMISSION,
            ERROR_MESSAGE.COMMENT_ALERT_NO_PERMISSION
          );
        }

        default:
          throw error;
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.post(postId) });
    },
  });
}
