import { IMAGE_DOMAINS } from '../constant';

export const isImageUrl = (url) => {
  if (!url) return false;
  if (/\.(jpeg|jpg|gif|png|bmp|webp|svg)(\?.*)?$/i.test(url)) return true;
  return IMAGE_DOMAINS.some((domain) => url.includes(domain));
};
