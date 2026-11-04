import DOMPurify from 'dompurify';

// Keep this wire format in sync with the seller app's src/lib/saleDescription.ts.
// A marker distinguishes new rich text from legacy descriptions containing literal HTML.
const prefix = '<div data-snorose-sale-description="1">';
const suffix = '</div>';

export function isRichSaleDescription(value: string): boolean {
  return value.startsWith(prefix) && value.endsWith(suffix);
}

export function sanitizeSaleDescriptionHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'h2',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'strike',
      'span',
      'ul',
      'ol',
      'li',
      'a',
    ],
    ALLOWED_ATTR: ['href', 'style', 'start'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  });
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  doc.body.querySelectorAll<HTMLElement>('[style]').forEach((element) => {
    const { color, backgroundColor } = element.style;
    element.removeAttribute('style');
    if (color && !/var\(|url\(/i.test(color)) element.style.color = color;
    if (backgroundColor && !/var\(|url\(/i.test(backgroundColor)) {
      element.style.backgroundColor = backgroundColor;
    }
  });
  doc.body.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href') || '';
    if (!/^https?:\/\//i.test(href)) {
      anchor.removeAttribute('href');
    } else {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  });
  return doc.body.innerHTML;
}

export function saleDescriptionToHtml(
  value: string | null | undefined
): string {
  if (!value) return '';
  if (isRichSaleDescription(value)) {
    return sanitizeSaleDescriptionHtml(
      value.slice(prefix.length, -suffix.length)
    );
  }
  const escape = (text: string) =>
    text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  return value
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map((line) => `<p>${escape(line) || '<br>'}</p>`)
    .join('');
}

export function serializeSaleDescription(html: string): string {
  const clean = sanitizeSaleDescriptionHtml(html);
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  return doc.body.textContent?.trim() ? `${prefix}${clean}${suffix}` : '';
}
