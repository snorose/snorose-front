import {
  eventContentToHtml,
  getEventContentText,
  serializeEventContent,
} from './content';
import { validateOnSubmit, validateRequiredFields } from './Validation';

test('기존 텍스트의 특수문자, 줄바꿈, 빈 줄을 HTML 왕복 변환에서 유지한다', () => {
  const content = '첫 줄 < 3 & 송이\n\n마지막 줄';
  const html = eventContentToHtml(content);
  expect(html).toContain('&lt; 3 &amp; 송이');
  expect(html).toContain('<br><br>');
  expect(getEventContentText(html)).toBe(content);
});

test('서식 HTML을 보존하면서 스크립트와 이벤트 속성을 제거한다', () => {
  const html = eventContentToHtml(
    serializeEventContent(
      '<p><strong>서식 본문</strong><img src="https://example.com/a.png" onerror="alert(1)"></p><script>alert(1)</script>'
    )
  );
  expect(html).toContain('<strong>서식 본문</strong>');
  expect(html).not.toMatch(/onerror|script/);
});

test('HTML처럼 보이는 예전 일반 텍스트도 태그·엔티티·줄바꿈을 보존한다', () => {
  const content = '첫 번째 줄\n<b>참여 안내</b>\n마지막 줄 &copy;';
  const html = eventContentToHtml(content);
  expect(html).toContain('&lt;b&gt;참여 안내&lt;/b&gt;');
  expect(html).toContain('&amp;copy;');
  expect(getEventContentText(html)).toBe(content);
  expect(
    getEventContentText(eventContentToHtml(serializeEventContent(html)))
  ).toBe(content);
});

test('새 에디터의 서식은 저장·조회 후에도 유지한다', () => {
  const html = '<p><strong>서식 본문</strong></p><p>다음 줄</p>';
  expect(eventContentToHtml(serializeEventContent(html))).toBe(html);
  expect(eventContentToHtml('<p>예전 글에 적은 태그</p>')).toContain(
    '&lt;p&gt;'
  );
});

test.each([
  '<p></p>',
  '<p>&nbsp; </p>',
  '<p><img src="https://example.com/a.png"></p>',
])(
  '빈 HTML과 첨부만 있는 본문은 상세 설명 필수 검사를 통과하지 않는다: %s',
  (content) => {
    expect(
      validateRequiredFields(
        'etc',
        { title: '제목', host: '주최사', link: 'https://example.com', content },
        {}
      )
    ).toBe(false);
  }
);

test('최소 5자는 HTML 태그가 아닌 실제 본문을 기준으로 검사한다', () => {
  expect(
    validateOnSubmit({
      content: '<p><strong>짧음</strong></p>',
      link: 'https://example.com',
    })
  ).toHaveProperty('content');
  expect(
    validateOnSubmit({
      content: '<p><strong>충분한 본문</strong></p>',
      link: 'https://example.com',
    })
  ).not.toHaveProperty('content');
});

test.each([undefined, null, '', '   ', 'https://example.com', ' example.com '])(
  '링크는 선택 항목이며 입력한 경우 유효한 주소만 허용한다: %s',
  (link) => {
    const data = {
      title: '제목',
      host: '주최사',
      place: '장소',
      content: '<p>충분한 설명입니다</p>',
      link,
    };
    expect(validateRequiredFields('etc', data, {})).toBe(true);
    expect(validateRequiredFields('movie', data, {})).toBe(true);
    expect(validateOnSubmit(data)).not.toHaveProperty('link');
  }
);

test('선택 링크를 입력했다면 잘못된 주소는 저장할 수 없다', () => {
  expect(
    validateOnSubmit({
      content: '<p>충분한 설명입니다</p>',
      link: '잘못된 링크',
    })
  ).toHaveProperty('link');
});
