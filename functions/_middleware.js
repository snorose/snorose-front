const DEFAULT_OG = {
  title: '스노로즈',
  description:
    '숙명여대 재학생, 수료생, 졸업생이 함께하는 소통과 정보 공유의 커뮤니티.',
  image: 'https://www.snorose.com/og-image.png',
};

const STATIC_ROUTES = {
  '/': DEFAULT_OG,
  '/home': DEFAULT_OG,
  '/about': {
    ...DEFAULT_OG,
    title: '스노로즈 소개',
    description: '스노로즈를 만든 사람들을 소개합니다.',
  },
  '/login': { ...DEFAULT_OG, title: '로그인 | 스노로즈' },
  '/signup': { ...DEFAULT_OG, title: '회원가입 | 스노로즈' },
  '/board': { ...DEFAULT_OG, title: '게시판 | 스노로즈' },
  '/board/first-snow': { ...DEFAULT_OG, title: '첫눈온방 | 스노로즈' },
  '/board/large-snow': { ...DEFAULT_OG, title: '함박눈방 | 스노로즈' },
  '/board/permanent-snow': { ...DEFAULT_OG, title: '만년설방 | 스노로즈' },
  '/board/besookt': { ...DEFAULT_OG, title: '베숙트 | 스노로즈' },
  '/board/notice': { ...DEFAULT_OG, title: '공지사항 | 스노로즈' },
  '/board/event': { ...DEFAULT_OG, title: '이벤트 | 스노로즈' },
  '/board/exam-review': { ...DEFAULT_OG, title: '시험후기 | 스노로즈' },
  '/board/student-council': { ...DEFAULT_OG, title: '총학생회 | 스노로즈' },
  '/board/graduation-preparation': {
    ...DEFAULT_OG,
    title: '졸업준비위원회 | 스노로즈',
  },
  '/board/finance-audit': { ...DEFAULT_OG, title: '재정감사위원회 | 스노로즈' },
};

function getOGData(pathname) {
  const normalized =
    pathname.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname;

  if (STATIC_ROUTES[normalized]) return STATIC_ROUTES[normalized];

  if (normalized.startsWith('/board/')) {
    const segments = normalized.split('/').filter(Boolean);

    const boardPath = '/' + segments.slice(0, 2).join('/');

    return STATIC_ROUTES[boardPath] ?? STATIC_ROUTES['/board'] ?? DEFAULT_OG;
  }

  return DEFAULT_OG;
}

export async function onRequest(context) {
  const response = await context.next();

  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return response;

    const url = new URL(context.request.url);
    const ogData = getOGData(url.pathname);

    return new HTMLRewriter()
      .on('title', {
        element(el) {
          el.setInnerContent(ogData.title);
        },
      })

      .on('meta[property="og:title"]', {
        element(el) {
          el.setAttribute('content', ogData.title);
        },
      })
      .on('meta[property="og:description"]', {
        element(el) {
          el.setAttribute('content', ogData.description);
        },
      })
      .on('meta[property="og:image"]', {
        element(el) {
          el.setAttribute('content', ogData.image);
        },
      })
      .on('meta[property="og:url"]', {
        element(el) {
          el.setAttribute('content', url.origin + url.pathname);
        },
      })

      .on('meta[name="twitter:card"]', {
        element(el) {
          el.setAttribute('content', 'summary_large_image');
        },
      })
      .on('meta[name="twitter:title"]', {
        element(el) {
          el.setAttribute('content', ogData.title);
        },
      })
      .on('meta[name="twitter:description"]', {
        element(el) {
          el.setAttribute('content', ogData.description);
        },
      })
      .on('meta[name="twitter:image"]', {
        element(el) {
          el.setAttribute('content', ogData.image);
        },
      })

      .transform(response);
  } catch (error) {
    console.error('OG 주입 미들웨어 에러 발생:', error);
    return response;
  }
}
