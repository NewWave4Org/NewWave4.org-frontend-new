import { prefix } from '@/utils/prefix';

// public/logo.png is a 1125x1122, ~1 MB PNG. It stays as the Open Graph image
// (utils/seo.ts), which only link-preview crawlers fetch. Nothing a visitor's
// browser renders should point at it: use the sized copies below.

/** Header logo, shown at 64 CSS px. 192 px covers 3x displays. */
export const LOGO_SRC = `${prefix}/logo-192.webp`;

/** Stand-in for cards and blocks that have no photo of their own. */
export const LOGO_FALLBACK_SRC = `${prefix}/logo-640.webp`;
