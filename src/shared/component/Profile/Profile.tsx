import { Badge } from '@/shared/component';
import { ROLE } from '@/shared/constant';

import type { Role } from '@/types';

import cloudLogo from '@/assets/images/cloudLogo.svg';

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
  const icon = badge.includes(userRoleId) ? (
    <Badge userRoleId={userRoleId} />
  ) : (
    <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
  );

  return (
    <div className={`${styles.profile} ${styles[size]}`}>
      {icon}
      <p>{nickname}</p>
    </div>
  );
}
