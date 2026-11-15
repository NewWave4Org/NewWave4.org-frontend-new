import { describe, expect, it } from 'vitest';
import { markTrailingEmptyParagraphs } from './markTrailingEmptyParagraphs';

describe('markTrailingEmptyParagraphs', () => {
  it('tags every empty paragraph at the end', () => {
    expect(
      markTrailingEmptyParagraphs('<p>Help us</p>\n<p><br></p>\n<p></p>'),
    ).toBe(
      '<p>Help us</p>\n<p class="is-trailing-empty"><br></p>\n<p class="is-trailing-empty"></p>',
    );
  });

  it('leaves empty paragraphs between text alone', () => {
    const html = '<p>One</p><p><br></p><p>Two</p>';
    expect(markTrailingEmptyParagraphs(html)).toBe(html);
  });

  it('leaves a trailing paragraph with text alone', () => {
    const html = '<p>One</p><p>Two<br></p>';
    expect(markTrailingEmptyParagraphs(html)).toBe(html);
  });
});
