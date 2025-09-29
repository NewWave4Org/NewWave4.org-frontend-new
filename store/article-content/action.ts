import { articleContentService } from '@/utils/article-content';
import { CreateNewArticleRequestDTO, IGetAllArticleRequestDTO, UpdateArticleRequestDTO } from '@/utils/article-content/type/interfaces';
import { ArticleType } from '@/utils/ArticleType';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const deleteArticle = createAsyncThunk('article-content/deleteArticle', async ({ id, articleType }: { id: number, articleType: ArticleType }, { rejectWithValue }) => {
  try {
    const response = await articleContentService.deleteArticle({ id, articleType });

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
});

export const getArticleById = createAsyncThunk('article-content/getArticleById', async ({ id, articleType }: { id: number, articleType: ArticleType }, { rejectWithValue }) => {
  try {
    const response = await articleContentService.getArticleById({ id, articleType });

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
});

export const getAllArticle = createAsyncThunk('article-content/getAllArticle', async ({ page, size, articleType, articleStatus }: IGetAllArticleRequestDTO, { rejectWithValue }) => {
  try {
    const response = await articleContentService.getAllArticle({ page, size, articleType, articleStatus });

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
});

export const createNewArticle = createAsyncThunk('article-content/createNewArticle', async (data: CreateNewArticleRequestDTO, { rejectWithValue }) => {
  try {
    const response = await articleContentService.createNewArticle(data);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
});

export const publishArticle = createAsyncThunk('article-content/publishArticle', async (id: number, { rejectWithValue }) => {
  try {
    const response = await articleContentService.publishArticle(id);

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
});

export const updateArticle = createAsyncThunk('article-content/updateArticle', async ({ id, data }: UpdateArticleRequestDTO, { rejectWithValue }) => {
  console.log('id', id)
  try {
    const response = await articleContentService.updateArticle({ id, data });

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
});


export const archivedArticle = createAsyncThunk('article-content/archivedArticle', async ({ id, articleType }: { id: number, articleType: ArticleType }, { rejectWithValue }) => {
  try {
    const response = await articleContentService.archivedArticle({ id, articleType });

    return response;
  } catch (error) {
    const normalized = normalizeApiError(error);

    return rejectWithValue(normalized);
  }
})