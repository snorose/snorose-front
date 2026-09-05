import { Link } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Icon } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { useAuth, useBoardNavigate } from '@/shared/hook';

import flag from '@/assets/images/flag.svg';

import { getHomeNotice } from '@/apis';

import styles from './HomeCard.module.css';

export default function HomeCard() {
  const { data: notice } = useSuspenseQuery({
    queryKey: [QUERY_KEY.homeNotice],
    queryFn: getHomeNotice,
    staleTime: 1000 * 60 * 5,
  });

  const { status } = useAuth();
  const isLogin = status === 'authenticated';

  return (
    <div className={styles.layout}>
      <NoticeCard to='/board/notice' title={notice.title} />

      {isLogin && <AttendanceCard />}
    </div>
  );
}

/**
 * TODO: 라우트 개선 작업 완료 후 기존 컴포넌트와 교체 예정
 */
export function NewHomeCard() {
  const { toNoticeList } = useBoardNavigate();

  const { data: notice } = useSuspenseQuery({
    queryKey: [QUERY_KEY.homeNotice],
    queryFn: getHomeNotice,
    staleTime: 1000 * 60 * 5,
  });

  const { status } = useAuth();
  const isLogin = status === 'authenticated';

  return (
    <div className={styles.layout}>
      <NoticeCard to={toNoticeList('notice')} title={notice.title} />

      {isLogin && <AttendanceCard />}
    </div>
  );
}

function NoticeCard({ to, title }) {
  return (
    <Link className={styles.notice} to={to}>
      <div className={styles.noticeCard}>
        <div className={styles.noticeText}>
          <div className={styles.noticeHeader}>
            <Icon
              className={styles.noticeImage}
              id='notice-bell-blue'
              width={13}
              height={16}
              aria-hidden='true'
            />
            <span className={styles.noticeLabel}>공지사항</span>
          </div>
          <span className={styles.noticeContent}>{title}</span>
        </div>
        <Icon
          className={styles.noticeArrow}
          id='angle-right'
          width={18}
          height={18}
          fill='var(--grey-4)'
          stroke='var(--grey-4)'
          aria-hidden='true'
        />
      </div>
    </Link>
  );
}

function AttendanceCard() {
  return (
    <Link className={styles.attendance} to='/attendance'>
      <div className={styles.attendanceCard}>
        <div className={styles.attendanceText}>
          <img className={styles.attendanceImage} src={flag} alt='출석체크' />
          <span className={styles.attendanceTitle}>오늘의 출석체크</span>
        </div>
        <Icon
          className={styles.attendanceArrow}
          id='angle-right'
          width={18}
          height={18}
          fill='white'
          stroke='white'
          aria-hidden='true'
        />
      </div>
    </Link>
  );
}
