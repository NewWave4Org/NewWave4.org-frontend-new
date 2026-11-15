// CMS text often ends in empty paragraphs (<p><br></p>). Tag them so the
// phone layout can drop the blank lines they add between join steps (see
// `.join-paths__text` in styles/globals.css); desktop keeps them as before.
const TRAILING_EMPTY_P = /(?:\s*<p>\s*(?:<br\s*\/?>)?\s*<\/p>)+\s*$/;

export function markTrailingEmptyParagraphs(html: string): string {
  return html.replace(TRAILING_EMPTY_P, trailing =>
    trailing.replace(/<p>/g, '<p class="is-trailing-empty">'),
  );
}
