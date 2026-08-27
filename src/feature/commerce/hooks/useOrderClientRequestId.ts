import { useCallback, useEffect, useRef } from 'react';

export default function useOrderClientRequestId(resetKey: string) {
  const clientRequestIdRef = useRef<string | null>(null);

  const getClientRequestId = useCallback(() => {
    if (!clientRequestIdRef.current) {
      clientRequestIdRef.current = crypto.randomUUID();
    }

    return clientRequestIdRef.current;
  }, []);

  const resetClientRequestId = useCallback(() => {
    clientRequestIdRef.current = null;
  }, []);

  useEffect(() => {
    resetClientRequestId();
  }, [resetClientRequestId, resetKey]);

  return { getClientRequestId, resetClientRequestId };
}
