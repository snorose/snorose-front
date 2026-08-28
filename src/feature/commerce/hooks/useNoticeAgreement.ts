import { useState } from 'react';

import { NoticeAcceptanceMap, SaleResponse } from '@/feature/commerce/types';

export default function useNoticeAgreement(notices: SaleResponse['notices']) {
  const [noticeAcceptanceMap, setNoticeAcceptanceMap] =
    useState<NoticeAcceptanceMap>(() => createNoticeAcceptanceMap(notices));

  const handleNoticeAcceptance = (noticeText: string, accepted: boolean) => {
    setNoticeAcceptanceMap((prev) => ({
      ...prev,
      [noticeText]: accepted,
    }));
  };

  return {
    noticeAcceptanceMap,
    handleNoticeAcceptance,
    noticeAcceptances: notices.map(({ type, text }) => ({
      type,
      text,
      accepted: noticeAcceptanceMap[text],
    })),
  };
}

function createNoticeAcceptanceMap(notices: SaleResponse['notices']) {
  return notices.reduce(
    (acc, notice) => ({ ...acc, [notice.text]: false }),
    {}
  );
}
