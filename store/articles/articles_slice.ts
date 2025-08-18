import { Article } from '@/utils/articles/type/interface';
import { createSlice } from '@reduxjs/toolkit';
import { allArticles } from './action';

interface articlesState {
  articles: Article[];
  totalPages: number;
}

const initialState: articlesState = {
  articles: [],
  totalPages: 0,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(allArticles.fulfilled, (state, action) => {
      state.articles = action.payload.content;
      state.totalPages = action.payload.totalPages;
    });
  },
});

export default articlesSlice.reducer;
