import { sanitizeHtml } from '@/feature/editor/lib/sanitize';

// 서버에는 본문 형식 필드가 없어 새 에디터로 저장한 글에만 표시를 붙인다.
const HTML_PREFIX = '<!--snorose-event-html:v1-->';

export const serializeEventContent = (html) => HTML_PREFIX + sanitizeHtml(html);

export const eventContentToHtml = (content = '') => {
  if (!content) return '';
  if (content.startsWith(HTML_PREFIX)) {
    return sanitizeHtml(content.slice(HTML_PREFIX.length));
  }

  const paragraph = document.createElement('p');
  paragraph.textContent = content;
  return paragraph.outerHTML.replace(/\r\n|\r|\n/g, '<br>');
};

export const getEventContentText = (content) => {
  const document = new DOMParser().parseFromString(
    sanitizeHtml(content || ''),
    'text/html'
  );
  document.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  document.querySelectorAll('p, li, h1, h2, h3, div').forEach((element) => {
    element.append('\n');
  });
  return document.body.textContent.replace(/\u00a0/g, ' ').trim();
};
