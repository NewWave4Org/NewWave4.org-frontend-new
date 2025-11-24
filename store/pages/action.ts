import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { pagesServices } from '@/utils/pages';
import { IPagesRequestDTO } from '@/utils/pages/types/interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createdPages = createAsyncThunk('pages/createPage', async (data: IPagesRequestDTO, { rejectWithValue }) => {
  try {
    const response = await pagesServices.createdPages(data);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const getPages = createAsyncThunk('pages/getPage', async (pageType: string, { rejectWithValue }) => {
  try {
    const response = await pagesServices.getPages(pageType);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const updatePages = createAsyncThunk('pages/updatePage', async ({ id, data }: { id: number; data: IPagesRequestDTO }, { rejectWithValue }) => {
  try {
    const response = await pagesServices.updatePages(id, data);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});
