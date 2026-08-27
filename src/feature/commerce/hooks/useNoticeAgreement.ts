import { useState } from 'react';

import { NoticeAcceptanceMap, SaleResponse } from '@/feature/commerce/types';

export default function useNoticeAgreement(notices: SaleResponse['notices']) {
  const initialMap = notices.reduce(
    (acc, notice) => ({ ...acc, [notice.noticeId]: false }),
    {}
  );

  const [noticeAcceptanceMap, setNoticeAcceptanceMap] =
    useState<NoticeAcceptanceMap>(initialMap);

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
  };
}
