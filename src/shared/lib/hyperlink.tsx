import { ReactNode } from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const renderTextWithLinks = (
  text: string | null | undefined
): ReactNode => {
  if (!text) return null;

  const parts: string[] = text.split(URL_REGEX);

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
