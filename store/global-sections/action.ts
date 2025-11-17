import { globalSectionService } from '@/utils/global-sections';
import { IGlobalSectionsRequestDTO } from '@/utils/global-sections/type/interfaces';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createdGlobalSection = createAsyncThunk('global-section/create', async (data: IGlobalSectionsRequestDTO, { rejectWithValue }) => {
  try {
    const response = await globalSectionService.createdGlobalSections(data);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const getAllGlobalSections = createAsyncThunk('global-srction/all', async (_, { rejectWithValue }) => {
  try {
    const response = await globalSectionService.getAllGlobalSections();

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const getGlobalSectionByKey = createAsyncThunk('global-section/one-by-key', async (key: string, { rejectWithValue }) => {
  try {
    const response = await globalSectionService.getGlobalSectionByKey(key);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});
