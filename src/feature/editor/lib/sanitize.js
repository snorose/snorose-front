import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'IFRAME') {
      const src = node.getAttribute('src') || '';

      const iframeAllowed = /^https?:\/\/((www\.)?youtube\.com\/embed\/|(www\.)?instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/embed\/|(www\.)?tiktok\.com\/embed\/v2\/|platform\.twitter\.com\/embed\/Tweet\.html\?id=|(www\.)?tv\.naver\.com\/embed\/|maps\.google\.com\/maps\?.*output=embed|(www\.)?google\.com\/maps\/embed|(map\.)?naver\.com\/|naver\.me\/|kko\.to\/)/.test(src);
      
      if (!iframeAllowed) {
        node.setAttribute('src', '');
      }
    }
  });

  const result = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height'],
  });

  DOMPurify.removeHooks('afterSanitizeAttributes');

  return result;
};