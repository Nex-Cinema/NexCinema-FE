import DOMPurify from 'dompurify';

export const sanitizeRichText = (value = '') => DOMPurify.sanitize(String(value), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
});

export const richTextToPlainText = (value = '') => {
  const container = document.createElement('div');
  container.innerHTML = sanitizeRichText(value);
  return container.textContent?.replace(/\s+/g, ' ').trim() || '';
};
