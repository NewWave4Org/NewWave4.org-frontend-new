import { donationService } from "@/utils/donation";
import { IDonationRequestDTO } from "@/utils/donation/type/interface";
import { normalizeApiError } from "@/utils/http/normalizeApiError";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllDonations = createAsyncThunk('get-all-donation', async(data:IDonationRequestDTO, {rejectWithValue}) => {
  try {
    const result = await donationService.getAllDonations(data);

    return result;
  } catch (error) {
    const normalized = normalizeApiError(error);
    return rejectWithValue(normalized);
  }
});