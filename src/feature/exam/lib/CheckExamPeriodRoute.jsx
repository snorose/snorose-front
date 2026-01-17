import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hook';
import { ROLE } from '@/shared/constant/role';

// 시험 후기 작성 기간: 2025년 12월 22일 ~ 2026년 1월 18일
const examStart = new Date(2025, 11, 22, 0, 0, 0);
const examEnd = new Date(2026, 0, 18, 23, 59, 59);

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
