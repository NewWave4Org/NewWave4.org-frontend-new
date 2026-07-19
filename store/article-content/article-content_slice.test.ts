import { describe, expect, it } from 'vitest';
import articleContentReducer, { removeArticle, removeArticleFromArchive } from './article-content_slice';
import { getAllArticle } from './action';
import { ArticleTypeEnum } from '@/utils/ArticleType';

function initialState() {
  return articleContentReducer(undefined, { type: '@@INIT' });
}

describe('article-content_slice', () => {
  describe('getAllArticle.pending', () => {
    it('sets loading only for the requested articleType', () => {
      const state = articleContentReducer(
        initialState(),
        getAllArticle.pending('req-id', { articleType: ArticleTypeEnum.NEWS, page: 0, size: 10 } as never)
      );

      expect(state.byType[ArticleTypeEnum.NEWS].status).toBe('loading');
      expect(state.byType[ArticleTypeEnum.EVENT].status).toBe('idle');
      expect(state.byType[ArticleTypeEnum.PROGRAM].status).toBe('idle');
      expect(state.byType[ArticleTypeEnum.PROJECT].status).toBe('idle');
    });

    // Documents existing behavior (not a fix): a falsy `articleType` in the
    // thunk arg resets loading state for every content type at once, since
    // the reducer's else-branch has no per-type scoping. See docs/known-issues.md.
    it('sets loading for every articleType when articleType is falsy', () => {
      const state = articleContentReducer(
        initialState(),
        getAllArticle.pending('req-id', { page: 0, size: 10 } as never)
      );

      expect(state.byType[ArticleTypeEnum.NEWS].status).toBe('loading');
      expect(state.byType[ArticleTypeEnum.EVENT].status).toBe('loading');
      expect(state.byType[ArticleTypeEnum.PROGRAM].status).toBe('loading');
      expect(state.byType[ArticleTypeEnum.PROJECT].status).toBe('loading');
    });
  });

  describe('getAllArticle.fulfilled', () => {
    it('stores items/totalPages and marks the requested type as loaded', () => {
      const payload = { content: [{ id: 1 }, { id: 2 }], totalPages: 3, articleType: ArticleTypeEnum.PROJECT };
      const state = articleContentReducer(
        initialState(),
        getAllArticle.fulfilled(payload as never, 'req-id', { articleType: ArticleTypeEnum.PROJECT } as never)
      );

      expect(state.byType[ArticleTypeEnum.PROJECT]).toEqual({
        items: payload.content,
        totalPages: 3,
        status: 'loaded',
      });
      expect(state.byType[ArticleTypeEnum.NEWS].status).toBe('idle');
    });
  });

  describe('removeArticle', () => {
    it('removes only the matching id from the given articleType', () => {
      const seeded = articleContentReducer(
        initialState(),
        getAllArticle.fulfilled(
          { content: [{ id: 1 }, { id: 2 }], totalPages: 1, articleType: ArticleTypeEnum.NEWS } as never,
          'req-id',
          { articleType: ArticleTypeEnum.NEWS } as never
        )
      );

      const state = articleContentReducer(seeded, removeArticle({ id: 1, articleType: ArticleTypeEnum.NEWS }));

      expect(state.byType[ArticleTypeEnum.NEWS].items).toEqual([{ id: 2 }]);
    });
  });

  describe('removeArticleFromArchive', () => {
    it('removes the matching id across every articleType', () => {
      let seeded = articleContentReducer(
        initialState(),
        getAllArticle.fulfilled(
          { content: [{ id: 7 }], totalPages: 1, articleType: ArticleTypeEnum.NEWS } as never,
          'req-id',
          { articleType: ArticleTypeEnum.NEWS } as never
        )
      );
      seeded = articleContentReducer(
        seeded,
        getAllArticle.fulfilled(
          { content: [{ id: 7 }], totalPages: 1, articleType: ArticleTypeEnum.EVENT } as never,
          'req-id',
          { articleType: ArticleTypeEnum.EVENT } as never
        )
      );

      const state = articleContentReducer(seeded, removeArticleFromArchive({ id: 7 }));

      expect(state.byType[ArticleTypeEnum.NEWS].items).toEqual([]);
      expect(state.byType[ArticleTypeEnum.EVENT].items).toEqual([]);
    });
  });
});
