import { Link } from 'react-router-dom';

import { IconChevronRight, IconPointCircle } from '@snorose/icons';

import { Badge } from '@/shared/component';
import { ROLE_NAME } from '@/shared/constant';

import styles from './MyInfo.module.css';

export default function MyInfo({ userInfo }) {
  return (
    <div className={styles.myInfo}>
      <div className={styles.name}>{userInfo?.nickname}</div>
      <div className={styles.studentIdMemberType}>
        <div className={styles.studentId}>
          {userInfo?.studentNumber.slice(0, 2)}학번
        </div>
        <span className={styles.middleDot} aria-hidden='true' />
        <div className={styles.memberType}>
          {ROLE_NAME[userInfo?.userRoleId]}
        </div>
        {<Badge userRoleId={userInfo?.userRoleId} className={styles.badge} />}
      </div>

      <Link to='view-point-list'>
        <div className={styles.pointWrapper}>
          <div className={styles.point}>
            <IconPointCircle width={32} height={32} color='var(--blue-4)' />
            <span>{userInfo?.balance.toLocaleString()}</span>
          </div>
          <div className={styles.pointList}>
            포인트 내역 보기
            <IconChevronRight
              color='var(--blue-4)'
              width={18}
              height={18}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
