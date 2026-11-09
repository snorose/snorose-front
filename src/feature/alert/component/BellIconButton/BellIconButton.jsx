import { IconMultiBellBlue, IconMultiBellOff } from '@snorose/icons';

import { useToast } from '@/shared/hook';
import { AppError } from '@/shared/lib';

import { useUpdateCommentNotificationSetting } from '@/feature/alert/hook';

export default function BellIconButton({ boardId, postId, isActive }) {
  const { toast } = useToast();

  const updateNotificationSetting = useUpdateCommentNotificationSetting(
    boardId,
    postId
  );

  const updateSetting = async () => {
    const nextStatus = !isActive;

    try {
      await updateNotificationSetting.mutateAsync(nextStatus);

      toast.info(
        nextStatus
          ? '댓글 알림이 설정되었습니다.'
          : '댓글 알림이 해제되었습니다.'
      );
    } catch (error) {
      const errorMessage =
        error instanceof AppError
          ? error.message
          : '잠시 후 다시 시도해주세요.';

      toast.error(errorMessage);
    }
  };

  if (isActive) {
    return <IconMultiBellBlue onClick={updateSetting} width={24} height={24} />;
  }

  return <IconMultiBellOff onClick={updateSetting} width={24} height={24} />;
}
