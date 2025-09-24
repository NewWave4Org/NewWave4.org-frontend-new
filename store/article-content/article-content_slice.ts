import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllArticle } from './action';
import { IGetAllArticleResponseDTO } from '@/utils/article-content/type/interfaces';

interface IArticleContentSlice {
  articleContent: any[];
  totalPages: number;
}

const initialState: IArticleContentSlice = {
  articleContent: [],
  totalPages: 0,
};

const articleContentSlice = createSlice({
  name: 'articleContentSlice',
  initialState,
  reducers: {
    removeArticle(state, action) {
      state.articleContent = state.articleContent.filter(article => article.id !== action.payload);
      if (state.articleContent.length === 0) {
        state.totalPages = 0;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllArticle.fulfilled, (state, action: PayloadAction<IGetAllArticleResponseDTO>) => {
      state.articleContent = action.payload.content ?? [];
      state.totalPages = action.payload.totalPages;
    });
  },
});

export const { removeArticle } = articleContentSlice.actions;

export default articleContentSlice.reducer;
