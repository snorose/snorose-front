import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import { USER_STATUS } from '@/shared/constant';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const { status } = useAuth();

  if (status === USER_STATUS.loading) {
    return null;
  }

  if (status === USER_STATUS.isLogout) {
    alert('로그인이 필요합니다.');

    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
