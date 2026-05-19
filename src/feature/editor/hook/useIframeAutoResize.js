import { useEffect } from 'react';

const ALLOWED_ORIGINS = new Set([
  'https://platform.twitter.com',
  'https://www.instagram.com',
  'https://instagram.com',
]);

const parseTwitterHeight = (data) => {
  const candidate = data?.['twttr.embed'] ?? data;
  if (
    candidate?.method !== 'twttr.private.resize' ||
    !Array.isArray(candidate.params)
  ) {
    return null;
  }
  const height = candidate.params[0]?.height;
  return typeof height === 'number' && height > 0 ? height : null;
};

const isValidHeight = (value) =>
  typeof value === 'number' && value > 0 && value < 5000;

const parseInstagramHeight = (data) => {
  if (!data || typeof data !== 'object') return null;

  const candidates = [
    data.details?.height,
    data.height,
    data.params?.[0]?.height,
    data.payload?.height,
  ];

  for (const candidate of candidates) {
    if (isValidHeight(candidate)) return candidate;
  }

  return null;
};

const parseHeight = (data, embedType) => {
  if (embedType === 'twitter') return parseTwitterHeight(data);
  if (embedType?.startsWith('instagram-')) return parseInstagramHeight(data);
  return null;
};

export const useIframeAutoResize = () => {
  useEffect(() => {
    const handler = (event) => {
      if (!ALLOWED_ORIGINS.has(event.origin)) return;

      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== 'object') return;

      const iframes = document.querySelectorAll(
        'iframe[data-embed-type="twitter"], iframe[data-embed-type="instagram-post"], iframe[data-embed-type="instagram-reel"]'
      );

      for (const iframe of iframes) {
        if (iframe.contentWindow !== event.source) continue;

        const embedType = iframe.getAttribute('data-embed-type');
        const height = parseHeight(data, embedType);
        if (height) iframe.style.height = `${height}px`;
        return;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
};
