import { Navigate } from 'react-router-dom';

import { FeaturesReady, useFeatureIsOn } from '@growthbook/growthbook-react';

// 피처 로드 전에는 모든 플래그가 off로 평가되므로, 로드를 기다렸다가 판단한다
const FEATURES_TIMEOUT = 1000;

export default function FeatureGuard({ feature, fallbackTo = '/', children }) {
  return (
    <FeaturesReady timeout={FEATURES_TIMEOUT} fallback={null}>
      <FeatureRoute feature={feature} fallbackTo={fallbackTo}>
        {children}
      </FeatureRoute>
    </FeaturesReady>
  );
}

function FeatureRoute({ feature, fallbackTo, children }) {
  const isFeatureOn = useFeatureIsOn(feature);

  // 미출시 기능의 존재를 드러내지 않도록 모달 없이 이동시킨다
  if (!isFeatureOn) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}
