import { defaultAxios } from '@/axios';

export function isPopupMockEnabled() {
  return (
    process.env.REACT_APP_POPUP_MOCK === 'true' ||
    (process.env.NODE_ENV !== 'production' &&
      process.env.REACT_APP_POPUP_MOCK !== 'false')
  );
}

export function canLoadPopups() {
  return isPopupMockEnabled() || Boolean(process.env.REACT_APP_POPUP_API_PATH);
}

export async function getPopups() {
  if (isPopupMockEnabled()) {
    const { createMockPopups } = await import('@/feature/home/data/popups');
    return createMockPopups();
  }
  // 일반 사용자에게 관리자 전용 API를 호출하지 않는다. 사용자 조회 경로 확정 후 설정한다.
  const path = process.env.REACT_APP_POPUP_API_PATH;
  if (!path) throw new Error('사용자 팝업 조회 API 경로를 설정해주세요.');
  const { data } = await defaultAxios.get(path);
  if (!data.isSuccess || !Array.isArray(data.result)) {
    throw new Error(data.message || '팝업을 불러오지 못했습니다.');
  }
  return data.result;
}
