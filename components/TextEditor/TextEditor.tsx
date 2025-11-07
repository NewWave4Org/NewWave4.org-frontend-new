'use client';

import { ContentBlock, Editor, EditorState } from 'draft-js';
import Toolbar from './toolBar/ToolPanel';
import { useEffect, useRef, useState } from 'react';

import './editor-style.css';

interface TextEditorProps {
  value: EditorState;
  onChange: (state: EditorState) => void;
}

function TextEditor({ value, onChange }: TextEditorProps) {
  const [mounted, setMounted] = useState(false);

  const [editorState, setEditorState] = useState(() => value || EditorState.createEmpty());
  const editor = useRef<Editor | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  const focusEditor = () => {
    if (editor) {
      editor?.current?.focus();
    }
  };

  const handleWrapperClick = (e: React.MouseEvent) => {
    // Не фокусируем редактор если клик был по toolbar или его дочерним элементам
    if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
      return;
    }
    focusEditor();
  };

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    // Вызываем onChange для передачи изменений в Formik
    if (onChange) {
      onChange(newEditorState);
    }
  };

  // FOR INLINE STYLES
  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: '#F7A5F7',
    },
    UPPERCASE: {
      textTransform: 'uppercase' as const,
    },
    LOWERCASE: {
      textTransform: 'lowercase' as const,
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: 'inherit',
      background: '#ffeff0',
      fontStyle: 'italic',
      lineHeight: 1.5,
      padding: '0.3rem 0.5rem',
      borderRadius: ' 0.2rem',
    },
    SUPERSCRIPT: {
      verticalAlign: 'super' as const,
      fontSize: '80%',
    },
    SUBSCRIPT: {
      verticalAlign: 'sub' as const,
      fontSize: '80%',
    },
    UNORDERED_LIST: {},
  };

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case 'blockQuote':
        return 'superFancyBlockquote';
      case 'leftAlign':
        return 'leftAlign';
      case 'rightAlign':
        return 'rightAlign';
      case 'centerAlign':
        return 'centerAlign';
      case 'justifyAlign':
        return 'justifyAlign';
      default:
        return '';
    }
  };

  if (!mounted) return null;

  return (
    <div className="editor-wrapper flex flex-col flex-1" onClick={handleWrapperClick}>
      <div ref={toolbarRef}>
        <Toolbar editorState={editorState} setEditorState={setEditorState} />
      </div>
      <div className="editor-container">
        <Editor
          ref={editor}
          placeholder="Write Here"
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={handleEditorChange}
          // onChange={editorState => {
          //   const contentState = editorState.getCurrentContent();
          //   console.log(convertToRaw(contentState));
          //   setEditorState(editorState);
          // }}
        />
      </div>
    </div>
  );
}

export default TextEditor;
