// API 입력은 내부 절대 경로 또는 명시적으로 허용한 외부 프로토콜만 사용한다.
export function openNotificationUrl(url, isExternal, navigate) {
  const nextUrl = typeof url === 'string' ? url.trim() : '';

  if (
    !nextUrl ||
    nextUrl === '/' ||
    // URL 파서가 제거하는 제어 문자와 외부 호스트로 해석될 수 있는 역슬래시를 차단한다.
    // eslint-disable-next-line no-control-regex
    /[\\\u0000-\u001f\u007f]/.test(nextUrl)
  ) {
    return;
  }

  const isInternal = nextUrl.startsWith('/') && !nextUrl.startsWith('//');
  const isAllowedExternal = /^(https?:\/\/|mailto:)/i.test(nextUrl);

  if (!isInternal && !isAllowedExternal) return;

  if (isExternal || isAllowedExternal) {
    window.open(nextUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  navigate(nextUrl);
}
