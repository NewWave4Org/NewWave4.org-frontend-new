'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditorState, RichUtils } from 'draft-js';
import { BLOCK_TOOLS_MAP, INLINE_TOOLS_MAP } from '../config';
import { useEffect, useRef, useState } from 'react';
import AddLink from './Link/AddLink';

type IMethod = 'block' | 'inline';

interface ITool {
  label: string;
  style: string;
  icon?: any;
}

interface IToolbar {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

function Toolbar({ editorState, setEditorState }: IToolbar) {
  const [url, setUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<ReturnType<typeof editorState.getSelection> | null>(null);

  useEffect(() => {
    if (showLinkInput && inputRef.current) {
      // Небольшая задержка чтобы выделение успело сохраниться
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [showLinkInput]);

  const handleAddLink = () => {
    const selection = savedSelection.current;

    if (!selection || selection.isCollapsed() || !url.trim()) {
      alert('Сначала выдели текст и введи ссылку');
      return;
    }

    AddLink(editorState, setEditorState, url, selection);

    // setEditorState(newEditorState);
    savedSelection.current = null;
    setUrl('');
    setShowLinkInput(false);
    savedSelection.current = null;
  };

  const applyStyle = (e: React.MouseEvent, style: string, method: IMethod) => {
    e.preventDefault();

    const newState = method === 'block' ? RichUtils.toggleBlockType(editorState, style) : RichUtils.toggleInlineStyle(editorState, style);
    setEditorState(newState);
  };

  const isActive = (style: string, method: IMethod) => {
    if (method === 'block') {
      const selection = editorState.getSelection();
      const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
      return blockType === style;
    } else {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    }
  };

  const renderButton = (tool: ITool, method: IMethod, idx: number) => {
    return (
      <button
        key={`${tool.label}-${idx}`}
        title={tool.label}
        style={{
          color: isActive(tool.style, method) ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
        }}
        onClick={e => applyStyle(e, tool.style, method)}
        onMouseDown={e => e.preventDefault()}
      >
        {tool.icon ? <FontAwesomeIcon icon={tool.icon} /> : tool.label}
      </button>
    );
  };

  // const handleLinkButtonClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const selection = editorState.getSelection();

  //   if (selection.isCollapsed()) {
  //     alert('Сначала выдели текст');
  //     return;
  //   }

  //   // Сохраняем выделение
  //   savedSelection.current = selection;
  //   setShowLinkInput(true);
  // };

  return (
    <div className="">
      {/* Inline styles */}
      <div>{INLINE_TOOLS_MAP.map((tool, idx) => renderButton(tool, 'inline', idx))}</div>

      {/* Block styles */}
      <div>{BLOCK_TOOLS_MAP.map((tool, idx) => renderButton(tool, 'block', idx))}</div>

      {/* Кнопка для показа инпута ссылки */}
      {/* <button type="button" className="bg-gray-600 text-white px-2 py-1 rounded ml-2" onMouseDown={handleLinkButtonClick}>
        🔗 Link
      </button> */}

      {/* Инпут и кнопка добавления ссылки */}
      {/* {showLinkInput && (
        <div className="inline-flex items-center ml-2">
          <input
            type="text"
            ref={inputRef}
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLink();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowLinkInput(false);
                setUrl('');
                savedSelection.current = null;
              }
            }}
            placeholder="https://..."
            className="border rounded px-2 py-1 w-48"
          />
          <button type="button" className="bg-blue-600 text-white px-2 py-1 rounded ml-2" onClick={handleAddLink}>
            Добавить
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-2 py-1 rounded ml-2"
            onClick={() => {
              setShowLinkInput(false);
              setUrl('');
              savedSelection.current = null;
            }}
          >
            Отмена
          </button>
        </div>
      )} */}
    </div>
  );
}

export default Toolbar;
