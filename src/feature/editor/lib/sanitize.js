import DOMPurify from 'dompurify';

import { EMBED_SOURCES } from '../constant';
import { getOrderedListDisplay, resolveOrderedFormat } from './listNode';

export const isAllowedEmbedUrl = (url) =>
  typeof url === 'string' &&
  EMBED_SOURCES.some((source) => source.embedUrlPattern.test(url));

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';

    if (/^https?:\/\//i.test(href)) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }

  if (node.tagName === 'IMG') {
    node.setAttribute('referrerpolicy', 'no-referrer');
  }

  if (node.tagName === 'IFRAME') {
    const src = node.getAttribute('src') || '';

    if (!isAllowedEmbedUrl(src)) {
      node.removeAttribute('src');
    }

    node.setAttribute('scrolling', 'no');
    node.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
  }
});

const SANITIZE_CONFIG = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: [
    'allow',
    'allowfullscreen',
    'frameborder',
    'referrerpolicy',
    'scrolling',
    'src',
    'target',
    'width',
    'height',
  ],
};

export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
};

// li 안에서 <p>로 묶어도 되는 글자 수준(phrasing) 요소
// (HTML 표준 phrasing content + 옛 태그 acronym·big·blink·font·nobr·strike·tt.
// script·template·meta처럼 화면에 그려지지 않는 요소는 묶어도 달라지지 않으므로 넣지 않는다.)
// 여기 없는 요소(p·h1·ol·dl·section 등 블록)와 블록을 품은 인라인 요소는 <p> 안에 넣으면 다시 파싱할 때 구조가 바뀌므로 묶지 않는다.
// 이 조건을 지키면 직렬화 후 다시 파싱해도 같은 구조가 되어 sanitize 이후에 해도 안전하다.
const PHRASING_TAGS = new Set([
  'A',
  'ABBR',
  'ACRONYM',
  'AREA',
  'AUDIO',
  'B',
  'BDI',
  'BDO',
  'BIG',
  'BLINK',
  'BR',
  'BUTTON',
  'CANVAS',
  'CITE',
  'CODE',
  'DATA',
  'DATALIST',
  'DEL',
  'DFN',
  'EM',
  'EMBED',
  'FONT',
  'I',
  'IFRAME',
  'IMG',
  'INPUT',
  'INS',
  'KBD',
  'LABEL',
  'MAP',
  'MARK',
  'MATH',
  'METER',
  'NOBR',
  'OBJECT',
  'OUTPUT',
  'PICTURE',
  'PROGRESS',
  'Q',
  'RUBY',
  'S',
  'SAMP',
  'SELECT',
  'SMALL',
  'SPAN',
  'STRIKE',
  'STRONG',
  'SUB',
  'SUP',
  'SVG',
  'TEXTAREA',
  'TIME',
  'TT',
  'U',
  'VAR',
  'VIDEO',
  'WBR',
]);

// 이미지·영상처럼 그 자체로 한 칸을 차지해도 되는 요소
// 이것들만 있는 묶음은 감싸지 않는다. (에디터가 만든 이미지·임베드 블록은 그대로 둔다.)
const EMBEDDED_TAGS = new Set([
  'AUDIO',
  'CANVAS',
  'EMBED',
  'IFRAME',
  'IMG',
  'OBJECT',
  'PICTURE',
  'SVG',
  'VIDEO',
]);

// 인라인 요소 안에서 그 요소의 일부로만 쓰이는 자식
// (<picture>·<video>·<audio>의 source·track, <ruby>의 rt·rp, <select>의 option, <object>의 param)
// 블록이 아니고 <p> 안에서 다시 파싱해도 <p>를 닫지 않는다.
const PHRASING_PART_TAGS = new Set([
  'OPTGROUP',
  'OPTION',
  'PARAM',
  'RB',
  'RP',
  'RT',
  'RTC',
  'SOURCE',
  'TRACK',
]);

