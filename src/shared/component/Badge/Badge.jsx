import { IconMultiBadgeBlue, IconMultiBadgePink } from '@snorose/icons';

import { ROLE } from '@/shared/constant';

export default function Badge({ userRoleId, className = '' }) {
  if (userRoleId === ROLE.admin) {
    return <IconMultiBadgeBlue aria-label='리자 뱃지' className={className} />;
  }

  if (userRoleId === ROLE.official) {
    return <IconMultiBadgePink aria-label='공식 뱃지' className={className} />;
  }

  return null;
}
