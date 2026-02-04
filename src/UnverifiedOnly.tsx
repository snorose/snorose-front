import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/shared/hook';
import { NoticeModal } from '@/shared/component';
import { NOTICE_MODAL_TEXT, ROLE } from '@/shared/constant';
import React from 'react';

export default function UnverifiedOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  if (!userInfo) {
    return null;
  }

  if ([ROLE.preUser, ROLE.admin].includes(userInfo?.userRoleId)) {
    return (
      <NoticeModal
        modalText={NOTICE_MODAL_TEXT.ALREADY_VERIFIED}
        onConfirm={() => navigate('/', { replace: true })}
      />
    );
  }

  return children;
}
