import { useFeatureIsOn } from '@growthbook/growthbook-react';

import {
  CAMPUS_BOARD_KILL_SWITCH,
  CULTURE_BOARD_KILL_SWITCH,
  FEATURE_FLAG,
} from '@/shared/constant';

/**
 * 문화생활 게시판 노출 여부.
 * 게시판 노출을 판단하는 모든 화면은 이 훅을 거치도록 한다.
 */
export function useCultureBoard() {
  const isFeatureOn = useFeatureIsOn(FEATURE_FLAG.cultureBoard);

  return isFeatureOn && !CULTURE_BOARD_KILL_SWITCH;
}

export function useCampusBoard() {
  const isFeatureOn = useFeatureIsOn(FEATURE_FLAG.campusBoard);

  return isFeatureOn && !CAMPUS_BOARD_KILL_SWITCH;
}
