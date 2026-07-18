export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://new.newwave4.org').replace(/\/$/, '');

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');

  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

/**
 * `path` is locale-agnostic, e.g. '' for home or '/about'.
 * Maps the 'ua' route segment to the 'uk' hreflang code (the actual BCP47 tag for Ukrainian).
 */
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      en: `${SITE_URL}/en${path}`,
      uk: `${SITE_URL}/ua${path}`,
      'x-default': `${SITE_URL}/ua${path}`,
    },
  };
}
