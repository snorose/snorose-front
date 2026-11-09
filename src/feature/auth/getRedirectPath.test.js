import { getRedirectPath } from './getRedirectPath';

describe('로그인 후 이동 경로', () => {
  test.each([
    undefined,
    null,
    {},
    { from: { pathname: 123 } },
    { from: { pathname: 'https://evil.example' } },
    { from: { pathname: '//evil.example' } },
    { from: { pathname: '/\\evil.example' } },
    { from: { pathname: '/\n/evil.example' } },
    { from: { pathname: '/', search: '/evil.example' } },
    { from: { pathname: '/', hash: '/evil.example' } },
    { from: { pathname: '/board', search: '?q=\tbad' } },
    { from: { pathname: '/board', hash: '#\rbad' } },
    { from: { pathname: '/login' } },
    { from: { pathname: '/login/' } },
    { from: { pathname: '/LOGIN' } },
    { from: { pathname: '/login?next=/board' } },
    { from: { pathname: '/login#form' } },
  ])('유효하지 않은 입력은 홈으로 이동한다: %j', (state) => {
    expect(getRedirectPath(state)).toBe('/');
  });

  test('내부 딥링크의 쿼리와 해시를 보존한다', () => {
    expect(
      getRedirectPath({
        from: {
          pathname: '/board/all/post/123',
          search: '?keyword=%EC%88%99%EB%AA%85&next=https://example.com',
          hash: '#comment-456',
        },
      })
    ).toBe(
      '/board/all/post/123?keyword=%EC%88%99%EB%AA%85&next=https://example.com#comment-456'
    );
  });

  test('쿼리와 해시가 없는 내부 경로도 허용한다', () => {
    expect(getRedirectPath({ from: { pathname: '/my-page' } })).toBe(
      '/my-page'
    );
  });
});
