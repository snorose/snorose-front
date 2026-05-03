import DOMPurify from 'dompurify';

import { EMBED_SOURCES } from '../constant';

export const isAllowedEmbedUrl = (url) =>
  typeof url === 'string' &&
  EMBED_SOURCES.some((source) => source.embedUrlPattern.test(url));

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IFRAME') {
    const src = node.getAttribute('src') || '';

    if (!isAllowedEmbedUrl(src)) {
      node.removeAttribute('src');
    }
  }
});

export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'scrolling',
      'src',
      'width',
      'height',
    ],
  });
};
