import { useCallback, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { canLoadPopups, getPopups } from '@/apis/popup';

import { getActivePopups, hidePopups, isPopupHidden } from '../lib/popups';

export default function usePopUp() {
  const [closed, setClosed] = useState(() => isPopupHidden());
  const { data = [] } = useQuery({
    queryKey: ['home', 'popups'],
    queryFn: getPopups,
    enabled: !closed && canLoadPopups(),
    staleTime: 0,
    retry: false,
    // 부가 공지 조회 실패가 홈 화면 전체를 가리지 않도록 한다.
    throwOnError: false,
  });
  const filteredContents = getActivePopups(data);
  const closePopUp = useCallback(({ popupHideDuration } = {}) => {
    hidePopups(popupHideDuration);
    setClosed(true);
  }, []);

  return {
    isPopUpOpened: !closed && filteredContents.length > 0,
    closePopUp,
    filteredContents,
  };
}
