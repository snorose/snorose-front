export const EMBED_SOURCES = [
  {
    name: 'youtube',
    sourcePattern:
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
    toEmbedUrl: (_url, match) => `https://www.youtube.com/embed/${match[1]}`,
    embedUrlPattern: /^https?:\/\/(www\.)?youtube\.com\/embed\//,
  },
  {
    name: 'instagram-reel',
    sourcePattern: /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
    toEmbedUrl: (_url, match) =>
      `https://www.instagram.com/reel/${match[1]}/embed/`,
    embedUrlPattern:
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[a-zA-Z0-9_-]+\/embed\/?/,
  },
  {
    name: 'instagram-post',
    sourcePattern: /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
    toEmbedUrl: (_url, match) =>
      `https://www.instagram.com/p/${match[1]}/embed/`,
    embedUrlPattern:
      /^https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+\/embed\/?/,
  },
  {
    name: 'tiktok',
    sourcePattern: /tiktok\.com\/@[^/]+\/video\/(\d+)/,
    toEmbedUrl: (_url, match) => `https://www.tiktok.com/embed/v2/${match[1]}`,
    embedUrlPattern: /^https?:\/\/(www\.)?tiktok\.com\/embed\/v2\/\d+/,
  },
  {
    name: 'twitter',
    sourcePattern: /(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/,
    toEmbedUrl: (_url, match) =>
      `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`,
    embedUrlPattern:
      /^https?:\/\/platform\.twitter\.com\/embed\/Tweet\.html\?id=\d+/,
  },
  {
    name: 'naver-tv',
    sourcePattern: /tv\.naver\.com\/v\/(\d+)/,
    toEmbedUrl: (_url, match) => `https://tv.naver.com/embed/${match[1]}`,
    embedUrlPattern: /^https?:\/\/(www\.)?tv\.naver\.com\/embed\/\d+/,
  },
];
