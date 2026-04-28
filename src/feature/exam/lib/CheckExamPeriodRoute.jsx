import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLE } from '@/shared/constant/role';
import { useAuth } from '@/shared/hook';

// 시험 후기 작성 기간: 2026년 4월 28일 ~ 2026년 5월 4일
const examStart = new Date(2026, 3, 28, 0, 0, 0);
const examEnd = new Date(2026, 4, 4, 23, 59, 59);

export default function CheckExamPeriodRoute({ children }) {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.userRoleId === ROLE.admin) {
      return;
    }

    const now = new Date();

    if (now >= examStart && now <= examEnd) {
      return;
    }

    alert('시험후기 작성 기간이 아닙니다.');
    navigate('/', { replace: true });
  }, [userInfo]);

  return children;
}
