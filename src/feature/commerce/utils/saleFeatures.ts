import type { CreateOrderRequest } from '@/feature/commerce/types';
import { isValidPhoneNumber } from './commerceRules';

export function getCashReceiptRequest(
  enabled: boolean | undefined,
  requested: boolean,
  phoneNumber: string,
  privacyConsent: boolean
): CreateOrderRequest['cashReceiptRequest'] {
  return enabled !== false && requested
    ? { phoneNumber, privacyConsent }
    : null;
}

export function isCashReceiptOrderable(
  enabled: boolean | undefined,
  requested: boolean,
  phoneNumber: string,
  privacyConsent: boolean
) {
  return (
    enabled === false ||
    !requested ||
    (privacyConsent && isValidPhoneNumber(phoneNumber))
  );
}
