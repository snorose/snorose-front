export function getRedirectPath(state) {
  const from = state?.from;
  const pathname = from?.pathname;

  if (
    typeof pathname !== 'string' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    /[?#]/.test(pathname) ||
    /^\/login\/?$/i.test(pathname)
  ) {
    return '/';
  }

  const search = typeof from.search === 'string' ? from.search : '';
  const hash = typeof from.hash === 'string' ? from.hash : '';

  // 구분자가 없는 값을 이어 붙이면 '/'가 '//외부주소'로 변할 수 있다.
  if ((search && !search.startsWith('?')) || (hash && !hash.startsWith('#'))) {
    return '/';
  }

  const path = `${pathname}${search}${hash}`;

  // URL 파서가 정규화하는 역슬래시와 제어 문자를 허용하지 않는다.
  // eslint-disable-next-line no-control-regex
  if (/[\\\u0000-\u0020\u007f]/.test(path)) return '/';

  return path;
}
