import { EMBED_SOURCES } from '../constant/embed-sources.js';

export const formatEmbedUrl = (url) => {
  for (const source of EMBED_SOURCES) {
    const match = url.match(source.sourcePattern);
    if (match) {
      return source.toEmbedUrl(url, match);
    }
  }

  return url;
};
