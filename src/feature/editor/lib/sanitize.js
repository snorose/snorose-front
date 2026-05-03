import DOMPurify from 'dompurify';

const ALLOWED_IFRAME_SOURCES = [
  /^https?:\/\/(www\.)?youtube\.com\/embed\//,
  /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/embed\//,
  /^https?:\/\/(www\.)?tiktok\.com\/embed\/v2\//,
  /^https?:\/\/platform\.twitter\.com\/embed\/Tweet\.html\?id=/,
  /^https?:\/\/(www\.)?tv\.naver\.com\/embed\//,
  /^https?:\/\/maps\.google\.com\/maps\?.*output=embed/,
  /^https?:\/\/(www\.)?google\.com\/maps\/embed/,
  /^https?:\/\/(map\.)?naver\.com\//,
  /^https?:\/\/naver\.me\//,
  /^https?:\/\/kko\.to\//
];

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IFRAME') {
    const src = node.getAttribute('src') || '';

    const isAllowed = ALLOWED_IFRAME_SOURCES.some((pattern) => pattern.test(src));
      if (!isAllowed) {
        node.removeAttribute('src');
      }
  }
})

export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height'],
  });
};