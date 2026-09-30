export const FEATURE_FLAG = Object.freeze({
  pushNotification: 'push-notification',
  cultureBoard: 'culture-board',
});

export type FeatureFlag = (typeof FEATURE_FLAG)[keyof typeof FEATURE_FLAG];
