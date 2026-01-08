import { normalizeApiError } from "@/utils/http/normalizeApiError";
import { translateService } from "@/utils/translation";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createTranslation = createAsyncThunk('translation', async(id: number, {rejectWithValue}) => {
    console.log('id', id)
    try {
        const response = await translateService.translate(id);

        return response;
    } catch (error) {
        const normalized = normalizeApiError(error);
     
        return rejectWithValue(normalized);   
    }
})