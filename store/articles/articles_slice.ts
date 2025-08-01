import { Article } from '@/utils/articles/type/interface';
import { createSlice } from '@reduxjs/toolkit';
import { allArticles } from './action';

interface articlesState {
  articles: Article[];
}

const initialState: articlesState = {
  articles: [],
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(allArticles.fulfilled, (state, action) => {
      state.articles = action.payload.content;
    });
  },
});

export default articlesSlice.reducer;
