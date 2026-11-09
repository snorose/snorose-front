import { openNotificationUrl } from './openNotificationUrl';

describe('알림 URL 이동', () => {
  const navigate = jest.fn();
  let open;

  beforeEach(() => {
    navigate.mockClear();
    open = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => jest.restoreAllMocks());

  test.each([false, true])('위험한 주소 차단 (isExternal=%s)', (external) => {
    [
      undefined,
      {},
      '',
      '/',
      '//evil.example',
      '/\\evil.example',
      '/\n/evil.example',
      'java\tscript:alert(1)',
      // eslint-disable-next-line no-script-url -- 차단할 악성 입력
      'javascript:alert(1)',
      'data:text/html,test',
      'ftp://evil.example',
      'board/all',
    ].forEach((url) => openNotificationUrl(url, external, navigate));

    expect(navigate).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });

  test('내부 경로의 쿼리와 해시를 유지한다', () => {
    const url = '/board/all/post/123?from=alert#comment';
    openNotificationUrl(` ${url} `, false, navigate);
    expect(navigate).toHaveBeenCalledWith(url);
    expect(open).not.toHaveBeenCalled();
  });

  test.each([
    ['https://example.com/path', false],
    ['http://example.com', false],
    ['mailto:support@example.com', false],
    ['HTTPS://example.com', false],
    ['/event/123', true],
  ])('허용한 새 창 이동: %s', (url, external) => {
    openNotificationUrl(url, external, navigate);
    expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
    expect(navigate).not.toHaveBeenCalled();
  });
});
