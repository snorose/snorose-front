export const formatEmbedUrl = (url) => {
  const patterns = [
    {
      // YouTube 일반 + Shorts
      regex:
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
      format: (match) => `https://www.youtube.com/embed/${match[1]}`,
    },
    {
      // Instagram Reels
      regex: /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      format: (match) => `https://www.instagram.com/reel/${match[1]}/embed/`,
    },
    {
      // Instagram Posts
      regex: /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
      format: (match) => `https://www.instagram.com/p/${match[1]}/embed/`,
    },
    {
      // TikTok
      regex: /tiktok\.com\/@[^/]+\/video\/(\d+)/,
      format: (match) => `https://www.tiktok.com/embed/v2/${match[1]}`,
    },
    {
      // X (Twitter)
      regex: /(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/,
      format: (match) =>
        `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`,
    },
    {
      // 네이버 TV
      regex: /tv\.naver\.com\/v\/(\d+)/,
      format: (match) => `https://tv.naver.com/embed/${match[1]}`,
    },
    {
      // 네이버 지도 (일반 주소 및 단축 URL)
      regex: /(?:map\.naver\.com|naver\.me)\/.+/,
      format: () => url,
    },
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern.regex);
    if (match) {
      return pattern.format(match); // 매칭되면 변환된 URL 반환
    }
  }

  return url; // 매칭되는 포맷이 없으면 원본 URL 그대로 반환
};
