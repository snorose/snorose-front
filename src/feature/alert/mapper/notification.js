import { DateTime } from '@/shared/lib';

import { CATEGORY } from '@/feature/alert/constant';

export function toNotificationItem({
  id,
  title,
  body,
  isRead,
  createdAt,
  url,
  isExternal = false,
  filter,
}) {
  const normalizedCategory =
    typeof filter === 'string' ? filter.toUpperCase() : 'ETC';

  return {
    id,
    title,
    content: body,
    isRead: Boolean(isRead),
    createdAt: DateTime.format(createdAt, 'MD_HM'),
    url: typeof url === 'string' ? url.trim() : '',
    isExternal: Boolean(isExternal),
    category: normalizedCategory,
    categoryLabel: CATEGORY[normalizedCategory] || '기타',
  };
}
