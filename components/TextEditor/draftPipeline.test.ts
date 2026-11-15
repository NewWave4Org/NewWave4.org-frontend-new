// Characterization tests for the draft-js stack the admin editor relies on
// (draft-js + immutable + draft-js-export-html). They pin down behaviour that
// an `immutable` upgrade (forced via package.json "overrides", since draft-js
// itself asks for ~3.7.4) could silently change: EditorState creation,
// RichUtils/Modifier edits, raw (de)serialisation, decorators and HTML export.
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { describe, expect, it } from 'vitest';

const raw = (blocks: { key: string; text: string; type?: string }[]) => ({
  blocks: blocks.map(b => ({
    key: b.key,
    text: b.text,
    type: b.type ?? 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  })),
  entityMap: {},
});

const selectAll = (state: EditorState, blockKey: string, length: number) =>
  EditorState.forceSelection(
    state,
    SelectionState.createEmpty(blockKey).merge({
      anchorOffset: 0,
      focusOffset: length,
    }) as SelectionState,
  );

describe('draft-js pipeline', () => {
  it('creates an empty editor with one empty unstyled block', () => {
    const content = EditorState.createEmpty().getCurrentContent();

    expect(content.getBlocksAsArray()).toHaveLength(1);
    expect(content.getFirstBlock().getType()).toBe('unstyled');
    expect(content.hasText()).toBe(false);
  });

  it('round-trips raw content through convertFromRaw/convertToRaw', () => {
    const input = raw([
      { key: 'a', text: 'Hello' },
      { key: 'b', text: 'Item', type: 'unordered-list-item' },
    ]);

    const state = EditorState.createWithContent(convertFromRaw(input));
    const out = convertToRaw(state.getCurrentContent());

    expect(out.blocks.map(b => [b.key, b.text, b.type])).toEqual([
      ['a', 'Hello', 'unstyled'],
      ['b', 'Item', 'unordered-list-item'],
    ]);
  });

  it('applies inline styles and block types via RichUtils', () => {
    let state = EditorState.createWithContent(
      convertFromRaw(raw([{ key: 'a', text: 'Bold heading' }])),
    );
    state = selectAll(state, 'a', 4);
    state = RichUtils.toggleInlineStyle(state, 'BOLD');
    state = RichUtils.toggleBlockType(state, 'header-two');

    const out = convertToRaw(state.getCurrentContent());

    expect(out.blocks[0].type).toBe('header-two');
    expect(out.blocks[0].inlineStyleRanges).toEqual([
      { offset: 0, length: 4, style: 'BOLD' },
    ]);
    expect(stateToHTML(state.getCurrentContent())).toBe(
      '<h2><strong>Bold</strong> heading</h2>',
    );
  });

  it('creates links via entities (Modifier.applyEntity and RichUtils.toggleLink)', () => {
    let state = EditorState.createWithContent(
      convertFromRaw(raw([{ key: 'a', text: 'site and docs' }])),
    );

    let content = state
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', { url: 'https://a.example' });
    const first = content.getLastCreatedEntityKey();
    content = Modifier.applyEntity(
      content,
      SelectionState.createEmpty('a').merge({
        anchorOffset: 0,
        focusOffset: 4,
      }) as SelectionState,
      first,
    );
    state = EditorState.set(state, { currentContent: content });

    content = state
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', { url: 'https://b.example' });
    state = EditorState.set(state, { currentContent: content });
    state = EditorState.forceSelection(
      state,
      SelectionState.createEmpty('a').merge({
        anchorOffset: 9,
        focusOffset: 13,
      }) as SelectionState,
    );
    state = RichUtils.toggleLink(
      state,
      state.getSelection(),
      content.getLastCreatedEntityKey(),
    );

    const out = convertToRaw(state.getCurrentContent());

    expect(Object.values(out.entityMap).map(e => e.data.url)).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
    expect(stateToHTML(state.getCurrentContent())).toBe(
      '<p><a href="https://a.example">site</a> and <a href="https://b.example">docs</a></p>',
    );
  });

  it('finds entity ranges through a CompositeDecorator', () => {
    const found: string[] = [];
    const decorator = new CompositeDecorator([
      {
        strategy: (block: ContentBlock, callback, contentState) =>
          block.findEntityRanges(
            ch =>
              ch.getEntity() !== null &&
              contentState.getEntity(ch.getEntity()).getType() === 'LINK',
            (start, end) => {
              found.push(block.getText().slice(start, end));
              callback(start, end);
            },
          ),
        component: () => null,
      },
    ]);
    const content = convertFromRaw({
      blocks: [
        {
          key: 'a',
          text: 'go here now',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [{ offset: 3, length: 4, key: 0 }],
          data: {},
        },
      ],
      entityMap: { 0: { type: 'LINK', mutability: 'MUTABLE', data: {} } },
    });

    EditorState.createWithContent(content, decorator);

    expect(found).toContain('here');
  });

  it('handles large documents (immutable List/Map at scale)', () => {
    const blocks = Array.from({ length: 3000 }, (_, i) => ({
      key: `k${i}`,
      text: `Paragraph ${i}`,
    }));
    const content = ContentState.createFromBlockArray(
      convertFromRaw(raw(blocks)).getBlocksAsArray(),
    );

    expect(content.getBlockMap().size).toBe(3000);
    expect(content.getBlockForKey('k2999').getText()).toBe('Paragraph 2999');
    expect(convertToRaw(content).blocks[1500].text).toBe('Paragraph 1500');
    expect(stateToHTML(content).split('</p>')).toHaveLength(3001);
  });
});
