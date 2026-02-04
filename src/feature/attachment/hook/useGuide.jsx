import { useEffect, useState } from 'react';

export default function useGuide({ guideKey, maxGuideVisitNum }) {
  const GUIDE_KEY = guideKey;
  const GUIDE_VISIT_NUM = Number(localStorage.getItem(GUIDE_KEY) ?? 0) + 1;
  const [isGuideOpened, setIsGuideOpened] = useState(
    GUIDE_VISIT_NUM <= maxGuideVisitNum
  );

  //가이드를 maxGuideVisitNum회번 노출 후 다시는 보지 않기
  useEffect(() => {
    if (isGuideOpened) localStorage.setItem(GUIDE_KEY, GUIDE_VISIT_NUM);
  }, []);

  //가이드 끄기
  const closeGuide = () => {
    setIsGuideOpened(false);
  };

  //가이드 다시는 보지 않기
  const disableGuide = () => {
    localStorage.setItem(GUIDE_KEY, maxGuideVisitNum);
    setIsGuideOpened(false);
  };

  return { isGuideOpened, closeGuide, disableGuide };
}
