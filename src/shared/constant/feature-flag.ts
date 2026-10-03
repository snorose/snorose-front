export const FEATURE_FLAG = Object.freeze({
  pushNotification: 'push-notification',
  cultureBoard: 'culture-board',
  campusBoard: 'campus-board',
});

export type FeatureFlag = (typeof FEATURE_FLAG)[keyof typeof FEATURE_FLAG];

/**
 * 문화생활, 캠퍼스 게시판 긴급 차단 스위치.
 *
 * true로 바꾸면 GrowthBook 설정과 무관하게 문화생활 게시판이 완전히 숨겨진다.
 * 프로덕션 유출 시 이 값만 true로 변경해 핫픽스를 배포한다.
 * GrowthBook에서 끌 수 있는 상황이라면 배포 없이 그쪽을 먼저 사용할 것.
 */
export const CULTURE_BOARD_KILL_SWITCH = false;
export const CAMPUS_BOARD_KILL_SWITCH = false;
