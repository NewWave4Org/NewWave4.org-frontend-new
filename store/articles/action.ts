import { articleService } from '@/utils/articles';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const allArticles = createAsyncThunk(
  'articles/getAllArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticles();

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);
