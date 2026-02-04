import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import { NoticeModal } from '@/shared/component';
import { USER_STATUS } from '@/shared/constant';

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();

  if (status === USER_STATUS.loading) {
    return null;
  }

  if (status === USER_STATUS.isLogout) {
    const modalText = {
      title: '로그인이 필요해요',
      description: null,
      confirmText: '로그인',
    };

    return (
      <NoticeModal
        modalText={modalText}
        onConfirm={() =>
          navigate('/login', { state: { from: location }, replace: true })
        }
      />
    );
  }

  return children ? children : <Outlet />;
}
