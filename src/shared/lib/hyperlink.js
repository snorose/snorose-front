import React from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const renderTextWithLinks = (text) => {
  if (!text) return null;

  const parts = text.split(URL_REGEX);

  return (
    <>
      {parts.map((part, index) => {
        const isUrl = part.startsWith('http://') || part.startsWith('https://');

        if (isUrl) {
          return (
            <a
              key={`url-${index}`}
              href={part}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: 'var(--blue-3)',
                cursor: 'pointer',
                wordBreak: 'break-all',
              }}
            >
              {part}
            </a>
          );
        }

        return part.split('\n').map((line, lineIndex, array) => (
          <span key={`text-${index}-${lineIndex}`}>
            {line}
            {lineIndex < array.length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
};

export const convertLinks = (html) => {
  // DOM 파서로 HTML 구조를 유지하면서 텍스트 노드만 변환
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const walkTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const urlRegex = /(https?:\/\/[^\s<]+)/g;
      if (urlRegex.test(node.textContent)) {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(
          urlRegex,
          (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        );
        node.parentNode.replaceChild(span, node);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName !== 'A' // 이미 링크인 건 건너뜀
    ) {
      Array.from(node.childNodes).forEach(walkTextNodes);
    }
  };

  Array.from(doc.body.childNodes).forEach(walkTextNodes);
  return doc.body.innerHTML;
};