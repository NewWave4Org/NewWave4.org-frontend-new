import type { Metadata } from 'next';
import { prefix } from '@/utils/prefix';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://new.newwave4.org').replace(/\/$/, '');
export const DEFAULT_OG_IMAGE = `${prefix}/logo.png`;

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

/**
 * Builds a page's metadata as one complete object, always including the OG image.
 * Next.js metadata resolution replaces (doesn't merge) a parent's `openGraph`/`twitter`
 * object when a page sets its own, so a page-level override that only sets title/description
 * silently drops the site-wide default image — this keeps every page's image explicit
 * instead of relying on inheritance. No `twitter` field: the org has no X/Twitter presence.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
  };
}
