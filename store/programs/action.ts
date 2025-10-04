import { articleService } from '@/utils/articles';
import { ContentBlockArrayRequestDTO, ContentBlockRequestDTO, NewArticleRequestDTO, PublishArticleRequestDTO } from '@/utils/articles/type/interface';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const allprogramss = createAsyncThunk(
  'programs/getAllprograms',
  async ({ page }: { page: number }, { rejectWithValue }) => {
    try {
      const response = await programService.getprograms({ page });

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const createNewprogram = createAsyncThunk(
  'programs/createNew',
  async (data: NewprogramRequestDTO, { rejectWithValue }) => {
    try {
      const response = await programService.createNewprogram(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

interface UpdateprogramPayload {
  id: number;
  data: NewprogramRequestDTO;
}

export const updateprogram = createAsyncThunk<
  any,
  UpdateprogramPayload
>(
  'programs/updateprogram',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await programService.updateprogram(id, data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const deleteprogram = createAsyncThunk(
  'programs/deleteprogram',
  async (id: number, { rejectWithValue }) => {
    try {
      await programService.deleteprogram(id);
      return id;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const publishprogram = createAsyncThunk(
  'programs/publishprogram',
  async (
    { id, data }: { id: number; data: PublishprogramRequestDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await programService.publishprogram(id, data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const getprogramById = createAsyncThunk(
  'programs/getprogramById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await programService.getprogramById({ id });

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const getprogramFullById = createAsyncThunk(
  'programs/getprogramFullById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await programService.getprogramFullById(id);

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
  'programs/createNewContentBlock',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await programService.createContentBlock(id, data);
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
  'programs/updateContentBlock',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await programService.updateContentBlock(id, data);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export const deleteContentBlock = createAsyncThunk(
  'programs/deleteContentBlock',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await programService.deleteContentBlock(id);
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
  'programs/createNewContentBlockArray',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await programService.createContentBlockArray(id, data);
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
  'programs/updateContentBlockArray',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await programService.updateContentBlockArray(id, data);
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);