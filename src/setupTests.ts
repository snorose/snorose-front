import { randomUUID, webcrypto } from 'crypto';

import '@testing-library/jest-dom';

// The current jsdom version does not provide all browser Web Crypto APIs.
// Use Node's real implementation so IDs remain unique in integration tests.
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: webcrypto,
  });
}

if (!globalThis.crypto.randomUUID) {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    configurable: true,
    value: randomUUID,
  });
}
