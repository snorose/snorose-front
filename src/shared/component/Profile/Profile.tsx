import { IconMultiCloudLogo } from '@snorose/icons';

import { Badge } from '@/shared/component';
import { ROLE } from '@/shared/constant';

import type { Role } from '@/types';

import styles from './Profile.module.css';

interface ProfileProps {
  userRoleId: Role;
  nickname: string;
  size?: 'small' | 'medium';
}

const badge: Role[] = [ROLE.admin, ROLE.official];

export default function Profile({
  userRoleId,
  nickname,
  size = 'medium',
}: ProfileProps) {
  const cloudLogoSize =
    size === 'medium'
      ? { width: 25, height: 16 }
      : { width: 22, height: 14 };

  const icon = badge.includes(userRoleId) ? (
    <Badge userRoleId={userRoleId} width={24} height={24} />
  ) : (
    <IconMultiCloudLogo
      {...cloudLogoSize}
      role='img'
      aria-label='로고'
    />
  );

  return (
    <div className={`${styles.profile} ${styles[size]}`}>
      {icon}
      <p>{nickname}</p>
    </div>
  );
}
