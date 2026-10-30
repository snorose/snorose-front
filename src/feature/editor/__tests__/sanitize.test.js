import { sanitizeHtml, sanitizePostHtml } from '@/feature/editor/lib/sanitize';

// 표시용 속성(data-format·role)을 빼고 구조만 비교한다.
const structureOf = (html) => html.replace(/ (data-format|role)="[^"]*"/g, '');

// 브라우저가 dangerouslySetInnerHTML로 다시 파싱한 결과
const reparse = (html) => {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.innerHTML;
};

const formatsOf = (html) =>
  [...html.matchAll(/data-format="([^"]+)"/g)].map((match) => match[1]);

describe('sanitizePostHtml: 글 보기 번호 목록 표시값', () => {
  it('번호 형식을 상위 목록 기준으로 계산해 data-format으로 붙인다', () => {
    expect(
      formatsOf(
        sanitizePostHtml(
          '<ol type="i"><li><p>a</p><ol><li><p>b</p><ol><li><p>c</p></li></ol></li></ol></li></ol>'
        )
      )
    ).toEqual(['i', '1', 'a']);
  });

  it('하위 목록의 type="1"은 형식 없음으로 보고 깊이 규칙을 따른다', () => {
    expect(
      formatsOf(
        sanitizePostHtml(
          '<ol><li><p>a</p><ol type="1"><li><p>b</p></li></ol></li></ol>'
        )
      )
    ).toEqual(['1', 'a']);
  });

  it('start는 카운터 시작값(--ol-start)으로, role="list"를 붙인다', () => {
    const html = sanitizePostHtml('<ol start="3"><li><p>x</p></li></ol>');
    expect(html).toContain('role="list"');
    expect(html).toContain('--ol-start: 2');
  });

  it('번호 목록이 없으면 저장용 sanitize와 같은 결과', () => {
    const html = '<p>x</p><ul><li>a <b>b</b></li></ul>';
    expect(sanitizePostHtml(html)).toBe(sanitizeHtml(html));
  });

  it('스크립트·이벤트 핸들러는 그대로 제거된다', () => {
    const html = sanitizePostHtml(
      '<ol><li>x<img src="x.png" onerror="alert(1)"><script>alert(1)</script></li></ol>'
    );
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('<script');
  });
});

describe('sanitizePostHtml: <p> 없는 li 내용 묶기', () => {
  it('글자와 인라인 요소(이미지 포함)를 한 <p>로 묶는다', () => {
    expect(
      structureOf(
        sanitizePostHtml(
          '<ol><li>사진: <img src="x.png"> <b>설명</b></li></ol>'
        )
      )
    ).toBe(
      '<ol><li><p>사진: <img src="x.png" referrerpolicy="no-referrer"> <b>설명</b></p></li></ol>'
    );
  });

  it('이미지만 있는 블록, dl·section 같은 블록은 감싸지 않는다', () => {
    expect(
      structureOf(
        sanitizePostHtml('<ol><li><p>a</p><img src="x.png"></li></ol>')
      )
    ).toBe(
      '<ol><li><p>a</p><img src="x.png" referrerpolicy="no-referrer"></li></ol>'
    );
    expect(
      structureOf(
        sanitizePostHtml('<ol><li>텍스트<dl><dt>x</dt></dl></li></ol>')
      )
    ).toBe('<ol><li><p>텍스트</p><dl><dt>x</dt></dl></li></ol>');
    expect(
      structureOf(sanitizePostHtml('<ol><li><section>s</section>t</li></ol>'))
    ).toBe('<ol><li><section>s</section><p>t</p></li></ol>');
  });

  it('블록을 품은 인라인 요소(<span><div>, <a><div>)는 감싸지 않는다', () => {
    expect(
      structureOf(
        sanitizePostHtml('<ol><li><span><div>x</div></span> tail</li></ol>')
      )
    ).toBe('<ol><li><span><div>x</div></span><p> tail</p></li></ol>');
    expect(
      structureOf(
        sanitizePostHtml(
          '<ol><li><a href="https://e.com"><div>x</div></a></li></ol>'
        )
      )
    ).not.toContain('<p>');
  });

  it('source·track·rt처럼 부모의 일부인 자식만 가진 picture·video·ruby는 글자와 한 줄로 묶는다', () => {
    [
      '<ol><li>사진 <picture><source srcset="a.webp"><img src="a.png"></picture> 설명</li></ol>',
      '<ol><li>영상 <video src="a.mp4"><track kind="captions"></video> 설명</li></ol>',
      '<ol><li>한자 <ruby>漢<rt>한</rt></ruby> 설명</li></ol>',
    ].forEach((source) => {
      const html = structureOf(sanitizePostHtml(source));
      // <p>가 하나뿐이고 그 안에 미디어 요소까지 들어 있어야 한 줄이다
      expect(html.match(/<p>/g)).toHaveLength(1);
      expect(html).toMatch(
        /^<ol><li><p>[^<]+<(picture|video|ruby)[\s\S]* 설명<\/p><\/li><\/ol>$/
      );
    });
  });

  it('map·area와 옛 태그(acronym·blink)도 글자와 한 줄로 묶는다', () => {
    [
      '<ol><li>지도 <map name="m"><area shape="rect" coords="0,0,1,1"></map> 설명</li></ol>',
      '<ol><li>약어 <acronym title="x">NASA</acronym> 설명</li></ol>',
      '<ol><li>깜빡 <blink>x</blink> 설명</li></ol>',
    ].forEach((source) => {
      const html = structureOf(sanitizePostHtml(source));
      expect(html.match(/<p>/g)).toHaveLength(1);
      expect(html).toMatch(
        /^<ol><li><p>[^<]+<(map|acronym|blink)[\s\S]* 설명<\/p><\/li><\/ol>$/
      );
    });
  });

  it('감싼 결과는 다시 파싱해도 구조가 같다', () => {
    [
      '<ol><li>사진: <img src="x.png"> <b>설명</b></li></ol>',
      '<ol><li><span><div>x</div></span> tail</li></ol>',
      '<ol><li><a href="https://e.com"><div>x</div></a> t</li></ol>',
      '<ol><li>아이콘 <svg width="1"><circle r="1"></circle></svg> 끝</li></ol>',
      '<ol><li>텍스트<dl><dt>x</dt></dl>꼬리</li></ol>',
      '<ol><li>사진 <picture><source srcset="a.webp"><img src="a.png"></picture> 설명</li></ol>',
      '<ol><li>영상 <video src="a.mp4"><track kind="captions"></video> 설명</li></ol>',
      '<ol><li>한자 <ruby>漢<rt>한</rt></ruby> 설명</li></ol>',
      '<ol><li>지도 <map name="m"><area shape="rect" coords="0,0,1,1"></map> 설명</li></ol>',
      '<ol><li>약어 <acronym title="x">NASA</acronym> 설명</li></ol>',
      '<ol><li>깜빡 <blink>x</blink> 설명</li></ol>',
    ].forEach((source) => {
      const html = sanitizePostHtml(source);
      expect(reparse(html)).toBe(html);
    });
  });

  it('글머리표 목록(ul)은 건드리지 않는다', () => {
    expect(
      sanitizePostHtml('<ol><li><p>x</p></li></ol><ul><li>a <b>b</b></li></ul>')
    ).toContain('<ul><li>a <b>b</b></li></ul>');
  });
});
