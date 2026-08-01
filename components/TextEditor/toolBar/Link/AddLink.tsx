import { EditorState, RichUtils, Modifier, convertToRaw } from 'draft-js';

export function addLink(
  editorState: EditorState,
  url: string,
  selection: ReturnType<typeof editorState.getSelection>,
): EditorState {
  const contentState = editorState.getCurrentContent();

  const contentWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
    url,
  });
  const entityKey = contentWithEntity.getLastCreatedEntityKey();

  const newContent = Modifier.applyEntity(
    contentWithEntity,
    selection,
    entityKey,
  );

  const newState = EditorState.set(editorState, { currentContent: newContent });

  return EditorState.set(editorState, { currentContent: newContent });
}

export function removeLink(editorState: EditorState): EditorState {
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) return editorState;
  return RichUtils.toggleLink(editorState, selection, null);
}
