import { Article, ArticleResponseDTO, ContentBlockRequestDTO } from '@/utils/articles/type/interface';
import { createSlice } from '@reduxjs/toolkit';
import { allArticles, createContentBlock, createNewArticle, getArticleById, getArticleFullById } from './action';

interface articlesState {
  articles: Article[];
  totalPages: number;
  articleById: Article;
  articleFull: ArticleResponseDTO;
}

const initialState: articlesState = {
  articles: [],
  totalPages: 0,
  articleById: {
    id: 0,
    title: '',
    authorId: '',
    articleType: 'NEWS',
    authorName: '',
    newsProjectTag: '',
    newsStatus: 'Draft',
    previewDescription: '',
    previewImageUrl: '',
    publishedAt: null,
    views: 0,
  },
  articleFull: {
    id: 0,
    title: '',
    authorId: '',
    articleType: 'NEWS',
    authorName: '',
    newsProjectTag: '',
    newsStatus: 'Draft',
    previewDescription: '',
    previewImageUrl: '',
    publishedAt: null,
    views: 0,
    contentBlocks: []
  }
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
    builder.addCase(getArticleById.fulfilled, (state, action) => {
      state.articleById = action.payload;
    });
    builder.addCase(getArticleFullById.fulfilled, (state, action) => {
      state.articleFull = action.payload;
    });
    builder.addCase(createNewArticle.fulfilled, (state, action) => {
      state.articles.unshift(action.payload);
    });
    builder.addCase(createContentBlock.fulfilled, (state, action) => {
      if (state.articleFull) {
        state.articleFull.contentBlocks.push(action.payload);
      }
    });
  },
});

export default articlesSlice.reducer;
