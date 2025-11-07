import { convertFromRaw, EditorState, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

/**
 * Конвертирует Draft.js editorState (в raw-формате) в HTML
 * @param rawState - объект editorState из backend'а (RawDraftContentState)
 * @returns HTML-строка
 */
export function convertDraftToHTML(rawState: any): string {
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
      CODEBLOCK: {
        element: 'code',
        style: {
          fontFamily: '"fira-code", monospace',
          backgroundColor: '#ffeff0',
          padding: '2px 4px',
          borderRadius: '3px',
        },
      },
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
