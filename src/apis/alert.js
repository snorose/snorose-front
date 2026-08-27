import { authAxios } from '@/axios';

export const fetchUnreadAlertCount = async () => {
  const response = await authAxios.get('/v1/alerts/unread/count');
  const data = response?.data ?? {};

  if (data?.isSuccess !== true) {
    throw new Error(data?.message || '미확인 알림 개수 조회 API 연결 실패');
  }

  const count = Number(data?.result ?? 0);
  return Number.isFinite(count) ? count : 0;
};

export async function fetchNotificationList(category) {
  const response = await authAxios.get('/v1/alerts', {
    params: { filter: category },
  });

  const data = response?.data ?? {};

  if (!data?.isSuccess) {
    throw new Error(data?.message || '알림 목록 조회 API 연결 실패');
  }

  return data.result;
}

export async function readNotifications(alertIds) {
  const params = new URLSearchParams();
  alertIds.forEach((id) => params.append('alertIds', String(id)));

  const response = await authAxios.patch('/v1/alerts/is-read', null, {
    params,
  });

  return response.data.result;
}

export async function fetchNotificationSettings() {
  const response = await authAxios.get('/v1/user-agreements');

  return response.data.result;
}

export async function updateNotificationSettings(data) {
  const response = await authAxios.patch('/v1/user-agreements', data);

  return response.data.result;
}

export async function sendFCMToken(token, deviceType = '') {
  const response = await authAxios.post(
    '/v1/alerts/token',
    { fcmToken: token },
    { headers: { 'X-Device-Type': deviceType } }
  );

  return response.data.result;
}

export async function updateCommentNotificationSetting({
  boardId,
  postId,
  isCommentAlertConsent,
}) {
  const response = await authAxios.patch(
    `/v1/boards/${boardId}/posts/${postId}/comment-alert-consent`,
    { isCommentAlertConsent }
  );

  return response.data.result;
}
