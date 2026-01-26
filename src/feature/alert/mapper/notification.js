import { DateTime } from '@/shared/lib';

export function toNotificationItem({
  id,
  title,
  body,
  isRead,
  createdAt,
  url,
  filter,
}) {
  return {
    id,
    title,
    content: body,
    isRead,
    createdAt: DateTime.format(createdAt, 'MD_HM'),
    url,
    category: filter,
  };
}
