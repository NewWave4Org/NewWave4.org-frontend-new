import { articleService } from '@/utils/articles';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const allArticles = createAsyncThunk(
  'articles/getAllArticles',
  async ({ page }: { page: number }, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticles({ page });

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);
