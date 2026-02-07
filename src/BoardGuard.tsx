import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import { ConfirmModal, NoticeModal } from '@/shared/component';
import { CONFIRM_MODAL_TEXT, PERMISSION_MATRIX, ROLE } from '@/shared/constant';

type BoardGuardProps =
  | { isAdminOnly: true; action?: never }
  | { isAdminOnly?: false; action: 'read' | 'write' };

const MESSAGE = {
  read: '게시판 접근 권한이 없어요',
  write: '글 작성 권한이 없어요',
};

export default function BoardGuard(props: BoardGuardProps) {
  const navigate = useNavigate();
  const { boardKey } = useParams();
  const { userInfo } = useAuth();

  if (!userInfo) {
    return null;
  }

  if (props.isAdminOnly) {
    if (userInfo.userRoleId !== ROLE.admin) {
      const modalText = {
        title: '리자 전용 공간이에요',
        description: null,
        confirmText: '돌아가기',
      };

      return (
        <NoticeModal modalText={modalText} onConfirm={() => navigate(-1)} />
      );
    }

    return <Outlet />;
  }

  const { action } = props;

  const roles = PERMISSION_MATRIX[action][boardKey] ?? [];
  if (!roles.includes(userInfo?.userRoleId)) {
    const modalText = {
      ...CONFIRM_MODAL_TEXT.ACCESS_DENIED,
      title: MESSAGE[action],
    };

    return (
      <ConfirmModal
        modalText={modalText}
        onConfirm={() => navigate('/verify', { replace: true })}
        onCancel={() => navigate(-1)}
      />
    );
  }

  return <Outlet />;
}
