import { convertFromRaw, EditorState, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

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

    blockStyleFn: block => {
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

    entityStyleFn: (entity) => {
      if (entity.getType() === 'LINK') {
        const { url } = entity.getData();
        
        const resolvedUrl = () => {
          if (!locale) return url;
          if (url.startsWith('https')) return url;
          if (url.startsWith(`/${locale}`)) return url;
          return `/${locale}/${url.replace(/^\//, '')}`;
        };

        return {
          element: 'a',
          attributes: {
            href: resolvedUrl(),
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
