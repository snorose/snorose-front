import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth, useToast } from '@/shared/hook';
import { BackAppBar, FetchLoadingOverlay, Icon } from '@/shared/component';
import { QUERY_KEY, TOAST } from '@/shared/constant';
import { fireConfetti } from '@/feature/attendance/lib/confetti';

import { updatePoint } from '@/apis';

import { SettingItem } from '@/feature/alert/component';
import { Calendar } from '@/feature/attendance/component';
import {
  ATTENDANCE_MESSAGE,
  POINT_CATEGORY_ENUM,
  POINT_SOURCE_ENUM,
} from '@/feature/attendance/constant';

import styles from './AttendancePage.module.css';
import { useLoaderData } from 'react-router-dom';

export default function AttendancePage() {
  const [loading, setLoading] = useState();
  const [attendanceHistoryByMonth, setAttendanceHistoryByMonth] = useState([]);

  const { title, content } =
    attendanceHistoryByMonth?.length > 0
      ? ATTENDANCE_MESSAGE.CONSECUTIVE
      : ATTENDANCE_MESSAGE.FIRST;

  return (
    <div>
      <div className={styles.top}>
        <BackAppBar isDark backgroundColor={'transparent'} notFixed />
        <h2 className={styles.title}>{`매일 출석체크하고 \n 포인트 모아요`}</h2>
        <div className={styles.calendar}>
          <Calendar callback={setAttendanceHistoryByMonth} />
        </div>
        <AttendanceButton setLoading={setLoading} />
      </div>

      <div className={styles.bottom}>
        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <span className={styles.label}>{title}</span>
            <p className={styles.description}>{content}</p>
          </div>
          <Icon id='point-circle' width={32} height={32} />
        </div>

        {/* <div style={{ margin: '0 2rem' }}>
          <AlertSetting />
        </div> */}
      </div>

      {loading && <FetchLoadingOverlay />}
    </div>
  );
}

function AlertSetting() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggle = () => setIsEnabled((prev) => !prev);

  return (
    <SettingItem
      title='알림설정'
      content='매일 출석체크 알림을 보내드릴게요'
      isEnabled={isEnabled}
      onToggle={toggle}
      variant='blue'
    />
  );
}

function AttendanceButton({ setLoading }) {
  const { attendance } = useLoaderData();

  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  const { toast } = useToast();

  const [isAttendance, setIsAttendance] = useState(attendance);
  const [disabled, setDisabled] = useState(false);

  const handleCheckIn = () => {
    setDisabled(true);
    setLoading(true);
    updatePoint({
      userId: userInfo?.userId,
      category: POINT_CATEGORY_ENUM.ATTENDANCE,
      source: POINT_SOURCE_ENUM.ATTENDANCE,
    })
      .then(({ status }) => {
        if (status === 200) {
          const today = new Date();
          queryClient.invalidateQueries([
            QUERY_KEY.attendance,
            today.getFullYear(),
            today.getMonth() + 1,
          ]);

          // 출석체크 - 리뉴얼 1주년(10/12) 기간 동안 특별 메시지 표시 (KST)
          const now = new Date();
          const startDate = new Date('2025-10-12T00:00:00+09:00');
          const endDate = new Date('2025-10-12T23:59:59+09:00');

          const isEventPeriod = now >= startDate && now <= endDate;

          const message = isEventPeriod
            ? '스노로즈 리뉴얼 1주년 기념 5P 제공 🎉'
            : TOAST.ATTENDANCE.attendance;

          // 이벤트 기간 동안만 폭죽 효과 실행
          if (isEventPeriod) {
            try {
              fireConfetti();
            } catch (error) {
              console.warn('폭죽 효과 실행 중 오류:', error);
            }
          }

          toast({ message, variant: 'success' });
        }
        setIsAttendance(true);
      })
      .catch(({ response }) => {
        toast({ message: response.data.message, variant: 'error' });
      })
      .finally(() => {
        setDisabled(false);
        setLoading(false);
      });
  };

  if (isAttendance) {
    return (
      <button className={styles.attendanceButton} disabled>
        오늘 출석을 완료했어요
      </button>
    );
  }

  return (
    <button
      className={styles.attendanceButton}
      disabled={disabled}
      onClick={handleCheckIn}
    >
      출석하고 포인트 받기
    </button>
  );
}