const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

const tagOf = (node) => node.tagName.toUpperCase();

// 인라인 요소라도 안에 블록 요소가 있으면(<span><div>…</div></span>, <a><div>…) <p> 안에 넣었을 때 다시 파싱하면서 <p>가 닫혀 구조가 바뀐다.
// SVG·MathML 안쪽 요소는 HTML 블록이 아니므로 보지 않는다.
const hasBlockDescendant = (element) =>
  Array.from(element.querySelectorAll('*')).some((child) => {
    const tag = tagOf(child);
    return (
      child.namespaceURI === HTML_NAMESPACE &&
      !PHRASING_TAGS.has(tag) &&
      !PHRASING_PART_TAGS.has(tag)
    );
  });

const isPhrasingNode = (node) =>
  node.nodeType === Node.TEXT_NODE ||
  node.nodeType === Node.COMMENT_NODE ||
  (node.nodeType === Node.ELEMENT_NODE &&
    PHRASING_TAGS.has(tagOf(node)) &&
    !hasBlockDescendant(node));

// 글자나 이미지가 아닌 인라인 요소가 있어야 <p>로 묶는다
const needsParagraph = (run) =>
  run.some((node) =>
    node.nodeType === Node.ELEMENT_NODE
      ? !EMBEDDED_TAGS.has(tagOf(node))
      : node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
  );

// 번호 항목은 "번호 칸 | 본문 칸" 그리드로 그려서 li의 자식이 각각 한 칸이 된다.
// <p> 없이 바로 들어간 글자·인라인 요소(붙여넣기·예전 글)가 줄마다 쪼개지지 않도록 연속된 글자·인라인 요소를 <p>로 묶는다.
const wrapLooseListItemContent = (li) => {
  let run = [];

  const flush = (before) => {
    if (needsParagraph(run)) {
      const paragraph = li.ownerDocument.createElement('p');
      li.insertBefore(paragraph, before);
      run.forEach((node) => paragraph.appendChild(node));
    }

    run = [];
  };

  Array.from(li.childNodes).forEach((child) => {
    if (isPhrasingNode(child)) {
      run.push(child);
    } else {
      flush(child);
    }
  });

  flush(null);
};

// 번호는 ::before 카운터로 직접 그리므로(EditorContainer.module.css) 화면에 필요한 값을 붙인다.
// 에디터 데코레이션(ordered-list-extension.js)과 같은 getOrderedListDisplay를 쓴다.
// 구조는 바꾸지 않고 정해진 값의 속성만 붙인다.
const applyOrderedListDisplay = (root) => {
  // querySelectorAll은 문서 순서라 상위 목록의 형식이 항상 먼저 정해진다.
  root.querySelectorAll('ol').forEach((ol) => {
    const parentList = ol.parentElement?.closest('ol');
    const format = resolveOrderedFormat(
      ol.getAttribute('type'),
      parentList?.dataset.format ?? null
    );
    const { attrs, startOffset } = getOrderedListDisplay(
      ol.getAttribute('start'),
      format
    );

    Object.entries(attrs).forEach(([name, value]) => {
      ol.setAttribute(name, value);
    });
    if (startOffset !== null) {
      ol.style.setProperty('--ol-start', String(startOffset));
    }
  });
};

// 글 보기 화면 전용: 번호 목록 표시에 필요한 처리를 더한 sanitize.
// 저장용 sanitizeHtml과 분리해 이 값들이 저장되는 글에 남지 않게 한다.
export const sanitizePostHtml = (html) => {
  if (!/<ol[\s>]/i.test(html)) return sanitizeHtml(html);

  const root = DOMPurify.sanitize(html, {
    ...SANITIZE_CONFIG,
    RETURN_DOM: true,
  });

  root.querySelectorAll('ol > li').forEach(wrapLooseListItemContent);
  applyOrderedListDisplay(root);

  return root.innerHTML;
};
