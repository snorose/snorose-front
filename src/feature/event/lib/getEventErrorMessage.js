const readMessage = (value) => (typeof value === 'string' ? value.trim() : '');

export const getEventErrorMessage = (error, fallbackMessage) => {
  const data = error?.response?.data;
  const serverMessage =
    readMessage(data?.message) ||
    readMessage(data?.detail) ||
    readMessage(data?.error) ||
    readMessage(data);

  if (serverMessage) return serverMessage;

  if (
    data &&
    typeof data === 'object' &&
    Object.values(data).some(
      (value) => value != null && (typeof value !== 'string' || value.trim())
    )
  ) {
    try {
      const details = JSON.stringify(data);
      if (details) return details;
    } catch {
      // 직렬화할 수 없는 응답은 아래의 오류 메시지나 기본 안내로 표시한다.
    }
  }

  return readMessage(error?.message) || readMessage(error) || fallbackMessage;
};
