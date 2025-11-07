import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faChevronDown,
  faChevronUp,
  faHighlighter,
  faItalic,
  faListOl,
  faListUl,
  faQuoteRight,
  faStrikethrough,
  faSubscript,
  faSuperscript,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';

export const enum BlockStyle {
  BLOCKQUOTE = 'blockQuote',
  UNORDERED_LIST = 'unordered-list-item',
  ORDERED_LIST = 'ordered-list-item',
  LEFT = 'leftAlign',
  CENTER = 'centerAlign',
  RIGHT = 'rightAlign',
}

export enum InlineStyle {
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  UNDERLINE = 'UNDERLINE',
  HIGHLIGHT = 'HIGHLIGHT',
  STRIKETHROUGH = 'STRIKETHROUGH',
  SUPERSCRIPT = 'SUPERSCRIPT',
  SUBSCRIPT = 'SUBSCRIPT',
  UPPERCASE = 'UPPERCASE',
  LOWERCASE = 'LOWERCASE',
}

export enum EntityType {
  link = 'LINK',
}

// =====================
//  TOOL CONFIGS
// =====================

export const INLINE_TOOLS_MAP = [
  { label: 'Bold', style: InlineStyle.BOLD, icon: faBold },
  { label: 'Italic', style: InlineStyle.ITALIC, icon: faItalic },
  { label: 'Underline', style: InlineStyle.UNDERLINE, icon: faUnderline },
  { label: 'Highlight', style: InlineStyle.HIGHLIGHT, icon: faHighlighter },
  { label: 'Strike', style: InlineStyle.STRIKETHROUGH, icon: faStrikethrough },
  { label: 'Superscript', style: InlineStyle.SUPERSCRIPT, icon: faSuperscript },
  { label: 'Subscript', style: InlineStyle.SUBSCRIPT, icon: faSubscript },
  { label: 'Uppercase', style: InlineStyle.UPPERCASE, icon: faChevronUp },
  { label: 'Lowercase', style: InlineStyle.LOWERCASE, icon: faChevronDown },
];

export const BLOCK_TOOLS_MAP = [
  { label: 'Blockquote', style: BlockStyle.BLOCKQUOTE, icon: faQuoteRight },
  { label: 'Unordered List', style: BlockStyle.UNORDERED_LIST, icon: faListUl },
  { label: 'Ordered List', style: BlockStyle.ORDERED_LIST, icon: faListOl },
  { label: 'Align Left', style: BlockStyle.LEFT, icon: faAlignLeft },
  { label: 'Align Center', style: BlockStyle.CENTER, icon: faAlignCenter },
  { label: 'Align Right', style: BlockStyle.RIGHT, icon: faAlignRight },
];
