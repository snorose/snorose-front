export const preserveEmptyParagraphs = (html) => {
  if (!html) {
    return '';
  }
  return html.replace(/<p><\/p>/g, '<p>\u00A0</p>');
};