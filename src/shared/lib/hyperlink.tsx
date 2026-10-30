import { ReactNode } from 'react';

import styles from './hyperlink.module.css';

interface UrlToken {
  type: 'text' | 'url';
  value: string;
}

interface HashtagToken {
  type: 'text' | 'hashtag';
  value: string;
}

export const URL_REGEX = /(https?:\/\/[^\s<]+[^.,:;?!\s<])/g;

export const HASHTAG_REGEX = /#[\p{L}\p{N}_]+/gu;

export const HASHTAG_CLASS = 'post-hashtag';

export const LINK_ATTRS = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const SKIP_TAGS = new Set(['A', 'CODE', 'PRE', 'KBD']);

export const tokenizeByUrl = (text: string): UrlToken[] => {
  const tokens: UrlToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ type: 'url', value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
};

export const renderTextWithLinks = (
  text: string | null | undefined
): ReactNode => {
  if (!text) return null;

  const tokens = tokenizeByUrl(text);

  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'url') {
          return (
            <a
              key={`url-${index}`}
              href={token.value}
              {...LINK_ATTRS}
              className={styles.link}
            >
              {token.value}
            </a>
          );
        }

        return token.value.split('\n').map((line, lineIndex, array) => (
          <span key={`text-${index}-${lineIndex}`}>
            {line}
            {lineIndex < array.length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
};

export const linkifyHtml = (
  html: string | null | undefined
): string | null | undefined => {
  if (typeof window === 'undefined' || !html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const walkTextNodes = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const tokens = tokenizeByUrl(node.textContent);
      if (!tokens.some((t) => t.type === 'url')) return;

      const fragment = doc.createDocumentFragment();
      for (const token of tokens) {
        if (token.type === 'url') {
          const a = doc.createElement('a');
          a.href = token.value;
          for (const [attr, value] of Object.entries(LINK_ATTRS)) {
            a.setAttribute(attr, value);
          }
          a.textContent = token.value;
          fragment.appendChild(a);
        } else {
          fragment.appendChild(doc.createTextNode(token.value));
        }
      }
      node.parentNode.replaceChild(fragment, node);
      return;
    }

    if (
      node.nodeType === Node.ELEMENT_NODE &&
      !SKIP_TAGS.has((node as Element).tagName)
    ) {
      Array.from(node.childNodes).forEach(walkTextNodes);
    }
  };

  Array.from(doc.body.childNodes).forEach(walkTextNodes);
  return doc.body.innerHTML;
};

const tokenizeByHashtag = (text: string): HashtagToken[] => {
  const tokens: HashtagToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(HASHTAG_REGEX)) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ type: 'hashtag', value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
};

export const hashtagifyHtml = (
  html: string | null | undefined
): string | null | undefined => {
  if (typeof window === 'undefined' || !html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const walkTextNodes = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.includes('#')) return;

      const tokens = tokenizeByHashtag(node.textContent);
      if (!tokens.some((t) => t.type === 'hashtag')) return;

      const fragment = doc.createDocumentFragment();
      for (const token of tokens) {
        if (token.type === 'hashtag') {
          const span = doc.createElement('span');
          span.setAttribute('data-hashtag', token.value);
          span.setAttribute('class', HASHTAG_CLASS);
          span.textContent = token.value;
          fragment.appendChild(span);
        } else {
          fragment.appendChild(doc.createTextNode(token.value));
        }
      }
      node.parentNode.replaceChild(fragment, node);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;

    if (element.tagName === 'A') {
      const tokens = tokenizeByHashtag(element.textContent.trim());
      if (tokens.length === 1 && tokens[0].type === 'hashtag') {
        const span = doc.createElement('span');
        span.setAttribute('data-hashtag', tokens[0].value);
        span.setAttribute('class', HASHTAG_CLASS);
        span.textContent = tokens[0].value;
        element.parentNode.replaceChild(span, element);
      }
      return;
    }

    if (!SKIP_TAGS.has(element.tagName)) {
      Array.from(element.childNodes).forEach(walkTextNodes);
    }
  };

  Array.from(doc.body.childNodes).forEach(walkTextNodes);
  return doc.body.innerHTML;
};
