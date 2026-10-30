import { useFeatureIsOn } from '@growthbook/growthbook-react';

import { FEATURE_FLAG, NEW_BOARD_KILL_SWITCH } from '@/shared/constant';

/**
 * 신규 게시판 노출 여부.
 * 게시판 노출을 판단하는 모든 화면은 이 훅을 거치도록 한다.
 */
export function useNewBoard() {
  const isFeatureOn = useFeatureIsOn(FEATURE_FLAG.newBoard);

  return isFeatureOn && !NEW_BOARD_KILL_SWITCH;
}
