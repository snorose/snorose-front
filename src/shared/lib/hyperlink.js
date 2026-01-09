const urlRegex = /(https?:\/\/[^\s]+)/g;

export const convertHyperlink = (text) => {
  const convertedText = text.replace(
    urlRegex,
    (url) =>
      `<a href=${url} target='_blank' rel='noopener noreferrer'>${url}</a>`
  );

  return { __html: convertedText };
};

// 텍스트에서 URL을 감지하고 링크로 변환하는 함수
export const renderTextWithLinks = (text) => {
  if (!text) return null;

  // URL 패턴 매칭 (http, https 포함)
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    // URL인 경우 링크로 렌더링
    if (part.match(urlPattern)) {
      return (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          style={{
            color: 'var(--blue-4)',
            textDecoration: 'underline',
            cursor: 'pointer',
            wordBreak: 'break-all',
          }}
        >
          {part}
        </a>
      );
    }
    // 일반 텍스트는 줄바꿈 처리
    return part.split('\n').map((line, lineIndex, array) => (
      <span key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < array.length - 1 && <br />}
      </span>
    ));
  });
};
