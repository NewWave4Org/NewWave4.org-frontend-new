import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { photoService } from '@/utils/photos';
import { UploadPhotoParams } from '@/utils/photos/photo-service';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const uploadPhoto = createAsyncThunk(
    'photos/uploadPhoto',
    async (data: UploadPhotoParams, { rejectWithValue }) => {
        try {
            const response = await photoService.uploadPhoto(data);
            return response;
        } catch (error) {
            const normalized = normalizeApiError(error);
            return rejectWithValue(normalized);
        }
    },
);

export const deletePhoto = createAsyncThunk(
    'photos/deletePhoto',
    async (url: string, { rejectWithValue }) => {
        try {
            const response = await photoService.deletePhoto(url);
            return response;
        } catch (error) {
            const normalized = normalizeApiError(error);
            return rejectWithValue(normalized);
        }
    },
);