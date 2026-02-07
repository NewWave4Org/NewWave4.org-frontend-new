import { formsServices } from "@/utils/forms";
import { BecomeParthnerRequestDTO } from "@/utils/forms/type/interfaces";
import { normalizeApiError } from "@/utils/http/normalizeApiError";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const becomeParthner = createAsyncThunk('becomeParthner', async(data: BecomeParthnerRequestDTO, {rejectWithValue}) => {
  try {
    const response = await formsServices.becomeParthner(data);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const createSubscribe = createAsyncThunk('createSubscribe', async(email: string, {rejectWithValue}) => {
  try {
    const response = await formsServices.createSubscribe(email);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const confirmSubscribe = createAsyncThunk('confirmSubscribe', async(token: string, {rejectWithValue}) => {
  try {
    const response = await formsServices.confirmSubscribe(token);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});

export const confirmUnsubscribe = createAsyncThunk('confirmUnsubscribe', async(id: string, {rejectWithValue}) => {
  try {
    const response = await formsServices.confirmUnsubscribe(id);

    return response;
  } catch (error) {
     const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});