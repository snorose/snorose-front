import createDOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const purifier = createDOMPurify(window);
const markdown = new MarkdownIt({ html: false });

markdown.validateLink = (url) => {
  const normalized = Array.from(url)
    .filter(
      (character) =>
        character.charCodeAt(0) > 31 &&
        character.charCodeAt(0) !== 127 &&
        !/\s/.test(character)
    )
    .join('')
    .toLowerCase();
  if (!normalized || normalized.includes('\\') || normalized.startsWith('//'))
    return false;
  const protocol = normalized.match(/^[a-z][a-z\d+.-]*:/)?.[0];
  return !protocol || ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol);
};
markdown.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
  if (/^https?:\/\//i.test(tokens[index].attrGet('href'))) {
    tokens[index].attrSet('target', '_blank');
    tokens[index].attrSet('rel', 'noopener noreferrer');
  }
  return renderer.renderToken(tokens, index, options);
};

export function renderPopupMarkdown(description) {
  return purifier.sanitize(markdown.render(description ?? ''), {
    ALLOWED_TAGS: ['a', 'br', 'li', 'ol', 'p', 'strong', 'ul'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'start'],
  });
}
