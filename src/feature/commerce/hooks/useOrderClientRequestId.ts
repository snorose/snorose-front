import { useCallback, useRef } from 'react';

export default function useOrderClientRequestId() {
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

  return { getClientRequestId, resetClientRequestId };
}
