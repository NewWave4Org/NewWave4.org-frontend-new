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
})