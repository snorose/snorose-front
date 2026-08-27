import { useState } from 'react';

import { NoticeAcceptanceMap, SaleResponse } from '@/feature/commerce/types';

export default function useNoticeAgreement(notices: SaleResponse['notices']) {
  const [noticeAcceptanceMap, setNoticeAcceptanceMap] =
    useState<NoticeAcceptanceMap>(() => createNoticeAcceptanceMap(notices));

  const resetNoticeAcceptanceMap = (newNotices: SaleResponse['notices']) => {
    setNoticeAcceptanceMap(createNoticeAcceptanceMap(newNotices));
  };

  const handleNoticeAcceptance = (noticeId: number, accepted: boolean) => {
    setNoticeAcceptanceMap((prev) => ({
      ...prev,
      [noticeId]: accepted,
    }));
  };

  return {
    noticeAcceptanceMap,
    handleNoticeAcceptance,
    noticeAcceptances: notices.map(({ noticeId, version }) => ({
      noticeId,
      version,
      accepted: noticeAcceptanceMap[noticeId],
    })),
    resetNoticeAcceptanceMap,
  };
}

function createNoticeAcceptanceMap(notices: SaleResponse['notices']) {
  return notices.reduce(
    (acc, notice) => ({ ...acc, [notice.noticeId]: false }),
    {}
  );
}
