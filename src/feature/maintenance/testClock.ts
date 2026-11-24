import { act } from '@testing-library/react';

import { setMaintenanceStatus } from './config';

export const MAINTENANCE_START = new Date('2026-11-14T14:00:00+09:00');
export const MAINTENANCE_END = new Date('2026-11-14T19:00:00+09:00');

// 기존 접근 제어 회귀 테스트에 서버의 점검 시작·종료 응답을 주입합니다.
export function setMaintenanceTestTime(value: Date | number) {
  jest.setSystemTime(value);
  const now = Number(value);
  act(() =>
    setMaintenanceStatus({
      inProgress:
        now >= Number(MAINTENANCE_START) && now <= Number(MAINTENANCE_END),
      title: null,
      noticeMessage: null,
      endAt: null,
      imageUrl: null,
    })
  );
}
