import DOMPurify from 'dompurify';

import { EMBED_SOURCES } from '../constant';

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

export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
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
  });
};
