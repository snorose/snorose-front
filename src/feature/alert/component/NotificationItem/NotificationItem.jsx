import { Chip } from '@/shared/component';

import style from './NotificationItem.module.css';

export default function NotificationItem({
  title,
  content,
  category,
  createdAt,
  isRead = false,
  url,
  onClick,
}) {
  const isRootUrl = typeof url === 'string' && url.trim() === '/';

  return (
    <div
      className={`${style.container} ${isRead ? style.read : style.unread}`}
      onClick={onClick}
    >
      <div className={style.top}>
        <div>
          <div className={style.title}>{title}</div>
          <Chip name={category} variant='gradient' />
        </div>
        <div className={style.createdAt}>{createdAt}</div>
      </div>

      <div className={style.bottom}>
        <div className={isRootUrl ? style.contentFull : style.content}>
          {content}
        </div>
      </div>
    </div>
  );
}
