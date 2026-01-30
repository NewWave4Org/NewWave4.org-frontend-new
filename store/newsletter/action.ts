import { normalizeApiError } from "@/utils/http/normalizeApiError";
import { newsletterService } from "@/utils/newsletter";
import { NewsletterRequestDTO } from "@/utils/newsletter/type/interface";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const sendNewsletter = createAsyncThunk('send-newsletter', async(data: NewsletterRequestDTO, {rejectWithValue}) => {
  try {
    const result = await newsletterService.sendNewsletter(data);

    return result;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});