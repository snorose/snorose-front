export function isUrlValid(url, { open = false } = {}) {
  try {
    const formatted = url.trim().startsWith('http')
      ? url.trim()
      : `https://${url.trim()}`;
    const parsed = new URL(formatted);
    const validUrl = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(parsed.hostname);

    if (validUrl && open) {
      window.open(formatted, '_blank', 'noopener,noreferrer');
    }
    return validUrl;
  } catch {
    return false;
  }
}

export const validateOnSubmit = (data) => {
  const errors = {};

  // 종료일 검증
  if (data.startAt && data.endAt && data.startAt > data.endAt) {
    errors.endAt = '종료일은 시작일보다 빠를 수 없어요';
  }

  // 발표일 검증
  if (
    data.announceAt &&
    ((data.startAt && data.announceAt < data.startAt) ||
      (data.endAt && data.announceAt < data.endAt))
  ) {
    errors.announceAt = '발표일은 종료일 이후로 설정해주세요';
  }

  // 상세설명 검증
  if (data.content.length < 5) {
    errors.content = '상세설명은 5자 이상 적어주세요';
  }

  // 연계링크 검증
  if (!isUrlValid(data.link)) {
    errors.link = '유효한 링크를 넣어주세요';
  }

  return errors;
};

export const validateRequiredFields = (formType, data, errors) => {
  const required =
    formType === 'etc'
      ? ['title', 'host', 'content', 'link']
      : ['title', 'host', 'place', 'content', 'link'];
  const isFilled = required.every((field) => data[field]?.trim());
  const hasErrors = Object.keys(errors).length > 0;

  return isFilled && !hasErrors;
};
