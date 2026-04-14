// shared/lib/sanitize.js
import DOMPurify from 'dompurify';

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
    ALLOWED_URI_REGEXP:
  /^(https?:\/\/((www\.)?youtube\.com\/embed\/|(www\.)?youtube\.com\/shorts\/|youtu\.be\/|(www\.)?instagram\.com\/(p|reel)\/.*\/embed|(www\.)?tiktok\.com\/embed\/v2\/|platform\.twitter\.com\/embed\/|(www\.)?tv\.naver\.com\/embed\/|maps\.google\.com\/maps|(www\.)?google\.com\/maps\/embed|(map\.)?naver\.com\/|naver\.me\/))/,
  });
}