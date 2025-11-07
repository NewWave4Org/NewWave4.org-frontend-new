'use client';

import { EditorState, RichUtils } from 'draft-js';

function AddLink(editorState, setEditorState, url, selection) {
  if (!selection) return;

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  // создаём новый EditorState с entity
  let newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });

  // восстанавливаем выделение
  newEditorState = EditorState.forceSelection(newEditorState, selection);

  // применяем ссылку к выделенному тексту
  setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
}

export default AddLink;
