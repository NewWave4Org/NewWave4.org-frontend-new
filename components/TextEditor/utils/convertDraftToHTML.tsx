import { convertFromRaw, EditorState, ContentState } from 'draft-js';
import type { ContentBlock, EntityInstance } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

// Absolute destinations we are willing to emit into an href.
const SAFE_ABSOLUTE_URL = /^(https?:\/\/|mailto:|tel:)/i;

// Any "scheme:" prefix at all. Used to reject everything not on the allowlist
// above -- javascript:, data:, vbscript:, file:, blob: and anything future.
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Resolves a draft-js LINK entity's URL into an href that is safe to render.
 *
 * Draft-js content is authored in the admin panel and rendered on public pages
 * via dangerouslySetInnerHTML, so a `javascript:` URL here becomes stored XSS
 * executing in every visitor's browser. Previously the only thing standing in
 * the way was an accident: a non-https URL got locale-prefixed, which happened
 * to turn `javascript:alert(1)` into the harmless path `/ua/javascript:alert(1)`.
 * That defence evaporated whenever `locale` was undefined -- which it is for two
 * public call sites (HomeSlider, Card). Now the scheme is checked explicitly, so
 * safety no longer depends on locale being passed.
 *
 * @returns the href to use, or null if the URL is not safe to link to
 */
export function resolveSafeHref(
  rawUrl: unknown,
  locale?: string,
): string | null {
  if (typeof rawUrl !== 'string') return null;

  const url = rawUrl.trim();
  if (!url) return null;

  // Strip control characters and whitespace before testing the scheme: browsers
  // ignore them inside a scheme, so `java\tscript:alert(1)` and
  // `java\nscript:alert(1)` both execute while defeating a naive prefix test.
  const forSchemeTest = url.replace(/[\u0000-\u0020]/g, '');

  if (SAFE_ABSOLUTE_URL.test(forSchemeTest)) return url;

  // Not on the allowlist but carries a scheme -- refuse to link it.
  if (HAS_SCHEME.test(forSchemeTest)) return null;

  // In-page anchor.
  if (url.startsWith('#')) return url;

  // Everything else is site-relative. Leading slashes are stripped before
  // re-adding one, which also neutralises protocol-relative `//evil.com` (it
  // becomes the relative path `/<locale>/evil.com` rather than another origin).
  if (locale && (url === `/${locale}` || url.startsWith(`/${locale}/`)))
    return url;

  const path = url.replace(/^\/+/, '');
  return locale ? `/${locale}/${path}` : `/${path}`;
}

/**
 * Конвертирует Draft.js editorState (в raw-формате) в HTML
 * @param rawState - объект editorState из backend'а (RawDraftContentState)
 * @returns HTML-строка
 */
export function convertDraftToHTML(rawState: any, locale?: string): string {
  if (!rawState) return '';

  const options = {
    inlineStyles: {
      HIGHLIGHT: {
        element: 'span',
        style: { backgroundColor: '#F7A5F7' },
      },
      UPPERCASE: {
        element: 'span',
        style: { textTransform: 'uppercase' },
      },
      LOWERCASE: {
        element: 'span',
        style: { textTransform: 'lowercase' },
      },
    },

    blockStyleFn: (block: ContentBlock) => {
      const type = block.getType();
      switch (type) {
        case 'centerAlign':
          return { element: 'p', attributes: { class: 'text-center' } };
        case 'leftAlign':
          return { element: 'p', attributes: { class: 'text-left' } };
        case 'rightAlign':
          return { element: 'p', attributes: { class: 'text-right' } };
        case 'blockQuote':
          return { element: 'blockquote', attributes: { class: 'blockquote' } };
        default:
          return { element: 'p' };
      }
    },

    entityStyleFn: (entity: EntityInstance) => {
      if (entity.getType() === 'LINK') {
        const href = resolveSafeHref(entity.getData()?.url, locale);

        // An unsafe URL yields an <a> with no href: the link text is preserved
        // (losing the author's words would be worse than losing the link) but it
        // is inert and not focusable. Dropping just the attribute keeps whatever
        // styling targets `a` intact.
        return {
          element: 'a',
          attributes: {
            ...(href ? { href } : {}),
            // target: '_blank',
            rel: 'noreferrer',
          },
        };
      }
    },
  };

  try {
    const contentState: ContentState = convertFromRaw(rawState);

    const editorState = EditorState.createWithContent(contentState);

    const html = stateToHTML(editorState.getCurrentContent(), options);

    return html;
  } catch (error) {
    console.error('Ошибка при конвертации Draft.js → HTML:', error);
    return '';
  }
}
