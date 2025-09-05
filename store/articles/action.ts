import { articleService } from '@/utils/articles';
import { ContentBlockArrayRequestDTO, ContentBlockRequestDTO, NewArticleRequestDTO, PublishArticleRequestDTO } from '@/utils/articles/type/interface';
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

export const createNewArticle = createAsyncThunk(
  'articles/createNew',
  async (data: NewArticleRequestDTO, { rejectWithValue }) => {
    try {
      const response = await articleService.createNewArticle(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

interface UpdateArticlePayload {
  id: number;
  data: NewArticleRequestDTO;
}

export const updateArticle = createAsyncThunk<
  any,
  UpdateArticlePayload
>(
  'articles/updateArticle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.updateArticle(id, data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      await articleService.deleteArticle(id);
      return id;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const publishArticle = createAsyncThunk(
  'articles/publishArticle',
  async (
    { id, data }: { id: number; data: PublishArticleRequestDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await articleService.publishArticle(id, data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const getArticleById = createAsyncThunk(
  'articles/getArticleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticleById({ id });

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const getArticleFullById = createAsyncThunk(
  'articles/getArticleFullById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticleFullById(id);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

interface CreateContentBlockPayload {
  id: number;
  data: ContentBlockRequestDTO;
}

export const createContentBlock = createAsyncThunk<
  any,
  CreateContentBlockPayload
>(
  'articles/createNewContentBlock',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.createContentBlock(id, data);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export const updateContentBlock = createAsyncThunk<
  any,
  CreateContentBlockPayload
>(
  'articles/updateContentBlock',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.updateContentBlock(id, data);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export const deleteContentBlock = createAsyncThunk(
  'articles/deleteContentBlock',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleService.deleteContentBlock(id);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

interface ContentBlockArrayPayload {
  id: number;
  data: ContentBlockArrayRequestDTO;
}

export const createContentBlockArray = createAsyncThunk<
  any,
  ContentBlockArrayPayload
>(
  'articles/createNewContentBlockArray',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.createContentBlockArray(id, data);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export const updateContentBlockArray = createAsyncThunk<
  any,
  ContentBlockArrayPayload
>(
  'articles/updateContentBlockArray',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.updateContentBlockArray(id, data);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);