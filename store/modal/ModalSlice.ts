import { ArticleStatusEnum } from '@/utils/ArticleType';
import { createSlice } from '@reduxjs/toolkit';

interface ModalProps {
  isModalOpen: boolean;
  modalType: string | null;
  payload: unknown;
  title?: string;
  currentPage?: number,
  articleStatus?: ArticleStatusEnum | null,
  chooseSortType?: string;
  articlesOnPage?: number | null
}

const initialState: ModalProps = {
  modalType: null,
  isModalOpen: false,
  payload: null,
  title: '',
  currentPage: 0,
  articleStatus: null,
  chooseSortType: '',
  articlesOnPage: null,
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload.modalType;
      state.payload = action.payload.payload || null;
      state.title = action.payload.title || null || undefined;
      state.currentPage = action.payload.currentPage;
      state.articleStatus = action.payload.articleStatus;
      state.chooseSortType = action.payload.chooseSortType;
      state.articlesOnPage = action.payload.articlesOnPage;
    },
    closeModal: state => {
      state.isModalOpen = false;
      state.modalType = null;
      state.payload = null;
      state.title = '';
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
