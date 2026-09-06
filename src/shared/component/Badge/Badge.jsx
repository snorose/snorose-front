import { ROLE } from '@/shared/constant';

import adminBadge from '@/assets/images/adminBadge.svg';
import officialBadge from '@/assets/images/officialBadge.svg';

export default function Badge({ userRoleId, className = '' }) {
  if (userRoleId === ROLE.admin) {
    return <img src={adminBadge} alt='리자 뱃지' className={className} />;
  }

  if (userRoleId === ROLE.official) {
    return <img src={officialBadge} alt='공식 뱃지' className={className} />;
  }

  return null;
}
