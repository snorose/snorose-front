import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useOrderClientRequestId from '@/feature/commerce/hooks/useOrderClientRequestId';

const randomUUID = vi.fn();

describe('주문 clientRequestId 생명주기', () => {
  beforeEach(() => {
    randomUUID.mockReset();

    vi.stubGlobal('crypto', { randomUUID });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reset 전에는 같은 clientRequestId를 유지한다', () => {
    randomUUID.mockReturnValue('11111111-1111-4111-8111-111111111111');

    const { result } = renderHook(() => useOrderClientRequestId());

    const firstId = result.current.getClientRequestId();
    const secondId = result.current.getClientRequestId();

    expect(secondId).toBe(firstId);
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });

  it('reset 후에는 새로운 clientRequestId를 생성한다', () => {
    randomUUID
      .mockReturnValueOnce('11111111-1111-4111-8111-111111111111')
      .mockReturnValueOnce('22222222-2222-4222-8222-222222222222');

    const { result } = renderHook(() => useOrderClientRequestId());

    const firstId = result.current.getClientRequestId();

    result.current.resetClientRequestId();

    const secondId = result.current.getClientRequestId();

    expect(secondId).not.toBe(firstId);
    expect(randomUUID).toHaveBeenCalledTimes(2);
  });
});
