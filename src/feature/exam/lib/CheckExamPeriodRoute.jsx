import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';
import { ROLE } from '@/shared/constant/role';
import { useAuth } from '@/shared/hook';

import { getReviewWritePeriodActive } from '@/apis';

export default function CheckExamPeriodRoute({ children }) {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const { data: isReviewPeriodActive } = useQuery({
    queryKey: [QUERY_KEY.reviewWritePeriodActive],
    queryFn: getReviewWritePeriodActive,
    enabled: !!userInfo && userInfo.userRoleId !== ROLE.admin,
  });

  useEffect(() => {
    if (!userInfo) return;
    if (userInfo.userRoleId === ROLE.admin) {
      return;
    }
    if (isReviewPeriodActive === undefined) return;
    if (isReviewPeriodActive) {
      return;
    }

    alert('시험후기 작성 기간이 아닙니다.');
    navigate('/', { replace: true });
  }, [userInfo, isReviewPeriodActive, navigate]);

  return children;
}
