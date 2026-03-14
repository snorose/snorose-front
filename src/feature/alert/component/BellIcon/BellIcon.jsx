import { useToast } from '@/shared/hook';
import { Icon } from '@/shared/component';
import { AppError } from '@/shared/lib';

import { useUpdateCommentNotificationSetting } from '@/feature/alert/hook';

import styles from './BellIcon.module.css';

export default function BellIcon({ boardId, postId, isActive }) {
  const { toast } = useToast();

  const updateNotificationSetting = useUpdateCommentNotificationSetting(
    boardId,
    postId
  );

  const updateSetting = async () => {
    const nextStatus = !isActive;

    try {
      await updateNotificationSetting.mutateAsync(nextStatus);

      toast({
        message: nextStatus
          ? '댓글 알림이 설정되었습니다.'
          : '댓글 알림이 해제되었습니다.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof AppError
          ? error.message
          : '잠시 후 다시 시도해주세요.';

      toast({ message: errorMessage, variant: 'error' });
    }
  };

  return (
    <div className={styles.icon} onClick={updateSetting}>
      <Icon
        id={isActive ? 'comment-bell-fill' : 'comment-bell'}
        width={18}
        height={21}
      />
    </div>
  );
}
