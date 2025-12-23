import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllArticle } from './action';
import { ArticleTypeEnum } from '@/utils/ArticleType';

interface IArticleByType {
  items: any[];
  totalPages: number;
  status: 'idle' | 'loading' | 'loaded';
}

interface IArticleContentSlice {
  byType: Record<ArticleTypeEnum, IArticleByType>;
}

const initialState: IArticleContentSlice = {
  byType: {
    [ArticleTypeEnum.NEWS]: { items: [], totalPages: 0, status: 'idle' },
    [ArticleTypeEnum.EVENT]: { items: [], totalPages: 0, status: 'idle' },
    [ArticleTypeEnum.PROGRAM]: { items: [], totalPages: 0, status: 'idle' },
    [ArticleTypeEnum.PROJECT]: { items: [], totalPages: 0, status: 'idle' },
  },
};

const articleContentSlice = createSlice({
  name: 'articleContentSlice',
  initialState,
  reducers: {
    removeArticle(state, action: PayloadAction<{ id: number; articleType: ArticleTypeEnum }>) {
      const { id, articleType } = action.payload;

      state.byType[articleType].items = state.byType[articleType].items.filter(article => article.id !== id);
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllArticle.fulfilled, (state, action) => {
      const type = action.payload.articleType as ArticleTypeEnum | undefined;

      if (type) {
        state.byType[type].items = action.payload.content ?? [];
        state.byType[type].totalPages = action.payload.totalPages;
        state.byType[type].status = 'loaded';
      } else {
        Object.values(state.byType).forEach(t => {
          t.items = action.payload.content ?? [];
          t.totalPages = action.payload.totalPages;
          t.status = 'loaded';
        });
      }
    });

    builder.addCase(getAllArticle.pending, (state, action) => {
      const type = action.meta.arg.articleType as ArticleTypeEnum | undefined;

      if (type) {
        state.byType[type].status = 'loading';
      } else {
        Object.values(state.byType).forEach(t => {
          t.status = 'loading';
        });
      }
    });
  },
});

export const { removeArticle } = articleContentSlice.actions;

export default articleContentSlice.reducer;
