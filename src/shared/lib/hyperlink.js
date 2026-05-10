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
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const walkTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const urlRegex = /(https?:\/\/[^\s<]+[^.,:;?!\s<])/g;
      const text = node.textContent;
      if (urlRegex.test(text)) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        urlRegex.lastIndex = 0;
        while ((match = urlRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }
          const url = match[0];
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = url;
          fragment.appendChild(a);
          lastIndex = urlRegex.lastIndex;
        }
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        node.parentNode.replaceChild(fragment, node);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName !== 'A'
    ) {
      Array.from(node.childNodes).forEach(walkTextNodes);
    }
  };

  Array.from(doc.body.childNodes).forEach(walkTextNodes);
  return doc.body.innerHTML;
};